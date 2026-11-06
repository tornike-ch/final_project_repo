(function(){
'use strict';
/*COPY*/

const ONLINE = location.protocol === 'https:' || location.protocol === 'http:';
const CONFIG = {formEndpoint: ONLINE ? '/api/requests' : '', email: 'hello@gancda.com'};
const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store = {get(k){ try { return localStorage.getItem('gancda.' + k); } catch (e) { return null; } }, set(k, v){ try { localStorage.setItem('gancda.' + k, v); } catch (e) {} }};
const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
let lang = store.get('lang') === 'en' ? 'en' : 'ka';
const tx = v => v && typeof v === 'object' && 'ka' in v ? v[lang] : v;
const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (_, k) => o[k] != null ? o[k] : '');
const path = (o, p) => p.split('.').reduce((a, k) => a == null ? a : a[k], o);

/* ---------- icons: one line set ---------- */
const P = {
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>', check:'<path d="M5 12.5l4.5 4.5L19 7"/>', mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  learn:'<path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M7 10v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5M21 8v6"/>',
  onboard:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z"/>',
  engage:'<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="17.5" cy="13.8" r="1" fill="currentColor"/>',
  attend:'<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5V7z"/><path d="M14 5v14" stroke-dasharray="2 2.5"/>',
  star:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  cal:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', shirt:'<path d="M8 4l-4 3 2 4 2-1v10h8V10l2 1 2-4-4-3c-.5 1.5-2 2.5-4 2.5S8.5 5.5 8 4z"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01" stroke-width="3"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z"/>', lock:'<rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>', refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>', bolt:'<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>', chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>', gift:'<rect x="3.5" y="8" width="17" height="5" rx="1.5"/><path d="M5 13v7h14v-7M12 8v12M12 8c-2-3-6-3-5 0M12 8c2-3 6-3 5 0"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'
};
const ic = (n, cls) => '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (P[n] || '') + '</svg>';
const FMT = ['learn', 'onboard', 'engage', 'attend'];

function confetti(host, n){
  if (reduced()) return;
  const box = document.createElement('div'); box.className = 'confetti';
  const cols = ['#5B4BFF', '#FFB020', '#14A86B', '#FF5A5F', '#2DB7F5', '#C8F04A'];
  for (let i = 0; i < (n || 60); i++){
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % cols.length];
    p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px'); p.style.setProperty('--r', (Math.random() * 900 - 450) + 'deg');
    p.style.animationDelay = Math.random() * .4 + 's'; p.style.animationDuration = 1.3 + Math.random() * 1.1 + 's';
    box.appendChild(p);
  }
  host.appendChild(box); setTimeout(() => box.remove(), 3200);
}
const face = (m, col) => { // m: 0 (angry) .. 10 (delighted)
  const c = (m - 5) * 1.6;
  return '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="' + col + '"/><circle cx="14" cy="17" r="2.4" fill="#111"/><circle cx="26" cy="17" r="2.4" fill="#111"/>' +
    (m < 3 ? '<path d="M11 12l6 3M29 12l-6 3" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>' : '') +
    '<path d="M12.5 ' + (27 - c / 2) + ' Q20 ' + (27 + c) + ' 27.5 ' + (27 - c / 2) + '" stroke="#111" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
};
const moodCol = m => m >= 7 ? '#3DD68C' : m >= 4 ? '#FFC24D' : '#FF6B70';

