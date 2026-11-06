// gancda · Build digest
// n8n Code node, mode "Run Once for All Items". The Monday digest workflow embeds this file
// (gancda/build.mjs copies it into n8n/monday-digest.json).
//
// Reads: Settings, HubSpot leads (contacts received in the last 7 days OR waiting for approval),
//        Calendly events (optional).
// Writes one item: { to, subject, html } for the Gmail node.

const S = $('Settings').first().json;
const TZ = S.timezone || 'Asia/Tbilisi';
const ACK_SLA_MIN = Number(S.ack_sla_minutes) || 5;
const A_REPLY_SLA_H = Number(S.a_reply_sla_hours) || 24;
const DAY = 864e5;
const now = new Date();
const since = new Date(now.getTime() - 7 * DAY);
const errors = [];

const C = { ground: '#F1EEE8', card: '#FBFAF7', ink: '#111111', muted: '#5E5A54', rule: '#DDD7CC', red: '#D4202B' };

function nodeJson(name) {
  try {
    return $(name).first().json;
  } catch (err) {
    errors.push(`${name} did not run.`);
    return null;
  }
}
const errText = (err) =>
  typeof err === 'string' ? err : String((err && (err.message || err.description)) || JSON.stringify(err)).slice(0, 240);
const toDate = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const d = /^\d+$/.test(String(v)) ? new Date(Number(v)) : new Date(v);
  return isNaN(d.getTime()) ? null : d;
};
const esc = (s) =>
  String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const fmt = (d, opts) => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...opts }).format(d);
