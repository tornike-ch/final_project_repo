// GET /api/e/:slug: what the player needs to render one shared experience.
import { json, fail, guard, db, SLUG_RE } from '../../../lib/util.js';

export const onRequestGet = guard(async ({ params, env }) => {
  const slug = String(params.slug || '');
  if (!SLUG_RE.test(slug)) return fail(404, 'not found');
  const D = await db(env);
  const e = await D.prepare('SELECT slug, template, recipient, lang, overrides, active FROM experiences WHERE slug = ?').bind(slug).first();
  if (!e || !e.active) return fail(404, 'not found');
  return json({ ok: true, slug: e.slug, template: e.template, lang: e.lang, overrides: JSON.parse(e.overrides || '{}') });
});
