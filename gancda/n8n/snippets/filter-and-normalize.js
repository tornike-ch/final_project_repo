// gancda · Filter & normalize
// n8n Code node, mode "Run Once for All Items".
// Put it straight after the Gmail Trigger (Simplify: OFF) and after the Tally Webhook node.
//
// For every inbound message it decides:
//   classify  -> should the AI step see it at all?
//   auto_ack  -> should the fixed acknowledgment go out?
// and reshapes Gmail and Tally input into one format for the rest of the flow.

const OWN_ADDRESSES = ['hello@gancda.com']; // never acknowledge ourselves (stops mail loops)
const ACK_COOLDOWN_DAYS = 30;               // at most one acknowledgment per sender per 30 days

const SYSTEM_SENDER =
  /^(no-?reply|do-?not-?reply|mailer-daemon|postmaster|bounces?|notifications?|alerts?|news(letter)?)([+._-][^@]*)?@/i;
const AUTO_SUBJECT =
  /^(auto(matic)?[ -]?reply|out of (the )?office|ooo\b|undeliver(able|ed)|delivery (status )?(notification|failure)|mail delivery (failed|subsystem)|returned mail)/i;

const DAY = 864e5;
const now = Date.now();

// Acknowledged senders persist between runs. n8n only saves this in production
// (active workflow) executions, not in manual test runs.
const state = $getWorkflowStaticData('global');
state.acked = state.acked || {};
for (const [addr, ts] of Object.entries(state.acked)) {
  if (now - Date.parse(ts) > ACK_COOLDOWN_DAYS * DAY) delete state.acked[addr];
}

// Gmail gives header values either as "Name: value" lines or as bare values; accept both.
function header(headers, name) {
  if (!headers) return '';
  const raw = headers[name] ?? headers[name.toLowerCase()];
  if (raw === undefined || raw === null) return '';
  const v = Array.isArray(raw) ? raw.join(' ') : String(raw);
  return v.replace(new RegExp('^\\s*' + name.replace(/-/g, '\\-') + '\\s*:\\s*', 'i'), '').trim();
}

function firstAddress(field) {
  if (!field) return { address: '', name: '' };
  if (typeof field === 'string') {
    const m = field.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
    return m ? { name: m[1].trim(), address: m[2].trim() } : { name: '', address: field.trim() };
  }
  const v = Array.isArray(field.value) ? field.value[0] : field;
  return { address: (v && v.address) || '', name: (v && v.name) || '' };
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<(style|script)[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function fromGmail(j) {
  const from = firstAddress(j.from);
  return {
    source: 'email',
    gmail_id: j.id || null,
    thread_id: j.threadId || null,
    message_id: j.messageId || header(j.headers, 'message-id') || null,
    from_address: from.address.toLowerCase(),
    from_name: from.name,
    subject: j.subject || '',
    text: j.text || stripHtml(j.html),
    received_at: new Date(j.date || now).toISOString(),
    _headers: j.headers || {},
    _labels: j.labelIds || [],
  };
}

function fromTally(j) {
  const body = j.body || j;
  const data = body.data || {};
  const fields = Array.isArray(data.fields) ? data.fields : [];
  const value = (f) => {
    if (Array.isArray(f.value) && Array.isArray(f.options)) {
      return f.value.map((id) => (f.options.find((o) => o.id === id) || {}).text || id).join(', ');
    }
    return Array.isArray(f.value) ? f.value.join(', ') : f.value;
  };
  const emailField = fields.find((f) => f.type === 'INPUT_EMAIL') || fields.find((f) => /e-?mail|ელ/i.test(f.label || ''));
  const nameField = fields.find((f) => /name|სახელ/i.test(f.label || ''));
  return {
    source: 'tally',
    gmail_id: null,
    thread_id: null,
    message_id: data.responseId || body.eventId || null,
    from_address: String((emailField && value(emailField)) || '').trim().toLowerCase(),
    from_name: String((nameField && value(nameField)) || '').trim(),
    subject: 'Form: ' + (data.formName || 'gancda'),
    text: fields
      .filter((f) => value(f) !== null && value(f) !== undefined && value(f) !== '')
      .map((f) => `${f.label || f.key}: ${value(f)}`)
      .join('\n'),
    received_at: new Date(body.createdAt || data.createdAt || now).toISOString(),
    _headers: {},
    _labels: [],
  };
}

const out = [];
for (const item of $input.all()) {
  const j = item.json;
  const isTally = Boolean((j.body && j.body.eventType === 'FORM_RESPONSE') || j.eventType === 'FORM_RESPONSE');
  const m = isTally ? fromTally(j) : fromGmail(j);
  const h = m._headers;
  const skip = []; // reasons not to classify (junk, automated or ourselves)

  const autoSubmitted = header(h, 'auto-submitted').toLowerCase();
  if (autoSubmitted && autoSubmitted !== 'no') skip.push('Auto-Submitted header');
  if (header(h, 'x-autoreply') || header(h, 'x-autorespond')) skip.push('autoreply header');
  if (/^(bulk|list|junk|auto_reply)$/i.test(header(h, 'precedence'))) skip.push('Precedence: ' + header(h, 'precedence'));
  if (header(h, 'list-id') || header(h, 'list-unsubscribe')) skip.push('mailing list');
  if (header(h, 'return-path') === '<>') skip.push('bounce (empty Return-Path)');
  if (/multipart\/report/i.test(header(h, 'content-type'))) skip.push('delivery report');
  if (m._labels.includes('SPAM')) skip.push('Gmail spam');
  if (!m.from_address) skip.push('no sender address');
  else if (OWN_ADDRESSES.includes(m.from_address)) skip.push('sent by gancda itself');
  else if (SYSTEM_SENDER.test(m.from_address)) skip.push('system sender');
  if (AUTO_SUBJECT.test(m.subject.trim())) skip.push('automatic-reply subject');

  const classify = skip.length === 0;
  let auto_ack = classify;
  const ackNote = [];
  // The sender asked not to receive auto-replies.
  if (auto_ack && /(all|autoreply|oof)/i.test(header(h, 'x-auto-response-suppress'))) {
    auto_ack = false;
    ackNote.push('X-Auto-Response-Suppress');
  }
  if (auto_ack && state.acked[m.from_address]) {
    auto_ack = false;
    ackNote.push('already acknowledged ' + state.acked[m.from_address].slice(0, 10));
  }
  // Recorded before the send; if the send fails, this sender gets no acknowledgment for the cooldown period.
  if (auto_ack) state.acked[m.from_address] = new Date(now).toISOString();

  delete m._headers;
  delete m._labels;
  out.push({ json: { ...m, classify, auto_ack, skip_reasons: skip.concat(ackNote) } });
}
return out;
