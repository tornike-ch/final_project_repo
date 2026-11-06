// PATCH /api/admin/requests/:id {status?, note?}   DELETE /api/admin/requests/:id
import { json, fail, guard, body, str, db } from '../../../../lib/util.js';
import { STATUSES } from '../requests.js';

const idOf = p => (/^\d{1,12}$/.test(p.id || '') ? +p.id : null);

export const onRequestPatch = guard(async ({ params, request, env }) => {
  const id = idOf(params); if (!id) return fail(404, 'not found');
  const b = await body(request);
  if (b.status !== undefined && !STATUSES.includes(b.status)) return fail(400, 'status must be one of ' + STATUSES.join(', '));
  const D = await db(env);
  const r = await D.prepare('UPDATE requests SET status = COALESCE(?, status), note = CASE WHEN ? THEN ? ELSE note END WHERE id = ? RETURNING id, status, note')
    .bind(b.status || null, b.note !== undefined ? 1 : 0, str(b.note, 2000), id).first();
  return r ? json({ ok: true, request: r }) : fail(404, 'not found');
});

export const onRequestDelete = guard(async ({ params, env }) => {
  const id = idOf(params); if (!id) return fail(404, 'not found');
  const D = await db(env);
  const r = await D.prepare('DELETE FROM requests WHERE id = ? RETURNING id').bind(id).first();
  return r ? json({ ok: true }) : fail(404, 'not found');
});
