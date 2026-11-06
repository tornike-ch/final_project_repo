// POST /api/e/:slug/events: one thing a player did (opened, accepted, answered, finished...).
import { json, fail, guard, body, str, db, SLUG_RE } from '../../../../lib/util.js';

export const TYPES = ['view', 'start', 'yes', 'no', 'picks', 'reveal', 'confirm', 'answer', 'complete'];
const PER_VISITOR = 300;

export const onRequestPost = guard(async ({ params, request, env }) => {
  const slug = String(params.slug || '');
  if (!SLUG_RE.test(slug)) return fail(404, 'not found');
  const b = await body(request, 4096);
  const type = TYPES.includes(b.type) ? b.type : null;
  const visitor = /^[a-z0-9]{8,32}$/.test(b.visitor || '') ? b.visitor : null;
  if (!type || !visitor) return fail(400, 'type and visitor are required');

  const D = await db(env);
  const e = await D.prepare('SELECT active FROM experiences WHERE slug = ?').bind(slug).first();
  if (!e || !e.active) return fail(404, 'not found');
  const seen = await D.prepare('SELECT COUNT(*) AS n FROM events WHERE slug = ? AND visitor = ?').bind(slug, visitor).first();
  if (seen && seen.n >= PER_VISITOR) return json({ ok: true, ignored: true });

  const data = b.data && typeof b.data === 'object' ? JSON.stringify(clean(b.data)).slice(0, 2000) : null;
  await D.prepare('INSERT INTO events (slug, visitor, type, data) VALUES (?,?,?,?)').bind(slug, visitor, type, data).run();
  return json({ ok: true }, 201);
});

// Keep only small scalar fields and short string arrays.
function clean(d) {
  const out = {};
  for (const [k, v] of Object.entries(d).slice(0, 12)) {
    if (!/^[a-z]{1,16}$/i.test(k)) continue;
    if (typeof v === 'number' && isFinite(v)) out[k] = v;
    else if (typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'string') out[k] = str(v, 120);
    else if (Array.isArray(v)) out[k] = v.slice(0, 12).map(x => str(x, 80)).filter(Boolean);
  }
  return out;
}
