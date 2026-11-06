// GET /e/:slug: serve the site page; its script sees the /e/ path and opens the shared experience full screen.
export async function onRequestGet({ request, env }) {
  const res = await env.ASSETS.fetch(new URL('/play', request.url));
  const out = new Response(res.body, res);
  out.headers.set('cache-control', 'no-store');
  out.headers.set('x-robots-tag', 'noindex');
  return out;
}