const day = (d) => fmt(d, { day: 'numeric', month: 'short' });
const when = (d) => fmt(d, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dur = (mins) => {
  if (mins < 60) return `${Math.max(0, Math.round(mins))} min`;
  const h = mins / 60;
  return h < 48 ? `${Math.round(h * 10) / 10} h` : `${Math.round(h / 24)} d`;
};
const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

// ---- HubSpot ----
const hs = nodeJson('HubSpot leads');
let contacts = [];
if (hs) {
  if (hs.error) errors.push('HubSpot: ' + errText(hs.error));
  else {
    contacts = Array.isArray(hs.results) ? hs.results : [];
    if (hs.paging && hs.paging.next) errors.push('HubSpot matched more than 100 contacts. Only the first 100 are counted.');
  }
}
const rows = contacts.map((c) => {
  const p = c.properties || {};
  const link = S.hubspot_portal_id
    ? `${String(S.hubspot_app_url || 'https://app.hubspot.com').replace(/\/$/, '')}/contacts/${S.hubspot_portal_id}/record/0-1/${c.id}`
    : null;
  return {
    name: [p.firstname, p.lastname].filter(Boolean).join(' ') || p.email || '(no name)',
    company: p.company || '',
    score: String(p.gancda_lead_score || '').toUpperCase(),
    source: p.gancda_source || 'email',
    summary: p.gancda_summary || '',
    received: toDate(p.gancda_received_at),
    acked: toDate(p.gancda_ack_sent_at),
    replied: toDate(p.gancda_first_reply_at),
    approval: String(p.gancda_approval_status || '').toLowerCase(),
    link,
  };
});
const week = rows.filter((r) => r.received && r.received >= since);
const pending = rows.filter((r) => r.approval === 'pending').sort((a, b) => (a.received || now) - (b.received || now));
const by = (s) => week.filter((r) => r.score === s);
const A = by('A');
const B = by('B');
const Cs = by('C');
const unscored = week.filter((r) => !['A', 'B', 'C'].includes(r.score));

// Acknowledgment times (C is excluded: junk never gets an acknowledgment).
const ackable = week.filter((r) => r.score !== 'C');
const ackMins = ackable.filter((r) => r.acked).map((r) => (r.acked - r.received) / 6e4);
const ackMedian = median(ackMins);
const ackOver = ackMins.filter((m) => m > ACK_SLA_MIN).length;
const ackMissing = ackable.filter((r) => !r.acked).length;

// Founder reply times for A leads.
const aStatus = (r) => {
  if (r.replied) {
    const h = (r.replied - r.received) / 36e5;
    return { text: `Replied in ${dur(h * 60)}`, late: h > A_REPLY_SLA_H };
  }
  const h = (now - r.received) / 36e5;
  return { text: `No reply yet, ${dur(h * 60)} since it arrived`, late: h > A_REPLY_SLA_H };
};
const aLate = A.filter((r) => aStatus(r).late).length;

// ---- Calendly (optional) ----
const cal = nodeJson('Calendly events');
let events = null;
if (cal) {
  if (Array.isArray(cal.collection)) events = cal.collection;
  else if (cal.error) errors.push('Calendly: ' + errText(cal.error) + '. If you don’t use the Calendly API, disable the two Calendly nodes.');
}
const booked = events ? events.filter((ev) => (toDate(ev.created_at) || 0) >= since) : [];
const upcoming = events
  ? events
      .filter((ev) => {
        const t = toDate(ev.start_time);
        return t && t >= now && t - now <= 7 * DAY;
      })
      .sort((a, b) => toDate(a.start_time) - toDate(b.start_time))
  : [];

// ---- HTML ----
const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";
const tile = (label, value, sub, alert) => `
  <td width="50%" style="padding:6px;vertical-align:top;">
    <div style="background:${C.card};border:1px solid ${alert ? C.red : C.rule};border-radius:10px;padding:14px 16px;">
      <div style="font-size:12px;color:${C.muted};">${esc(label)}</div>
      <div style="font-size:28px;font-weight:700;line-height:1.2;color:${alert ? C.red : C.ink};">${esc(value)}</div>
      <div style="font-size:12px;color:${C.muted};">${esc(sub)}</div>
    </div>
  </td>`;
const section = (title, inner) => `
  <tr><td style="padding:22px 6px 6px;">
    <div style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:${C.muted};border-bottom:1px solid ${C.rule};padding-bottom:6px;">${esc(title)}</div>
    ${inner}
  </td></tr>`;
const nameHtml = (r) =>
  (r.link ? `<a href="${esc(r.link)}" style="color:${C.ink};font-weight:600;">${esc(r.name)}</a>` : `<b>${esc(r.name)}</b>`) +
  (r.company ? ` <span style="color:${C.muted};">· ${esc(r.company)}</span>` : '');
const leadRow = (r, extra) => `
  <div style="padding:10px 0;border-bottom:1px solid ${C.rule};">
    <div>${nameHtml(r)}</div>
    ${r.summary ? `<div style="font-size:14px;margin-top:2px;">${esc(r.summary)}</div>` : ''}
    ${extra || ''}
  </div>`;
const none = (text) => `<div style="padding:10px 0;color:${C.muted};font-size:14px;">${esc(text)}</div>`;

const aHtml = A.length
  ? A.map((r) => {
      const st = aStatus(r);
      return leadRow(r, `<div style="font-size:13px;margin-top:4px;color:${st.late ? C.red : C.muted};">${esc(st.text)}${st.late ? ` (target: ${A_REPLY_SLA_H} h)` : ''}</div>`);
    }).join('')
  : none('No A leads this week.');

const pendingHtml = pending.length
  ? pending
      .map((r) =>
        leadRow(
          r,
          `<div style="font-size:13px;margin-top:4px;color:${C.muted};">${esc(r.score || 'unscored')} · waiting ${r.received ? dur((now - r.received) / 6e4) : '?'}</div>`
        )
      )
      .join('')
  : none('Nothing is waiting for your approval.');

const bHtml = B.length ? B.map((r) => leadRow(r)).join('') : none('No B leads this week.');

const timesHtml = `
  <div style="font-size:14px;padding:10px 0;line-height:1.6;">
    Acknowledgments: ${ackMins.length ? `median ${esc(dur(ackMedian))}, slowest ${esc(dur(Math.max(...ackMins)))}` : 'none sent'}${
      ackOver ? `, <span style="color:${C.red};">${ackOver} over ${ACK_SLA_MIN} min</span>` : ''
    }${ackMissing ? `, <span style="color:${C.red};">${ackMissing} lead${ackMissing > 1 ? 's' : ''} never acknowledged</span>` : ''}.<br>
    Your replies to A leads: ${A.length ? `${A.length - aLate} of ${A.length} within ${A_REPLY_SLA_H} h` : 'no A leads'}.
  </div>`;

const meetingsHtml =
  events === null
    ? none('Calendly is not connected.')
    : (booked.length ? '' : none('No meetings booked this week.')) +
      (upcoming.length
        ? `<div style="font-size:13px;color:${C.muted};padding-top:10px;">Coming up</div>` +
          upcoming
            .map((ev) => `<div style="font-size:14px;padding:4px 0;">${esc(when(toDate(ev.start_time)))} · ${esc(ev.name || 'Meeting')}</div>`)
            .join('')
        : '');

const errorsHtml = errors.length
  ? `<tr><td style="padding:18px 6px 0;"><div style="border:1px solid ${C.red};border-radius:10px;padding:12px 14px;font-size:13px;">
       <b style="color:${C.red};">Some data is missing</b><br>${errors.map(esc).join('<br>')}</div></td></tr>`
  : '';

const range = `${day(since)} – ${day(now)}`;
const total = week.length;
const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${C.ground};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ground};">
<tr><td align="center" style="padding:24px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;${font}color:${C.ink};">
  <tr><td style="padding:0 6px 14px;">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      ${S.mark_png_url ? `<td style="vertical-align:middle;padding-right:12px;"><img src="${esc(S.mark_png_url)}" width="40" height="40" alt="*" style="display:block;border:0;"></td>` : ''}
      <td style="vertical-align:middle;">
        <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${C.muted};">gancda · Monday digest</div>
        <div style="font-size:22px;font-weight:700;">${esc(range)}</div>
      </td>
    </tr></table>
  </td></tr>
  ${errorsHtml}
  <tr><td style="padding-top:8px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>${tile('New leads', String(total), `${A.length} A · ${B.length} B · ${Cs.length} C${unscored.length ? ` · ${unscored.length} unscored` : ''}`, false)}
          ${tile('Waiting on you', String(pending.length), pending.length ? 'drafts to approve' : 'all clear', pending.length > 0)}</tr>
      <tr>${tile('Meetings booked', events === null ? '–' : String(booked.length), events === null ? 'Calendly not connected' : `${upcoming.length} in the next 7 days`, false)}
          ${tile('Acknowledgment time', ackMedian === null ? '–' : dur(ackMedian), ackMins.length ? (ackOver ? `${ackOver} over ${ACK_SLA_MIN} min` : `all within ${ACK_SLA_MIN} min`) : 'none sent', ackOver > 0 || ackMissing > 0)}</tr>
    </table>
  </td></tr>
  ${section('A leads', aHtml)}
  ${section('Waiting on you', pendingHtml)}
  ${section('B leads', bHtml)}
  ${section('Response times', timesHtml)}
  ${section('Meetings', meetingsHtml)}
  <tr><td style="padding:26px 6px 0;font-size:12px;color:${C.muted};">
    ${Cs.length} C message${Cs.length === 1 ? '' : 's'} logged and archived. Sent by the n8n “gancda · Monday digest” workflow.
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

const subject =
  `gancda weekly · ${A.length} A / ${B.length} B / ${Cs.length} C` +
  (pending.length ? ` · ${pending.length} waiting on you` : '') +
  (errors.length ? ' · some data missing' : '');

return [{ json: { to: S.founder_email, subject, html } }];
