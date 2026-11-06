// POST /api/requests: the site's request form. Saves the request and, if configured, emails a notice.
import { json, fail, guard, body, str, db, sha256 } from '../../lib/util.js';

const WHO = ['learn', 'onboard', 'engage', 'attend'];

export const onRequestPost = guard(async ({ request, env, waitUntil }) => {
  const b = await body(request);
  // Honeypot: real visitors never fill the hidden "website" field.
  if (str(b.website, 200)) return json({ ok: true });

  const name = str(b.name, 120), contact = str(b.contact, 200);
  if (!name) return fail(400, 'name is required');
  if (!contact || !(/@/.test(contact) || contact.replace(/\D/g, '').length >= 9)) return fail(400, 'contact must be an email, @handle or phone number');

  const D = await db(env);
  const day = new Date().toISOString().slice(0, 10);
  const ip = request.headers.get('cf-connecting-ip') || '';
  const ipHash = (await sha256(day + '|' + ip + '|' + (env.ADMIN_PASSWORD || ''))).slice(0, 24);
  const recent = await D.prepare(`SELECT COUNT(*) AS n FROM requests WHERE ip_hash = ? AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-10 minutes')`).bind(ipHash).first();
  if (recent && recent.n >= 5) return fail(429, 'too many requests, try again in a few minutes');

  const row = {
    slip: str(b.slip, 12), who: WHO.includes(b.who) ? b.who : null, interest: str(b.interest, 40),
    template: str(b.template, 40), name, contact, message: str(b.message, 4000), lang: b.lang === 'en' ? 'en' : 'ka'
  };
  const r = await D.prepare(`INSERT INTO requests (slip, who, interest, template, name, contact, message, lang, ip_hash) VALUES (?,?,?,?,?,?,?,?,?) RETURNING id`)
    .bind(row.slip, row.who, row.interest, row.template, row.name, row.contact, row.message, row.lang, ipHash).first();

  if (env.RESEND_API_KEY && env.NOTIFY_TO) waitUntil(notify(env, r.id, row, str(b.summary, 6000)));
  return json({ ok: true, id: r.id }, 201);
});

// Optional email notice through Resend (https://resend.com). Off unless both variables are set.
async function notify(env, id, row, summary) {
  const text = (summary || Object.entries(row).map(([k, v]) => k + ': ' + (v || '-')).join('\n')) +
    '\n\n' + (env.SITE_URL || 'https://gancda.com') + '/admin/#requests';
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: 'Bearer ' + env.RESEND_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ from: env.NOTIFY_FROM || 'Gancda <hello@gancda.com>', to: env.NOTIFY_TO.split(',').map(s => s.trim()),
        reply_to: /@/.test(row.contact) ? row.contact : undefined, subject: 'New request #' + id + ': ' + row.name, text })
    });
    if (!res.ok) console.error('notify failed', res.status, await res.text());
  } catch (e) { console.error('notify failed', e); }
}