/* ========== demo 1: the service simulator (learning) ========== */
const ACC1 = '#5B4BFF';
class Learn {
  constructor(el){ this.el = el; el.addEventListener('click', e => this.click(e)); this.reset(); }
  reset(){ this.s = {phase:'intro', i:0, mood:5, pts:0, sk:{empathy:[0, 0], ask:[0, 0], solve:[0, 0]}, pick:-1}; this.render(); }
  top(){ return '<div class="app-top"><span class="logo" style="background:' + ACC1 + '">V</span><div><b>' + esc(tx(LEARN.brand)) + '</b><small>' + esc(tx(LEARN.sub)) + '</small></div>' +
    '<span class="xp">' + ic('star') + (this.s.pts * 10) + ' XP</span></div>'; }
  render(){
    const s = this.s, D = LEARN;
    let body = '';
    if (s.phase === 'intro'){
      body = '<div class="pop" style="padding-top:10px"><div style="width:72px;height:72px;border-radius:22px;display:grid;place-items:center;background:#EEEBFF;color:' + ACC1 + ';margin:6px 0 16px">' + ic('learn') + '</div>' +
        '<h3 class="a-h">' + esc(tx(D.introH)) + '</h3><p class="a-p">' + esc(tx(D.introP)) + '</p>' +
        '<div class="opts" style="margin:0 0 18px">' + D.qs.map((q, k) => '<div style="display:flex;gap:10px;align-items:center;font-size:13.5px;color:#555"><span style="width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#F1F1F4;font:700 12px var(--f-label)">' + (k + 1) + '</span>' + esc(tx(q.who)) + '</div>').join('') + '</div>' +
        '<button type="button" class="abtn" style="background:' + ACC1 + '" data-a="start">' + esc(tx(D.start)) + ic('arrow') + '</button></div>';
    } else if (s.phase === 'end'){
      const max = D.qs.length * 2, stars = s.pts >= max ? 3 : s.pts >= max - 3 ? 2 : 1, title = D.ends[3 - stars];
      body = '<div class="end pop"><svg class="medal" viewBox="0 0 100 100" aria-hidden="true"><path d="M30 6h14l8 26H38zM70 6H56l-8 26h14z" fill="' + ACC1 + '"/><circle cx="50" cy="60" r="32" fill="#FFC24D"/><circle cx="50" cy="60" r="24" fill="#FFD978"/><path d="M50 44l5 10 11 1.5-8 7.5 2 11-10-5.5-10 5.5 2-11-8-7.5 11-1.5z" fill="#fff"/></svg>' +
        '<div class="stars">' + [0, 1, 2].map(k => '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 5.9 6.5 1-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4L2.6 9.4l6.5-1z" fill="' + (k < stars ? '#FFB020' : '#E6E6EA') + '"/></svg>').join('') + '</div>' +
        '<h3 class="a-h">' + esc(tx(title)) + '</h3><p class="a-p">' + s.pts + ' / ' + max + ' · ' + esc(tx(D.endP)) + '</p>' +
        '<div class="skills"><b style="font:700 13px var(--f-label);color:#777">' + esc(tx(D.skillsT)) + '</b>' + Object.keys(s.sk).map(k => { const v = s.sk[k], pc = v[1] ? Math.round(v[0] / v[1] * 100) : 0;
          return '<div class="skill"><div class="t"><span>' + esc(tx(D.skills[k])) + '</span><span>' + pc + '%</span></div><div class="tr"><i data-w="' + pc + '" style="background:' + (pc >= 75 ? '#14A86B' : pc >= 40 ? '#E0A100' : '#E5484D') + '"></i></div></div>'; }).join('') + '</div>' +
        '<button type="button" class="abtn light" data-a="again">' + ic('refresh') + esc(tx(D.again)) + '</button></div>';
    } else {
      const q = D.qs[s.i], done = s.phase === 'fb', o = done ? q.o[s.pick] : null;
      const kind = o ? (o.q > 0 ? 'good' : o.q === 0 ? 'mid' : 'bad') : '';
      body = '<div class="l-mood">' + face(s.mood, moodCol(s.mood)) + '<div class="m"><small>' + esc(tx(D.mood)) + ' · ' + esc(tx(q.who)) + '</small><div class="tr"><i style="width:' + (s.mood * 10) + '%;background:' + moodCol(s.mood) + '"></i></div></div></div>' +
        '<p style="margin:0 0 10px;font:700 12px var(--f-label);color:#999;text-transform:uppercase;letter-spacing:.05em">' + esc(fill(tx(D.of), {n:s.i + 1})) + '</p>' +
        '<div class="chat"><div class="msg them pop"><span class="who">' + esc(tx(q.who)) + '</span>' + esc(tx(q.say)) + '</div>' +
        (o ? '<div class="msg me pop" style="background:' + ACC1 + '"><span class="who">' + esc(tx(D.you)) + '</span>' + esc(tx(o.t)) + '</div><div class="msg them pop" style="animation-delay:.35s"><span class="who">' + esc(tx(q.who)) + '</span>' + esc(tx(o.r)) + '</div>' : '') + '</div>' +
        (o ? '<div class="fb ' + kind + ' pop" style="animation-delay:.6s"><b>' + ic(kind === 'good' ? 'check' : kind === 'mid' ? 'bolt' : 'x') + esc(tx(D[kind])) + (o.q > 0 ? ' +20 XP' : o.q === 0 ? ' +10 XP' : '') + '</b>' + esc(tx(o.w)) + '</div>' +
          '<button type="button" class="abtn pop" style="background:' + ACC1 + ';animation-delay:.7s" data-a="next">' + esc(tx(s.i + 1 < D.qs.length ? D.next : D.finish)) + ic('arrow') + '</button>'
          : '<div class="opts">' + q.o.map((x, k) => '<button type="button" class="opt pop" style="animation-delay:' + (.15 + k * .07) + 's" data-a="pick" data-k="' + k + '">' + esc(tx(x.t)) + '</button>').join('') + '</div>');
    }
    const prog = s.phase === 'intro' ? 0 : s.phase === 'end' ? 100 : Math.round((s.i + (s.phase === 'fb' ? 1 : 0)) / LEARN.qs.length * 100);
    this.el.innerHTML = '<div class="app">' + this.top() + '<div class="pbar" style="margin-top:10px"><i style="width:' + prog + '%;background:' + ACC1 + '"></i></div><div class="app-body">' + body + '</div></div>';
    if (s.phase === 'end') requestAnimationFrame(() => requestAnimationFrame(() => $$('.skill i', this.el).forEach(i => { i.style.width = i.dataset.w + '%'; })));
  }
  click(e){
    const b = e.target.closest('[data-a]'); if (!b) return;
    const s = this.s, a = b.dataset.a;
    if (a === 'start'){ s.phase = 'q'; this.render(); }
    else if (a === 'pick'){
      const q = LEARN.qs[s.i], o = q.o[+b.dataset.k];
      s.pick = +b.dataset.k; s.phase = 'fb';
      s.mood = Math.max(0, Math.min(10, 5 + o.q * 2.4));
      const pts = o.q > 0 ? 2 : o.q === 0 ? 1 : 0; s.pts += pts; s.sk[q.skill][0] += pts; s.sk[q.skill][1] += 2;
      this.render();
      if (o.q < 0){ const m = $('.l-mood', this.el); m && m.classList.add('shake'); }
      if (o.q > 0) setTimeout(() => confetti(this.el, 26), 500);
    }
    else if (a === 'next'){ if (s.i + 1 < LEARN.qs.length){ s.i++; s.phase = 'q'; s.mood = 5; this.render(); } else { s.phase = 'end'; this.render(); confetti(this.el, 90); } }
    else if (a === 'again') this.reset();
  }
  destroy(){}
}

