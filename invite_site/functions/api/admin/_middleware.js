// Every /api/admin/* route needs the ADMIN_PASSWORD as a bearer token.
import { fail, isAdmin } from '../../../lib/util.js';

export async function onRequest(ctx) {
  if (!ctx.env.ADMIN_PASSWORD || ctx.env.ADMIN_PASSWORD.length < 12) return fail(503, 'admin is off: set ADMIN_PASSWORD (12+ characters) in the Pages project settings');
  if (!(await isAdmin(ctx.request, ctx.env))) {
    await new Promise(r => setTimeout(r, 600)); // slow down guessing
    return fail(401, 'wrong password');
  }
  return ctx.next();
}
