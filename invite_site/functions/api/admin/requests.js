// GET /api/admin/requests?status=new: the request inbox, newest first.
import { json, guard, db } from '../../../lib/util.js';

export const STATUSES = ['new', 'contacted', 'won', 'closed', 'spam'];

export const onRequestGet = guard(async ({ request, env }) => {
  const u = new URL(request.url), status = u.searchParams.get('status');
  const D = await db(env);
  const where = STATUSES.includes(status) ? 'WHERE status = ?' : "WHERE status != 'spam'";
  const q = D.prepare(`SELECT id, created_at, slip, who, interest, template, name, contact, message, lang, status, note FROM requests ${where} ORDER BY id DESC LIMIT 500`);
  const { results } = await (STATUSES.includes(status) ? q.bind(status) : q).all();
  const counts = await D.prepare('SELECT status, COUNT(*) AS n FROM requests GROUP BY status').all();
  return json({ ok: true, requests: results, counts: Object.fromEntries(counts.results.map(r => [r.status, r.n])) });
});