/* ========== demo 2: the onboarding journey ========== */
const ACC2 = '#0FA37F';
class Onboard {
  constructor(el){ this.el = el; el.addEventListener('click', e => this.click(e)); this.reset(); }
  reset(){ this.s = {view:'map', done:[false, false, false, false], xp:0, flip:[], who:0, whoAns:-1, tasks:[], rule:0, ruleAns:null}; this.render(); }
  next(){ return this.s.done.indexOf(false); }
  render(){
    const s = this.s, D = ONB, n = s.done.filter(Boolean).length;
    let body = '';
    const av = (m, cls) => '<span class="av' + (cls ? ' ' + cls : '') + '" style="background:' + m.c + '">' + (lang === 'ka' ? m.n : m.ne)[0] + '</span>';
    const mName = m => lang === 'ka' ? m.n : m.ne;
    if (s.view === 'map'){
      const now = this.next();
      body = '<div class="pop"><h3 class="a-h">' + esc(tx(D.hello)) + '</h3><p class="a-p">' + esc(tx(D.helloP)) + '</p><div class="map">' +
        D.stops.map((st, k) => { const done = s.done[k], cur = k === now, icn = ['users', 'list', 'check', 'heart'][k];
          return '<button type="button" class="stop' + (done ? ' done' : '') + (cur ? ' now' : '') + '" data-a="stop" data-k="' + k + '"' + (cur ? '' : ' disabled') + '>' +
            '<span class="dot" style="' + (done || cur ? 'background:' + ACC2 : '') + '">' + ic(done ? 'check' : cur ? icn : 'lock') + '</span><span><b>' + esc(tx(st[0])) + '</b><small>' + esc(tx(st[1])) + (done ? ' · +25 XP' : '') + '</small></span></button>'; }).join('') +
        '</div></div>';
    } else if (s.view === 'team'){
      const all = s.flip.length === D.team.length;
      body = '<div class="pop"><h3 class="a-h">' + esc(tx(D.stops[0][0])) + '</h3><p class="a-p">' + esc(tx(D.tapCard)) + ' · ' + s.flip.length + ' / 4</p><div class="team">' +
        D.team.map((m, k) => '<button type="button" class="mate' + (s.flip.includes(k) ? ' flip' : '') + '" data-a="flip" data-k="' + k + '"><span class="in"><span class="f">' + av(m) + '<b>' + esc(mName(m)) + '</b><small>' + esc(tx(m.r)) + '</small><span class="tap">' + esc(tx(D.tapCard)) + '</span></span>' +
          '<span class="b" style="background:' + m.c + '"><b>' + esc(mName(m)) + '</b>' + esc(tx(m.f)) + '</span></span></button>').join('') + '</div>' +
        (all ? '<button type="button" class="abtn pop" style="background:' + ACC2 + '" data-a="finish" data-k="0">' + esc(tx(D.continue)) + ' · +25 XP</button>' : '') + '</div>';
    } else if (s.view === 'who'){
      const q = D.who[s.who], ans = s.whoAns;
      body = '<div class="pop"><h3 class="a-h">' + esc(tx(D.stops[1][0])) + '</h3><p class="a-p">' + (s.who + 1) + ' / ' + D.who.length + '</p><div class="q"><p>' + esc(tx(q.q)) + '</p><div class="who-row">' +
        D.team.map((m, k) => '<button type="button" class="who-btn' + (ans >= 0 && k === q.a ? ' right' : '') + (ans === k && k !== q.a ? ' wrong' : '') + '" data-a="who" data-k="' + k + '">' + av(m) + esc(mName(m)) + '</button>').join('') + '</div></div>' +
        (ans === q.a ? '<button type="button" class="abtn pop" style="background:' + ACC2 + '" data-a="whoNext">' + esc(tx(s.who + 1 < D.who.length ? D.continue : D.continue)) + (s.who + 1 < D.who.length ? '' : ' · +25 XP') + '</button>' : '') + '</div>';
    } else if (s.view === 'tasks'){
      const all = s.tasks.length === D.tasks.length;
      body = '<div class="pop"><h3 class="a-h">' + esc(tx(D.stops[2][0])) + '</h3><p class="a-p">' + s.tasks.length + ' / ' + D.tasks.length + '</p>' +
        D.tasks.map((t, k) => '<button type="button" class="task' + (s.tasks.includes(k) ? ' on' : '') + '" data-a="task" data-k="' + k + '"><span class="bx">' + ic('check') + '</span><span>' + esc(tx(t)) + '</span></button>').join('') +
        (all ? '<button type="button" class="abtn pop" style="background:' + ACC2 + ';margin-top:8px" data-a="finish" data-k="2">' + esc(tx(D.continue)) + ' · +25 XP</button>' : '') + '</div>';
    } else if (s.view === 'rules'){
      const r = D.rules[s.rule], a = s.ruleAns;
      body = '<div class="pop"><h3 class="a-h">' + esc(tx(D.stops[3][0])) + '</h3><p class="a-p">' + (s.rule + 1) + ' / ' + D.rules.length + '</p><div class="q"><p>„' + esc(tx(r.t)) + '“</p>' +
        '<div class="vote"><button type="button" data-a="rule" data-v="1" class="' + (a !== null ? (r.a ? 'right' : (a ? 'wrong' : '')) : '') + '">' + esc(tx(D.yes)) + '</button>' +
        '<button type="button" data-a="rule" data-v="0" class="' + (a !== null ? (!r.a ? 'right' : (!a ? 'wrong' : '')) : '') + '">' + esc(tx(D.no)) + '</button></div>' +
        (a !== null ? '<p class="why pop">' + esc(tx(r.w)) + '</p>' : '') + '</div>' +
        (a !== null ? '<button type="button" class="abtn pop" style="background:' + ACC2 + '" data-a="ruleNext">' + esc(tx(D.continue)) + (s.rule + 1 < D.rules.length ? '' : ' · +25 XP') + '</button>' : '') + '</div>';
    } else {
      const b = D.team[3];
      body = '<div class="end pop"><div class="badge-big" style="background:linear-gradient(140deg,' + ACC2 + ',#5B4BFF)">' + ic('star') + '</div>' +
        '<h3 class="a-h">' + esc(tx(D.doneH)) + '</h3><p class="a-p">' + esc(tx(D.doneP)) + '</p>' +
        '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:6px"><span class="xp" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:99px;background:#FFF4D6;color:#8A5A00;font:700 13px var(--f-label)">' + ic('star') + s.xp + ' XP</span>' +
        '<span style="display:inline-flex;align-items:center;padding:6px 12px;border-radius:99px;background:#E3F6EC;color:#0C5C3A;font:700 13px var(--f-label)">' + esc(tx(D.badge)) + '</span></div>' +
        '<div class="buddy">' + av(b) + '<div><b>' + esc(tx(D.buddyT)) + '</b><small>' + esc(tx(D.buddyS)) + '</small></div></div>' +
        '<button type="button" class="abtn light" data-a="again">' + ic('refresh') + esc(tx(D.again)) + '</button></div>';
    }
    const prog = Math.round(n / 4 * 100);
    this.el.innerHTML = '<div class="app"><div class="app-top"><span class="logo" style="background:' + ACC2 + '">N</span><div><b>' + esc(tx(D.brand)) + '</b><small>' + n + ' / 4</small></div>' +
      '<span class="xp">' + ic('star') + s.xp + ' XP</span></div><div class="pbar" style="margin-top:10px"><i style="width:' + prog + '%;background:' + ACC2 + '"></i></div>' +
      (s.view !== 'map' && s.view !== 'end' ? '<button type="button" data-a="map" style="margin:10px 16px 0;align-self:flex-start;border:0;background:none;color:#777;font:600 13px var(--f-label);display:flex;align-items:center;gap:4px">' + ic('arrow', 'flipx') + esc(tx(D.back)) + '</button>' : '') +
      '<div class="app-body">' + body + '</div></div>';
    const f = $('.flipx', this.el); if (f) f.style.transform = 'rotate(180deg)';
  }
  finish(k){ const s = this.s; if (!s.done[k]){ s.done[k] = true; s.xp += 25; } s.view = s.done.every(Boolean) ? 'end' : 'map'; this.render(); confetti(this.el, s.view === 'end' ? 100 : 30); }
  click(e){
    const b = e.target.closest('[data-a]'); if (!b || b.disabled) return;
    const s = this.s, a = b.dataset.a, k = +b.dataset.k;
    if (a === 'stop'){ s.view = ['team', 'who', 'tasks', 'rules'][k]; s.who = 0; s.whoAns = -1; s.rule = 0; s.ruleAns = null; this.render(); }
    else if (a === 'map'){ s.view = 'map'; this.render(); }
    else if (a === 'flip'){ if (!s.flip.includes(k)) s.flip.push(k); b.classList.add('flip'); setTimeout(() => this.render(), 520); }
    else if (a === 'finish') this.finish(k);
    else if (a === 'who'){ if (s.whoAns === ONB.who[s.who].a) return; s.whoAns = k; this.render(); if (k !== ONB.who[s.who].a){ const r = $('.q', this.el); r && r.classList.add('shake'); } }
    else if (a === 'whoNext'){ if (s.who + 1 < ONB.who.length){ s.who++; s.whoAns = -1; this.render(); } else this.finish(1); }
    else if (a === 'task'){ const i = s.tasks.indexOf(k); if (i < 0) s.tasks.push(k); else s.tasks.splice(i, 1); this.render(); }
    else if (a === 'rule'){ if (s.ruleAns !== null) return; s.ruleAns = b.dataset.v === '1'; this.render(); }
    else if (a === 'ruleNext'){ if (s.rule + 1 < ONB.rules.length){ s.rule++; s.ruleAns = null; this.render(); } else this.finish(3); }
    else if (a === 'again') this.reset();
  }
  destroy(){}
}

