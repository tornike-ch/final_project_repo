// Turns raw player events into per-link and per-group results.

export const TEMPLATES = {
  omakase: 'invite', supra: 'invite', trattoria: 'invite', qvevri: 'invite', embers: 'invite', golden: 'invite',
  proposal: 'invite', birthday: 'invite', interview: 'invite', corporate: 'invite', academy: 'lesson', campaign: 'lesson'
};

// Per-link funnel: unique visitors who reached each event type, plus the last activity time.
export async function linkStats(D, slugs) {
  const out = Object.fromEntries(slugs.map(s => [s, { visitors: 0, reached: {}, last: null, best: null }]));
  if (!slugs.length) return out;
  for (const part of chunks(slugs, 90)) {
    const ph = part.map(() => '?').join(',');
    const { results } = await D.prepare(`SELECT slug, type, COUNT(DISTINCT visitor) AS v, MAX(created_at) AS last FROM events WHERE slug IN (${ph}) GROUP BY slug, type`).bind(...part).all();
    for (const r of results) {
      const o = out[r.slug];
      o.reached[r.type] = r.v;
      if (r.type === 'view') o.visitors = r.v;
      if (!o.last || r.last > o.last) o.last = r.last;
    }
    const best = await D.prepare(`SELECT slug, MAX(CAST(json_extract(data,'$.score') AS INTEGER)) AS score, MAX(CAST(json_extract(data,'$.n') AS INTEGER)) AS n FROM events WHERE type = 'complete' AND slug IN (${ph}) GROUP BY slug`).bind(...part).all();
    for (const r of best.results) out[r.slug].best = { score: r.score, n: r.n };
  }
  return out;
}

// Group totals: the funnel across all its links, average score, what people picked, how each question went.
export async function groupStats(D, slugs) {
  const empty = { visitors: 0, reached: {}, avgScore: null, completions: 0, picks: [], questions: [] };
  if (!slugs.length) return empty;
  const res = { ...empty };
  for (const part of chunks(slugs, 90)) {
    const p = part.map(() => '?').join(',');
    const f = await D.prepare(`SELECT type, COUNT(DISTINCT slug || ':' || visitor) AS v FROM events WHERE slug IN (${p}) GROUP BY type`).bind(...part).all();
    for (const r of f.results) res.reached[r.type] = (res.reached[r.type] || 0) + r.v;
    const s = await D.prepare(`SELECT COUNT(*) AS n, SUM(CAST(json_extract(data,'$.score') AS REAL)) AS sum, MAX(CAST(json_extract(data,'$.n') AS INTEGER)) AS q FROM events WHERE type = 'complete' AND slug IN (${p})`).bind(...part).first();
    if (s && s.n) { res.completions += s.n; res._sum = (res._sum || 0) + s.sum; res._q = Math.max(res._q || 0, s.q || 0); }
    const pk = await D.prepare(`SELECT j.value AS item, COUNT(*) AS n FROM events, json_each(json_extract(events.data,'$.items')) AS j WHERE events.type = 'picks' AND events.slug IN (${p}) GROUP BY j.value`).bind(...part).all();
    for (const r of pk.results) { const e = res.picks.find(x => x.item === r.item); if (e) e.n += r.n; else res.picks.push({ item: r.item, n: r.n }); }
    const qs = await D.prepare(`SELECT CAST(json_extract(data,'$.q') AS INTEGER) AS q, COUNT(*) AS n, SUM(CASE WHEN json_extract(data,'$.ok') THEN 1 ELSE 0 END) AS ok FROM events WHERE type = 'answer' AND slug IN (${p}) GROUP BY q`).bind(...part).all();
    for (const r of qs.results) { const e = res.questions.find(x => x.q === r.q); if (e) { e.n += r.n; e.ok += r.ok; } else res.questions.push({ q: r.q, n: r.n, ok: r.ok }); }
  }
  res.visitors = res.reached.view || 0;
  res.avgScore = res.completions ? Math.round(res._sum / res.completions * 10) / 10 : null;
  res.maxScore = res._q || null;
  delete res._sum; delete res._q;
  res.picks.sort((a, b) => b.n - a.n);
  res.questions.sort((a, b) => a.q - b.q);
  return res;
}

function chunks(a, n) { const out = []; for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n)); return out; }
