// GET    /api/admin/experiences/:grp: one group with every link and its results.
// PATCH  /api/admin/experiences/:grp {active?, title?}: switch links off or on, rename.
// DELETE /api/admin/experiences/:grp: remove the group, its links and their recorded events.
import { json, fail, guard, body, str, db } from '../../../../lib/util.js';
import { linkStats, groupStats } from '../../../../lib/stats.js';

const GRP_RE = /^[a-z0-9]{10}$/;

async function load(D, grp) {
  const { results } = await D.prepare('SELECT slug, created_at, title, template, recipient, lang, overrides, active FROM experiences WHERE grp = ? ORDER BY recipient').bind(grp).all();
  return results;
}

export const onRequestGet = guard(async ({ params, env }) => {
  if (!GRP_RE.test(params.grp || '')) return fail(404, 'not found');
  const D = await db(env);
  const rows = await load(D, params.grp);
  if (!rows.length) return fail(404, 'not found');
  const slugs = rows.map(r => r.slug);
  const [per, total] = await Promise.all([linkStats(D, slugs), groupStats(D, slugs)]);
  const f = rows[0];
  return json({ ok: true, group: { grp: params.grp, title: f.title, template: f.template, lang: f.lang, created_at: f.created_at,
    active: rows.some(r => r.active), overrides: JSON.parse(f.overrides || '{}'), stats: total },
    links: rows.map(r => ({ slug: r.slug, recipient: r.recipient, active: !!r.active, ...per[r.slug] })) });
});

export const onRequestPatch = guard(async ({ params, request, env }) => {
  if (!GRP_RE.test(params.grp || '')) return fail(404, 'not found');
  const b = await body(request);
  const D = await db(env);
  const title = b.title !== undefined ? str(b.title, 120) : null;
  const active = typeof b.active === 'boolean' ? (b.active ? 1 : 0) : null;
  const r = await D.prepare('UPDATE experiences SET title = COALESCE(?, title), active = COALESCE(?, active) WHERE grp = ? RETURNING slug').bind(title, active, params.grp).all();
  return r.results.length ? json({ ok: true, updated: r.results.length }) : fail(404, 'not found');
});

export const onRequestDelete = guard(async ({ params, env }) => {
  if (!GRP_RE.test(params.grp || '')) return fail(404, 'not found');
  const D = await db(env);
  const rows = await load(D, params.grp);
  if (!rows.length) return fail(404, 'not found');
  await D.batch([
    D.prepare('DELETE FROM events WHERE slug IN (SELECT slug FROM experiences WHERE grp = ?)').bind(params.grp),
    D.prepare('DELETE FROM experiences WHERE grp = ?').bind(params.grp)
  ]);
  return json({ ok: true, deleted: rows.length });
});