/* ========== demo 3: the brand game ========== */
const BEAN = (gold) => '<svg viewBox="0 0 34 34" aria-hidden="true"><ellipse cx="17" cy="17" rx="11" ry="14" transform="rotate(28 17 17)" fill="' + (gold ? '#FFC93C' : '#6B3F22') + '" stroke="' + (gold ? '#C98A00' : '#3A2010') + '" stroke-width="2"/><path d="M12 7c6 6 4 14 10 20" stroke="' + (gold ? '#C98A00' : '#3A2010') + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' + (gold ? '<path d="M27 4l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#fff"/>' : '') + '</svg>';
const ICE = '<svg viewBox="0 0 34 34" aria-hidden="true"><rect x="5" y="5" width="24" height="24" rx="6" fill="#BDEBFF" stroke="#5CB9E0" stroke-width="2"/><path d="M10 11h6M10 15h3" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';
const CUP = '<svg viewBox="0 0 78 64" aria-hidden="true"><path d="M8 8h52l-5 44a8 8 0 0 1-8 7H21a8 8 0 0 1-8-7z" fill="#fff" stroke="#0E3B2C" stroke-width="3"/><path d="M60 16h4a9 9 0 0 1 0 18h-6" stroke="#0E3B2C" stroke-width="4" fill="none"/><rect x="5" y="4" width="58" height="8" rx="4" fill="#C8F04A" stroke="#0E3B2C" stroke-width="3"/><text x="34" y="42" text-anchor="middle" font-family="var(--f-label)" font-weight="800" font-size="13" fill="#0E3B2C">ც</text></svg>';
class Game {
  constructor(el){ this.el = el; el.addEventListener('click', e => this.click(e)); this.keys = e => this.key(e); window.addEventListener('keydown', this.keys); this.intro(); }
  shell(inner){ return '<div class="app" style="background:linear-gradient(180deg,#0E3B2C,#145A43)"><div class="game">' + inner + '</div></div>'; }
  intro(){
    this.stop(); const D = GAME;
    this.el.innerHTML = this.shell('<div class="g-over pop"><div style="width:64px;height:64px;border-radius:20px;background:#C8F04A;color:#0E3B2C;display:grid;place-items:center;margin:0 auto 14px;font:800 30px var(--f-label)">ც</div>' +
      '<p style="margin:0 0 6px;font:700 12px var(--f-label);letter-spacing:.14em;text-transform:uppercase;color:#C8F04A">' + esc(tx(D.brand)) + '</p><h3 class="a-h">' + esc(tx(D.h)) + '</h3><p class="a-p">' + esc(tx(D.p)) + '</p>' +
      '<div class="how3"><div>' + BEAN(false) + esc(tx(D.how[0])) + '</div><div>' + BEAN(true) + esc(tx(D.how[1])) + '</div><div>' + ICE + esc(tx(D.how[2])) + '</div></div>' +
      '<button type="button" class="abtn" style="background:#C8F04A;color:#0E3B2C;box-shadow:0 3px 0 #8DB52A" data-a="go">' + esc(tx(D.start)) + ic('arrow') + '</button>' +
      '<p style="margin:12px 0 0;font-size:12px;color:rgba(255,255,255,.6)">' + esc(tx(D.hint)) + '</p></div>');
  }
  play(){
    this.stop();
    this.el.innerHTML = this.shell('<div class="hud"><span>' + ic('star') + '<b id="gScore">0</b></span><span>' + ic('clock') + '<b id="gTime">15</b></span></div><div class="cup" id="gCup">' + CUP + '</div>');
    const g = $('.game', this.el), cup = $('#gCup', this.el);
    const W = g.clientWidth, H = g.clientHeight;
    const st = this.g = {g, cup, W, H, x:W / 2 - 39, tx:W / 2 - 39, score:0, t0:performance.now(), last:performance.now(), spawn:0, drops:[], on:true};
    const move = e => { const r = g.getBoundingClientRect(); st.tx = Math.max(0, Math.min(W - 78, (e.clientX - r.left) - 39)); };
    g.addEventListener('pointerdown', e => { move(e); g.setPointerCapture && g.setPointerCapture(e.pointerId); });
    g.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons) move(e); });
    const loop = now => {
      if (!st.on) return;
      const dt = Math.min(.05, (now - st.last) / 1000); st.last = now;
      const el = (now - st.t0) / 1000, left = Math.max(0, 15 - el);
      $('#gTime', this.el).textContent = Math.ceil(left);
      st.spawn -= dt;
      if (st.spawn <= 0 && left > .4){
        st.spawn = Math.max(.28, .62 - el * .02);
        const r = Math.random(), type = r < .11 ? 'gold' : r < .32 ? 'ice' : 'bean';
        const d = document.createElement('div'); d.className = 'drop'; d.innerHTML = type === 'ice' ? ICE : BEAN(type === 'gold'); g.appendChild(d);
        st.drops.push({d, type, x:8 + Math.random() * (W - 50), y:-40, v:(150 + Math.random() * 90 + el * 8) * (type === 'gold' ? 1.25 : 1), rot:Math.random() * 360, vr:Math.random() * 200 - 100});
      }
      st.x += (st.tx - st.x) * Math.min(1, dt * 14);
      cup.style.transform = 'translateX(' + st.x + 'px)';
      const cupTop = H - 26 - 64;
      st.drops = st.drops.filter(o => {
        o.y += o.v * dt; o.rot += o.vr * dt;
        o.d.style.transform = 'translate(' + o.x + 'px,' + o.y + 'px) rotate(' + o.rot + 'deg)';
        if (o.y + 30 >= cupTop && o.y < cupTop + 26 && o.x + 30 > st.x + 6 && o.x + 4 < st.x + 72){
          const pts = o.type === 'gold' ? 3 : o.type === 'ice' ? -2 : 1;
          st.score = Math.max(0, st.score + pts); $('#gScore', this.el).textContent = st.score;
          const f = document.createElement('div'); f.className = 'float'; f.textContent = (pts > 0 ? '+' : '') + pts; f.style.left = (st.x + 30) + 'px'; f.style.top = (cupTop - 10) + 'px';
          if (pts < 0) f.style.color = '#BDEBFF'; g.appendChild(f); setTimeout(() => f.remove(), 800);
          if (pts < 0){ cup.classList.remove('shake'); void cup.offsetWidth; cup.classList.add('shake'); }
          o.d.remove(); return false;
        }
        if (o.y > H){ o.d.remove(); return false; }
        return true;
      });
      if (left <= 0 && !st.drops.length) return this.over();
      if (left <= 0) st.drops.forEach(o => { o.v *= 1.04; });
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  key(e){ const st = this.g; if (!st || !st.on) return; if (!this.el.isConnected) return;
    if (e.key === 'ArrowLeft'){ st.tx = Math.max(0, st.tx - 60); e.preventDefault(); } if (e.key === 'ArrowRight'){ st.tx = Math.min(st.W - 78, st.tx + 60); e.preventDefault(); } }
  over(){
    const sc = this.g.score; this.stop(); const D = GAME;
    const prize = D.prizes.find(p => sc >= p[0])[1], code = 'TSK-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const board = [['ნინო', 'Nino', 24], ['გიორგი', 'Giorgi', 19], ['მაკა', 'Maka', 15], ['ლუკა', 'Luka', 11]].map(r => [lang === 'ka' ? r[0] : r[1], r[2], false]);
    board.push([tx(D.you), sc, true]); board.sort((a, b) => b[1] - a[1]);
    this.el.innerHTML = this.shell('<div class="g-over pop" style="justify-content:flex-start;overflow-y:auto"><p style="margin:0 0 4px;font:700 12px var(--f-label);letter-spacing:.14em;text-transform:uppercase;color:#C8F04A">' + esc(tx(D.over)) + '</p>' +
      '<h3 class="a-h" style="font-size:44px;margin:0">' + sc + '</h3><p class="a-p" style="margin-bottom:12px">' + esc(tx(D.pts)) + '</p>' +
      '<div class="scratch"><b>' + esc(tx(prize)) + '</b><code>' + code + '</code><small style="margin-top:6px;color:#3D6B57;font-size:11.5px">' + esc(tx(D.code)) + '</small><canvas id="gScr" aria-label="' + esc(tx(D.scratch)) + '"></canvas></div>' +
      '<p style="margin:0 0 8px;font:700 12px var(--f-label);text-align:left;color:rgba(255,255,255,.7)">' + esc(tx(D.board)) + '</p><ol class="lb">' + board.slice(0, 5).map((r, k) => '<li class="' + (r[2] ? 'me' : '') + '"><span>' + (k + 1) + '. ' + esc(r[0]) + '</span><span>' + r[1] + '</span></li>').join('') + '</ol>' +
      '<button type="button" class="abtn" style="background:#C8F04A;color:#0E3B2C;box-shadow:0 3px 0 #8DB52A" data-a="go">' + ic('refresh') + esc(tx(D.again)) + '</button></div>');
    this.scratch($('#gScr', this.el), tx(D.scratch));
    if (sc >= 10) confetti(this.el, 70);
  }
  scratch(cv, label){
    const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; cv.width = r.width * dpr; cv.height = r.height * dpr;
    const c = cv.getContext('2d'); c.scale(dpr, dpr);
    const gr = c.createLinearGradient(0, 0, r.width, r.height); gr.addColorStop(0, '#C8F04A'); gr.addColorStop(1, '#9FD12E');
    c.fillStyle = gr; c.fillRect(0, 0, r.width, r.height);
    c.fillStyle = '#0E3B2C'; c.font = '700 14px "Google Sans","Noto Sans Georgian",sans-serif'; c.textAlign = 'center'; c.fillText(label, r.width / 2, r.height / 2 + 5);
    c.globalCompositeOperation = 'destination-out';
    let down = false, n = 0;
    const at = e => { const b = cv.getBoundingClientRect(); c.beginPath(); c.arc(e.clientX - b.left, e.clientY - b.top, 20, 0, Math.PI * 2); c.fill(); if (++n > 28){ cv.style.transition = 'opacity .4s'; cv.style.opacity = 0; setTimeout(() => cv.remove(), 400); } };
    cv.addEventListener('pointerdown', e => { down = true; at(e); });
    cv.addEventListener('pointermove', e => { if (down || e.pointerType === 'mouse') at(e); });
    window.addEventListener('pointerup', () => { down = false; });
    cv.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') cv.remove(); }); cv.tabIndex = 0;
  }
  click(e){ const b = e.target.closest('[data-a]'); if (b && b.dataset.a === 'go') this.play(); }
  stop(){ if (this.g) this.g.on = false; cancelAnimationFrame(this.raf); }
  destroy(){ this.stop(); window.removeEventListener('keydown', this.keys); }
}

