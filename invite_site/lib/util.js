// Shared helpers for the Pages Functions: responses, the database schema, auth and small validators.

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
  });

export const fail = (status, error) => json({ ok: false, error }, status);

// The schema is created on first use, so a fresh D1 database needs no manual setup.
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS requests (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
     slip TEXT, who TEXT, interest TEXT, template TEXT,
     name TEXT NOT NULL, contact TEXT NOT NULL, message TEXT, lang TEXT,
     status TEXT NOT NULL DEFAULT 'new', note TEXT, ip_hash TEXT)`,
  `CREATE INDEX IF NOT EXISTS requests_created ON requests(created_at)`,
  `CREATE TABLE IF NOT EXISTS experiences (
     slug TEXT PRIMARY KEY,
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
     grp TEXT NOT NULL, title TEXT NOT NULL, template TEXT NOT NULL,
     recipient TEXT, lang TEXT NOT NULL DEFAULT 'ka',
     overrides TEXT NOT NULL DEFAULT '{}', active INTEGER NOT NULL DEFAULT 1)`,
  `CREATE INDEX IF NOT EXISTS experiences_grp ON experiences(grp)`,
  `CREATE TABLE IF NOT EXISTS events (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
     slug TEXT NOT NULL, visitor TEXT NOT NULL, type TEXT NOT NULL, data TEXT)`,
  `CREATE INDEX IF NOT EXISTS events_slug ON events(slug, type)`
];
let ready = null;
export function db(env) {
  if (!env.DB) throw new HttpError(500, 'database not bound: add a D1 binding named DB');
  if (!ready) ready = env.DB.batch(SCHEMA.map(s => env.DB.prepare(s))).catch(e => { ready = null; throw e; });
  return ready.then(() => env.DB);
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const guard = fn => async ctx => {
  try { return await fn(ctx); }
  catch (e) {
    if (e instanceof HttpError) return fail(e.status, e.message);
    console.error(e);
    return fail(500, 'server error');
  }
};

export async function body(request, max = 16384) {
  const text = await request.text();
  if (text.length > max) throw new HttpError(413, 'body too large');
  try { const v = JSON.parse(text); if (v && typeof v === 'object') return v; } catch (e) {}
  throw new HttpError(400, 'expected a JSON object');
}

// Trimmed string with a length cap; empty becomes null.
export const str = (v, max) => {
  if (v == null) return null;
  const s = String(v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
  return s || null;
};

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Constant-time comparison of the presented password with ADMIN_PASSWORD (both hashed first).
export async function isAdmin(request, env) {
  const want = env.ADMIN_PASSWORD;
  if (!want || want.length < 12) return false;
  const m = /^Bearer (.+)$/.exec(request.headers.get('authorization') || '');
  if (!m) return false;
  const [a, b] = await Promise.all([sha256(m[1]), sha256(want)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const ABC = 'abcdefghjkmnpqrstuvwxyz23456789';
export function slug(n = 7) {
  const r = crypto.getRandomValues(new Uint8Array(n));
  return [...r].map(x => ABC[x % ABC.length]).join('');
}

export const SLUG_RE = /^[a-z0-9]{5,16}$/;
