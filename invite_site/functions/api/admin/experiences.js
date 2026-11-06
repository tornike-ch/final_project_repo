// GET  /api/admin/experiences: every group of links, newest first, with its totals.
// POST /api/admin/experiences {title, template, lang, overrides, recipients[]}: create a group,
//      one link per recipient (or a single shared link when there are none).
import { json, fail, guard, body, str, db, slug } from '../../../lib/util.js';
import { TEMPLATES, groupStats } from '../../../lib/stats.js';

// What a link may change on its template. Everything is plain text; the page escapes it.
const FIELDS = { to: 80, from: 80, intro: 400, q: 200, venue: 80, sub: 120, sign: 200 };
const MAX_LINKS = 200;

export function cleanOverrides(o) {
  const out = {};
  if (!o || typeof o !== 'object') return out;
  for (const [k, max] of Object.entries(FIELDS)) { const v = str(o[k], max); if (v) out[k] = v; }
  if (typeof o.at === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(o.at) && !isNaN(Date.parse(o.at))) out.at = o.at;
  return out;
}

export const onRequestGet = guard(async ({ env }) => {
  const D = await db(env);
  const { results } = await D.prepare(`SELECT grp, MIN(created_at) AS created_at, MAX(title) AS title, MAX(template) AS template, COUNT(*) AS links, MAX(active) AS active
    FROM experiences GROUP BY grp ORDER BY created_at DESC LIMIT 200`).all();
  const groups = [];
  for (const g of results) {
    const { results: s } = await D.prepare('SELECT slug FROM experiences WHERE grp = ?').bind(g.grp).all();
    const st = await groupStats(D, s.map(x => x.slug));
    groups.push({ ...g, active: !!g.active, stats: { visitors: st.visitors, reached: st.reached, avgScore: st.avgScore, maxScore: st.maxScore } });
  }
  return json({ ok: true, groups, templates: TEMPLATES });
});

export const onRequestPost = guard(async ({ request, env }) => {
  const b = await body(request, 65536);
  const template = String(b.template || '');
  if (!TEMPLATES[template]) return fail(400, 'unknown template');
  const title = str(b.title, 120);
  if (!title) return fail(400, 'title is required');
  const lang = b.lang === 'en' ? 'en' : 'ka';
  const base = cleanOverrides(b.overrides);
  const names = (Array.isArray(b.recipients) ? b.recipients : String(b.recipients || '').split('\n'))
    .map(x => str(x, 80)).filter(Boolean);
  if (names.length > MAX_LINKS) return fail(400, 'at most ' + MAX_LINKS + ' recipients per group');

  const D = await db(env);
  const grp = slug(10);
  const rows = (names.length ? names : [base.to || null]).map(name => ({
    slug: slug(7), recipient: name, overrides: JSON.stringify(name ? { ...base, to: name } : base)
  }));
  await D.batch(rows.map(r => D.prepare('INSERT INTO experiences (slug, grp, title, template, recipient, lang, overrides) VALUES (?,?,?,?,?,?,?)')
    .bind(r.slug, grp, title, template, r.recipient, lang, r.overrides)));
  return json({ ok: true, grp, links: rows.map(r => ({ slug: r.slug, recipient: r.recipient })) }, 201);
});