/* ========== demo 4: the event invitation ========== */
class Invite {
  constructor(el){ this.el = el; el.addEventListener('click', e => this.click(e)); const d = new Date(); d.setDate(d.getDate() + 12); d.setHours(19, 0, 0, 0); this.when = d; this.reset(); }
  reset(){ this.s = {view:'env', guests:0, ans:null, code:'NV-' + Math.floor(1000 + Math.random() * 9000)}; this.render(); }
  date(){ const d = this.when, D = S[lang]; return D.days[d.getDay()] + ', ' + d.getDate() + ' ' + D.months[d.getMonth()]; }
  render(){
    clearInterval(this.t);
    const s = this.s, D = INV;
    let body = '';
    if (s.view === 'env'){
      body = '<div style="text-align:center;padding-top:30px"><p class="inv-kick">' + esc(tx(D.kick)) + '</p><button type="button" class="env" data-a="open" aria-label="' + esc(tx(D.tap)) + '" style="border:0;background:none;padding:0;display:block">' +
        '<span class="back"></span><span class="card">Nova · 5</span><span class="front"></span><span class="flap"></span><span class="seal">N</span></button>' +
        '<p style="color:#9C98B3;font:600 13px var(--f-label);display:flex;align-items:center;justify-content:center;gap:8px"><span style="width:8px;height:8px;border-radius:50%;background:#FF5A5F;animation:pulse 1.6s infinite"></span>' + esc(tx(D.tap)) + '</p></div>';
    } else if (s.view === 'card'){
      body = '<div class="pop"><p class="inv-kick">' + esc(tx(D.kick)) + '</p><h3 class="inv-h">' + esc(tx(D.h)) + '</h3><p class="inv-p">' + esc(tx(D.p)) + '</p>' +
        '<div class="inv-meta"><div>' + ic('cal') + '<span><b>' + esc(this.date()) + '</b><small>19:00</small></span></div><div>' + ic('pin') + '<span><b>' + esc(tx(D.venue)) + '</b><small>' + esc(tx(D.venueS)) + '</small></span></div>' +
        '<div>' + ic('shirt') + '<span><b>' + esc(tx(D.dress)) + '</b><small>' + esc(tx(D.dressS)) + '</small></span></div></div>' +
        '<ul class="prog">' + D.prog.map(p => '<li><b>' + p[0] + '</b>' + esc(tx(p[1])) + '</li>').join('') + '</ul>' +
        '<p style="margin:0 0 10px;font:800 18px var(--f-label)">' + esc(tx(D.q)) + '</p>' +
        (s.ans === true ? '<div class="stepper"><span style="font:600 14px var(--f-label)">' + esc(tx(D.plus)) + '</span><div><button type="button" data-a="minus" aria-label="−">−</button><b>' + s.guests + '</b><button type="button" data-a="plus" aria-label="+">+</button></div></div>' +
          '<button type="button" class="abtn" style="background:#C8B8FF;color:#111018;box-shadow:0 3px 0 #8E7BE0" data-a="confirm">' + ic('check') + esc(tx(D.confirm)) + '</button>'
          : '<div class="rsvp"><button type="button" data-a="yes" style="background:#C8B8FF;color:#111018">' + esc(tx(D.yes)) + '</button><button type="button" data-a="no" style="background:#26233A;color:#fff">' + esc(tx(D.no)) + '</button></div>') + '</div>';
    } else if (s.view === 'ticket'){
      const qr = Array.from({length:49}, (_, i) => ((i * 7 + s.code.charCodeAt(3 + i % 4)) % 3) ? '' : '<rect x="' + (i % 7) * 8 + '" y="' + Math.floor(i / 7) * 8 + '" width="8" height="8"/>').join('');
      body = '<div class="pop"><p class="inv-kick">' + esc(tx(D.kick)) + '</p><h3 class="inv-h" style="font-size:24px">' + esc(tx(D.tkH)) + '</h3>' +
        '<div class="cd" id="cd">' + D.cd.map(x => '<div><b>0</b><small>' + esc(tx(x)) + '</small></div>').join('') + '</div>' +
        '<div class="ticket"><svg class="qr" viewBox="0 0 56 56" fill="#111">' + qr + '<rect x="0" y="0" width="16" height="16" fill="none" stroke="#111" stroke-width="4"/><rect x="40" y="0" width="16" height="16" fill="none" stroke="#111" stroke-width="4"/><rect x="0" y="40" width="16" height="16" fill="none" stroke="#111" stroke-width="4"/></svg>' +
        '<div class="tk-h">Nova · 5</div><div class="tk-s">' + esc(lang === 'ka' ? 'ანა' : 'Ana') + (s.guests ? ' + ' + s.guests : '') + '</div><div class="tk-g">' +
        '<span>' + esc(tx(D.when)) + '<b>' + esc(this.date()) + ', 19:00</b></span><span>' + esc(tx(D.where)) + '<b>' + esc(tx(D.venue)) + '</b></span>' +
        '<span>' + esc(tx(D.guests)) + '<b>' + (1 + s.guests) + '</b></span><span>' + esc(tx(D.code)) + '<b>' + s.code + '</b></span></div></div>' +
        '<button type="button" class="abtn" style="background:#C8B8FF;color:#111018;box-shadow:0 3px 0 #8E7BE0;margin-bottom:8px" data-a="ics">' + ic('cal') + esc(tx(D.cal)) + '</button>' +
        '<button type="button" class="abtn light" data-a="change">' + esc(tx(D.change)) + '</button></div>';
    } else {
      body = '<div class="pop" style="text-align:center;padding-top:40px"><div style="width:72px;height:72px;margin:0 auto 18px;border-radius:50%;background:#26233A;display:grid;place-items:center;color:#C8B8FF">' + ic('heart') + '</div>' +
        '<h3 class="inv-h" style="font-size:24px">' + esc(tx(D.noH)) + '</h3><p class="inv-p">' + esc(tx(D.noP)) + '</p><button type="button" class="abtn light" data-a="change">' + esc(tx(D.change)) + '</button></div>';
    }
    this.el.innerHTML = '<div class="inv"><div class="inv-body">' + body + '</div></div>';
    if (s.view === 'ticket'){ this.tick(); this.t = setInterval(() => this.tick(), 1000); }
  }
  tick(){ const el = $('#cd', this.el); if (!el){ clearInterval(this.t); return; }
    const sec = Math.max(0, Math.floor((this.when - Date.now()) / 1000)), v = [Math.floor(sec / 86400), Math.floor(sec % 86400 / 3600), Math.floor(sec % 3600 / 60), sec % 60];
    $$('b', el).forEach((b, i) => { b.textContent = v[i]; }); }
  ics(){
    const d = this.when, e = new Date(d.getTime() + 4 * 3600e3), f = x => x.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Gancda//Demo//EN', 'BEGIN:VEVENT', 'UID:' + this.s.code + '@gancda.com', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(d), 'DTEND:' + f(e),
      'SUMMARY:' + tx(INV.h), 'LOCATION:' + tx(INV.venue) + ', Tbilisi', 'DESCRIPTION:Gancda demo invitation', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], {type:'text/calendar'})); a.download = 'nova-5.ics'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  click(e){
    const b = e.target.closest('[data-a]'); if (!b) return;
    const s = this.s, a = b.dataset.a;
    if (a === 'open'){ b.classList.add('open'); setTimeout(() => { s.view = 'card'; this.render(); }, reduced() ? 0 : 1100); }
    else if (a === 'yes'){ s.ans = true; this.render(); }
    else if (a === 'no'){ s.ans = false; s.view = 'no'; this.render(); }
    else if (a === 'plus'){ s.guests = Math.min(1, s.guests + 1); this.render(); }
    else if (a === 'minus'){ s.guests = Math.max(0, s.guests - 1); this.render(); }
    else if (a === 'confirm'){ s.view = 'ticket'; this.render(); confetti(this.el, 80); }
    else if (a === 'ics') this.ics();
    else if (a === 'change'){ s.view = 'card'; s.ans = null; this.render(); }
  }
  destroy(){ clearInterval(this.t); }
}

/* ---------- the stage: one phone, four demos ---------- */
const DEMOS = {learn:Learn, onboard:Onboard, engage:Game, attend:Invite};
let cur = 'learn', inst = null;
function mountDemo(k){
  if (inst) inst.destroy();
  const old = $('#phone'), el = old.cloneNode(false); old.replaceWith(el);
  cur = k; inst = new DEMOS[k](el);
  $$('#picker .pick').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
}

/* ---------- page ---------- */
function renderStatic(){
  const D = S[lang];
  document.documentElement.lang = lang;
  document.title = lang === 'ka' ? 'განცდა · Gancda' : 'Gancda · digital experiences';
  $$('[data-t]').forEach(el => { const v = path(D, el.dataset.t); if (v != null) el.textContent = v; });
  $$('[data-th]').forEach(el => { const v = path(D, el.dataset.th); if (v != null) el.innerHTML = v; });
  $$('[data-tp]').forEach(el => { const v = path(D, el.dataset.tp); if (v != null) el.placeholder = v; });
  $$('[data-ic]').forEach(el => { el.innerHTML = ic(el.dataset.ic); });
  $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  $('#facts').innerHTML = D.hero.facts.map(f => '<li>' + ic('check') + esc(f) + '</li>').join('');
  $('#picker').innerHTML = FMT.map(k => '<button type="button" class="pick" data-k="' + k + '" aria-pressed="' + (k === cur) + '"><span class="ic">' + ic(k) + '</span><span><b>' + esc(D.fmt[k].n) + '</b><span>' + esc(D.fmt[k].s) + '</span></span></button>').join('');
  $('#cards').innerHTML = FMT.map(k => { const f = D.fmt[k];
    return '<article class="card"><div class="ic">' + ic(k) + '</div><h3>' + esc(f.n) + '</h3><p>' + esc(f.p) + '</p><ul>' + f.u.map(u => '<li>' + ic('check') + esc(u) + '</li>').join('') + '</ul>' +
      '<button type="button" class="btn ghost sm play" data-play="' + k + '">' + ic('bolt') + esc(D.ui.play) + '</button></article>'; }).join('');
  $('#steps').innerHTML = D.how.steps.map(s => '<li><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span><small>' + esc(s[2]) + '</small></li>').join('');
  const R = D.res;
  $('#resChecks').innerHTML = R.checks.map(c => '<li>' + ic('check') + esc(c) + '</li>').join('');
  $('#dash').innerHTML = '<div class="dash-top"><b>' + esc(R.title) + '</b><span class="tag">' + ic('chart') + esc(R.tag) + '</span></div>' +
    '<div class="kpis">' + R.kpis.map(k => '<div class="kpi"><b>' + esc(k[0]) + '</b><span>' + esc(k[1]) + '</span></div>').join('') + '</div>' +
    '<p style="margin:0 0 10px;font:600 13px var(--f-label);color:var(--muted)">' + esc(R.barsT) + '</p><div class="bars">' +
    R.bars.map(b => '<div class="bar"><div class="t"><span>' + esc(b[0]) + '</span><b>' + b[1] + '%</b></div><div class="tr"><i data-w="' + b[1] + '"></i></div></div>').join('') + '</div>' +
    '<p style="margin:16px 0 0;padding:12px 14px;border-radius:12px;background:var(--bad-soft);color:var(--bad);font:600 13px/1.4 var(--f-label)">' + esc(R.hard) + '</p>';
  if (dashSeen) $$('#dash .tr i').forEach(i => { i.style.width = i.dataset.w + '%'; });
  $('#pkgs').innerHTML = D.pk.list.map((p, i) => '<article class="pkg' + (i === 0 ? ' hl' : '') + '">' + (p.b ? '<span class="badge">' + esc(p.b) + '</span>' : '') + '<h3>' + esc(p.n) + '</h3><p class="for">' + esc(p.f) + '</p>' +
    '<div class="time">' + ic('clock') + esc(p.t) + '</div><ul>' + p.i.map(x => '<li>' + ic('check') + esc(x) + '</li>').join('') + '</ul>' +
    '<a class="btn ' + (i === 0 ? 'acc' : 'ghost') + '" href="#contact" data-want="' + (i === 0 ? 'pilot' : '') + '">' + esc(p.c) + '</a></article>').join('');
  const picked = ($('input[name="what"]:checked') || {}).value;
  $('#whatChips').innerHTML = FMT.concat('unsure').map(k => '<label><input type="radio" name="what" value="' + k + '"' + (k === picked ? ' checked' : '') + '><span>' + esc(k === 'unsure' ? D.f.unsure : D.fmt[k].n) + '</span></label>').join('');
  $('#year').textContent = new Date().getFullYear();
  themeIcon();
  if (!$('#sent').hidden && lastReq) showSent(lastReq.mode);
}
let dashSeen = false;
if ('IntersectionObserver' in window) new IntersectionObserver((es, ob) => { if (es[0].isIntersecting){ dashSeen = true; $$('#dash .tr i').forEach(i => { i.style.width = i.dataset.w + '%'; }); ob.disconnect(); } }, {threshold:.3}).observe($('#dash'));
else dashSeen = true;

document.addEventListener('click', e => {
  const p = e.target.closest('#picker .pick'); if (p){ mountDemo(p.dataset.k); if (innerWidth < 980) $('.stage').scrollIntoView({behavior: reduced() ? 'auto' : 'smooth', block:'center'}); return; }
  const c = e.target.closest('[data-play]');
  if (c){ mountDemo(c.dataset.play); const st = $('.stage'); st.scrollIntoView({behavior: reduced() ? 'auto' : 'smooth', block:'center'}); return; }
  const w = e.target.closest('[data-want]'); if (w && w.dataset.want === 'pilot'){ const m = $('#fMsg'); if (m && !m.value) m.value = lang === 'ka' ? 'გვაინტერესებს პილოტი.' : 'We are interested in a pilot.'; }
});
$$('[data-lang]').forEach(b => b.addEventListener('click', () => { if (lang === b.dataset.lang) return; lang = b.dataset.lang; store.set('lang', lang); renderStatic(); inst.render ? (inst instanceof Game ? inst.intro() : inst.render()) : 0; }));

/* theme */
function effTheme(){ const a = document.documentElement.getAttribute('data-theme'); if (a === 'dark' || a === 'light') return a; return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
function themeIcon(){ const b = $('#themeBtn'); b.innerHTML = ic(effTheme() === 'dark' ? 'sun' : 'moon'); b.setAttribute('aria-label', S[lang].ui.theme); }
const savedTheme = store.get('theme'); if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.setAttribute('data-theme', savedTheme);
$('#themeBtn').addEventListener('click', () => { const n = effTheme() === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', n); store.set('theme', n); themeIcon(); });
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeIcon);
window.addEventListener('scroll', () => $('#hdr').classList.toggle('scrolled', scrollY > 8), {passive:true});

/* ---------- the request form ---------- */
let lastReq = null;
function readForm(){
  const what = ($('input[name="what"]:checked') || {}).value || '', company = $('#fCompany').value.trim(), msg = $('#fMsg').value.trim(), F = S[lang].f;
  return {who: FMT.includes(what) ? what : '', interest: what, name:$('#fName').value.trim(), contact:$('#fContact').value.trim(),
    message:(company ? F.company2 + ': ' + company + (msg ? '\n\n' : '') : '') + msg, lang, website:$('#fWeb').value};
}
function reqText(r){ const F = S[lang].f, D = S[lang]; return [F.what + ': ' + (r.interest === 'unsure' ? F.unsure : r.interest ? D.fmt[r.interest].n : '-'), F.name + ': ' + r.name, F.contact + ': ' + r.contact, '', r.message].join('\n'); }
function showSent(mode){
  const F = S[lang].f, box = $('#sent');
  const h = mode === 'ok' ? F.okH : mode === 'fail' ? F.failH : F.offH, p = mode === 'ok' ? F.ok : fill(mode === 'fail' ? F.fail : F.off, {email:CONFIG.email});
  box.innerHTML = '<div class="sent"><div class="ok" style="' + (mode === 'ok' ? '' : 'background:var(--surface2);color:var(--ink)') + '">' + ic(mode === 'ok' ? 'check' : 'mail') + '</div><h3>' + esc(h) + '</h3><p>' + esc(p) + '</p>' +
    (mode !== 'ok' ? '<pre id="reqText">' + esc(reqText(lastReq)) + '</pre><p style="margin-top:12px"><button type="button" class="btn ghost sm" id="copyReq">' + ic('copy') + esc(F.copy) + '</button></p>' : '') +
    '<button type="button" class="btn ghost sm" id="againReq">' + esc(F.again) + '</button></div>';
  box.hidden = false; $('#form').hidden = true;
  const cp = $('#copyReq'); if (cp) cp.addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(reqText(lastReq)).then(() => { cp.lastChild.textContent = F.copied; }); });
  $('#againReq').addEventListener('click', () => { box.hidden = true; $('#form').hidden = false; if (mode === 'ok') $('#form').reset(); $('#fName').focus(); });
}
function validate(){
  const F = S[lang].f, name = $('#fName').value.trim(), c = $('#fContact').value.trim(), cOk = /\S+@\S+\.\S+/.test(c) || c.replace(/\D/g, '').length >= 9;
  $('#fbName').classList.toggle('bad', !name); $('#eName').textContent = name ? '' : F.eName;
  $('#fbContact').classList.toggle('bad', !cOk); $('#eContact').textContent = cOk ? '' : F.eContact;
  if (!name){ $('#fName').focus(); return false; } if (!cOk){ $('#fContact').focus(); return false; } return true;
}
$('#form').addEventListener('submit', e => {
  e.preventDefault(); if (!validate()) return;
  lastReq = readForm();
  if (!CONFIG.formEndpoint){ lastReq.mode = 'off'; showSent('off'); return; }
  const sb = $('#sendBtn'), F = S[lang].f; sb.disabled = true; sb.firstChild.textContent = F.sending;
  fetch(CONFIG.formEndpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(Object.assign({summary:reqText(lastReq)}, lastReq))})
    .then(r => { if (!r.ok) throw new Error(r.status); lastReq.mode = 'ok'; showSent('ok'); })
    .catch(() => { lastReq.mode = 'fail'; showSent('fail'); })
    .finally(() => { sb.disabled = false; sb.firstChild.textContent = S[lang].f.send; });
});
['#fName', '#fContact'].forEach(id => $(id).addEventListener('input', () => { if ($(id).closest('.field').classList.contains('bad')) validate(); }));

renderStatic();
mountDemo(FMT.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'learn');
})();
