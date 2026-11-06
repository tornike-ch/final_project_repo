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
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const ok = L('სწორია', 'correct'), wrong = L('არასწორია', 'wrong');

/* one polite live region for everything the demos and the form announce */
function say(msg){ const r = $('#sr'); if (!r) return; r.textContent = ''; setTimeout(() => { r.textContent = msg; }, 60); }

/* ---------- icons: one line set ---------- */
const P = {
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>', back:'<path d="M19 12H5M11 6l-6 6 6 6"/>', check:'<path d="M5 12.5l4.5 4.5L19 7"/>', mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
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
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01" stroke-width="3"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z"/>', lock:'<rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>', refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>', bolt:'<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>', chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  bag:'<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>', eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  megaphone:'<path d="M3 10v4l11 5V5L3 10z"/><path d="M14 8a4 4 0 0 1 0 8M6 14l1 5h3l-1-4"/>', copy:'<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>'
};
const ic = (n, cls) => '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (P[n] || '') + '</svg>';
const FMT = ['learn', 'onboard', 'engage', 'attend'];

function confetti(host, n){
  if (reduced()) return;
  const box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
  const cols = ['#5B4BFF', '#FFB020', '#14A86B', '#FF5A5F', '#2DB7F5', '#C8F04A'];
  for (let i = 0; i < (n || 50); i++){
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % cols.length];
    p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px'); p.style.setProperty('--r', (Math.random() * 900 - 450) + 'deg');
    p.style.animationDelay = Math.random() * .25 + 's'; p.style.animationDuration = .9 + Math.random() * .6 + 's';
    box.appendChild(p);
  }
  host.appendChild(box); setTimeout(() => box.remove(), 1900);
}
const face = m => { // 0 (angry) .. 10 (delighted)
  const c = (m - 5) * 1.6, col = m >= 7 ? '#3DD68C' : m >= 4 ? '#FFC24D' : '#FF6B70';
  return '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="' + col + '"/><circle cx="14" cy="17" r="2.4" fill="#111"/><circle cx="26" cy="17" r="2.4" fill="#111"/>' +
    (m < 3 ? '<path d="M11 12l6 3M29 12l-6 3" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>' : '') +
    '<path d="M12.5 ' + (27 - c / 2) + ' Q20 ' + (27 + c) + ' 27.5 ' + (27 - c / 2) + '" stroke="#111" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
};
const moodCol = m => m >= 7 ? '#14A86B' : m >= 4 ? '#D18A00' : '#D93C41';
/* the card every demo ends with: what the buyer would see */
const seeCard = (title, rows, dark) => '<div class="see' + (dark ? ' dark' : '') + '"><div class="see-h">' + ic('eye') + '<b>' + esc(tx(title)) + '</b><span>' + esc(S[lang].ui.demo) + '</span></div>' +
  '<div class="see-g">' + rows.map(r => '<div><b>' + esc(tx(r[1])) + '</b><span>' + esc(tx(r[0])) + (r[2] ? ' · ' + esc(tx(r[2])) : '') + '</span></div>').join('') + '</div></div>';

/* shared demo plumbing: render, then move focus and scroll to what just appeared */
class Demo {
  constructor(el){ this.el = el; this.focusSel = null; el.addEventListener('click', e => this.click(e)); }
  after(){
    const body = $('.app-body,.inv-body', this.el), sel = this.focusSel; this.focusSel = null;
    if (!sel) return;
    const t = $(sel, this.el) || $('.a-h,.inv-h', this.el);
    if (t){ if (!t.matches('button,a,input,[tabindex]')) t.setAttribute('tabindex', '-1'); t.focus({preventScroll:true}); }
    if (body && sel !== 'top'){
      const tgt = $(sel, this.el);
      if (tgt && body.contains(tgt)) setTimeout(() => { const r = tgt.getBoundingClientRect(), b = body.getBoundingClientRect(); if (r.bottom > b.bottom - 8) body.scrollTo({top:body.scrollTop + r.bottom - b.bottom + 24, behavior:reduced() ? 'auto' : 'smooth'}); }, reduced() ? 0 : 420);
    }
  }
  go(sel){ this.focusSel = sel || '.a-h'; this.render(); this.after(); }
  destroy(){}
}

/* ========== demo 1: the service simulator (learning) ========== */
const ACC1 = '#5B4BFF';
class Learn extends Demo {
  constructor(el){ super(el); this.reset(true); }
  reset(silent){ this.s = {phase:'intro', i:0, mood:5, pts:0, sk:{empathy:[0, 0], ask:[0, 0], solve:[0, 0]}, pick:-1, order:[], best:false}; silent ? this.render() : this.go(); }
  top(){ return '<div class="app-top"><span class="logo" style="background:' + ACC1 + '">V</span><div class="tt"><b>' + esc(tx(LEARN.brand)) + '</b><small>' + esc(tx(LEARN.sub)) + '</small></div>' +
    '<span class="xp">' + ic('star') + (this.s.pts * 10) + ' XP</span></div>'; }
  render(){
    const s = this.s, D = LEARN;
    let body = '';
    if (s.phase === 'intro'){
      body = '<div class="pop" style="padding-top:6px"><div class="hero-ic" style="background:#EEEBFF;color:' + ACC1 + '">' + ic('learn') + '</div>' +
        '<h3 class="a-h">' + esc(tx(D.introH)) + '</h3><p class="a-p">' + esc(tx(D.introP)) + '</p>' +
        '<ol class="who-list">' + D.qs.map(q => '<li>' + esc(tx(q.who)) + '</li>').join('') + '</ol>' +
        '<button type="button" class="abtn" style="background:' + ACC1 + '" data-a="start">' + esc(tx(D.start)) + ic('arrow') + '</button></div>';
    } else if (s.phase === 'end'){
      const max = D.qs.length * 2, stars = s.pts >= max ? 3 : s.pts >= max - 3 ? 2 : 1, title = D.ends[3 - stars];
      body = '<div class="end pop"><svg class="medal" viewBox="0 0 100 100" aria-hidden="true"><path d="M30 6h14l8 26H38zM70 6H56l-8 26h14z" fill="' + ACC1 + '"/><circle cx="50" cy="60" r="32" fill="#FFC24D"/><circle cx="50" cy="60" r="24" fill="#FFD978"/><path d="M50 44l5 10 11 1.5-8 7.5 2 11-10-5.5-10 5.5 2-11-8-7.5 11-1.5z" fill="#fff"/></svg>' +
        '<div class="stars" role="img" aria-label="' + stars + ' / 3">' + [0, 1, 2].map(k => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.5 1-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4L2.6 9.4l6.5-1z" fill="' + (k < stars ? '#FFB020' : '#E6E6EA') + '"/></svg>').join('') + '</div>' +
        '<h3 class="a-h">' + esc(tx(title)) + '</h3><p class="a-p">' + s.pts + ' / ' + max + '</p>' +
        '<div class="skills"><b class="mini">' + esc(tx(D.skillsT)) + '</b>' + Object.keys(s.sk).map(k => { const v = s.sk[k], pc = v[1] ? Math.round(v[0] / v[1] * 100) : 0;
          return '<div class="skill"><div class="t"><span>' + esc(tx(D.skills[k])) + '</span><span>' + pc + '%</span></div><div class="tr"><i data-w="' + pc + '" style="background:' + (pc >= 75 ? '#14A86B' : pc >= 40 ? '#D18A00' : '#D93C41') + '"></i></div></div>'; }).join('') + '</div>' +
        seeCard(D.mgrT, D.mgr) +
        '<button type="button" class="abtn light" data-a="again">' + ic('refresh') + esc(tx(D.again)) + '</button></div>';
    } else {
      const q = D.qs[s.i], done = s.phase === 'fb', o = done ? q.o[s.pick] : null, kind = o ? (o.q > 0 ? 'good' : o.q === 0 ? 'mid' : 'bad') : '';
      const best = q.o.find(x => x.q > 0);
      body = '<div class="l-mood">' + face(s.mood) + '<div class="m"><small>' + esc(tx(D.mood)) + '</small><div class="tr" role="meter" aria-valuemin="0" aria-valuemax="10" aria-valuenow="' + Math.round(s.mood) + '" aria-label="' + esc(tx(D.mood)) + '"><i style="width:' + (s.mood * 10) + '%;background:' + moodCol(s.mood) + '"></i></div></div></div>' +
        '<p class="mini" style="margin:0 0 10px">' + esc(fill(tx(D.of), {n:s.i + 1})) + '</p>' +
        '<div class="chat"><div class="msg them pop"><span class="who">' + esc(tx(q.who)) + '</span>' + esc(tx(q.say)) + '</div>' +
        (o ? '<div class="msg me pop" style="background:' + ACC1 + '"><span class="who">' + esc(tx(D.you)) + '</span>' + esc(tx(o.t)) + '</div><div class="msg them pop" style="animation-delay:.3s"><span class="who">' + esc(tx(q.who)) + '</span>' + esc(tx(o.r)) + '</div>' : '') + '</div>' +
        (o ? '<div class="fb ' + kind + ' pop" style="animation-delay:.45s"><b>' + ic(kind === 'good' ? 'check' : kind === 'mid' ? 'bolt' : 'x') + esc(tx(D[kind])) + (o.q > 0 ? ' +20 XP' : o.q === 0 ? ' +10 XP' : '') + '</b>' + esc(tx(o.w)) + '</div>' +
          (o.q <= 0 ? (s.best ? '<div class="fb good pop best"><b>' + ic('star') + esc(tx(D.bestT)) + '</b>„' + esc(tx(best.t)) + '“</div>' : '<button type="button" class="linkbtn" data-a="best">' + ic('eye') + esc(tx(D.best)) + '</button>') : '') +
          '<button type="button" class="abtn pop nextb" style="background:' + ACC1 + ';animation-delay:.55s" data-a="next">' + esc(tx(s.i + 1 < D.qs.length ? D.next : D.finish)) + ic('arrow') + '</button>'
          : '<div class="opts">' + s.order.map((k, n) => '<button type="button" class="opt pop" style="animation-delay:' + (.1 + n * .06) + 's" data-a="pick" data-k="' + k + '">' + esc(tx(q.o[k].t)) + '</button>').join('') + '</div>');
    }
    const prog = s.phase === 'intro' ? 0 : s.phase === 'end' ? 100 : Math.round((s.i + (s.phase === 'fb' ? 1 : 0)) / LEARN.qs.length * 100);
    this.el.innerHTML = '<div class="app">' + this.top() + '<div class="pbar"><i style="width:' + prog + '%;background:' + ACC1 + '"></i></div><div class="app-body">' + body + '</div></div>';
    if (s.phase === 'end') requestAnimationFrame(() => requestAnimationFrame(() => $$('.skill i', this.el).forEach(i => { i.style.width = i.dataset.w + '%'; })));
  }
  ask(i){ this.s.i = i; this.s.phase = 'q'; this.s.best = false; this.s.order = shuffle([0, 1, 2]); this.go('.opt'); }
  click(e){
    const b = e.target.closest('[data-a]'); if (!b) return;
    const s = this.s, a = b.dataset.a, D = LEARN;
    if (a === 'start') this.ask(0);
    else if (a === 'pick'){
      const q = D.qs[s.i], o = q.o[+b.dataset.k];
      s.pick = +b.dataset.k; s.phase = 'fb';
      s.mood = Math.max(0, Math.min(10, s.mood + o.q * 1.2));
      const pts = o.q > 0 ? 2 : o.q === 0 ? 1 : 0; s.pts += pts; q.sk.forEach(k => { s.sk[k][0] += pts; s.sk[k][1] += 2; });
      this.go('.nextb');
      say(tx(D[o.q > 0 ? 'good' : o.q === 0 ? 'mid' : 'bad']) + '. ' + tx(o.w));
      if (o.q < 0){ const m = $('.l-mood', this.el); m && m.classList.add('shake'); }
      if (o.q > 0) setTimeout(() => confetti(this.el, 22), 450);
    }
    else if (a === 'best'){ s.best = true; this.go('.best'); say(tx(D.bestT) + ': ' + tx(D.qs[s.i].o.find(x => x.q > 0).t)); }
    else if (a === 'next'){ if (s.i + 1 < D.qs.length) this.ask(s.i + 1); else { s.phase = 'end'; this.go(); confetti(this.el, 70); say(tx(this.el.querySelector('.a-h').textContent)); } }
    else if (a === 'again') this.reset();
  }
}

/* ========== demo 2: the onboarding journey ========== */
const ACC2 = '#0B7F63';
class Onboard extends Demo {
  constructor(el){ super(el); this.reset(true); }
  reset(silent){ this.s = {view:'map', done:[false, false, false], xp:0, flip:[], qi:0, ans:null, tries:0, right:0, weak:false, prep:{}}; silent ? this.render() : this.go(); }
  render(){
    const s = this.s, D = ONB, n = s.done.filter(Boolean).length, nm = m => lang === 'ka' ? m.n : m.ne;
    const av = m => '<span class="av" style="background:' + m.c + '" aria-hidden="true">' + nm(m)[0] + '</span>';
    let body = '';
    if (s.view === 'map'){
      const now = s.done.indexOf(false);
      body = '<div class="pop"><h3 class="a-h">' + esc(tx(D.hello)) + '</h3><p class="a-p">' + esc(tx(D.helloP)) + '</p><div class="map">' +
        D.stops.map((st, k) => { const done = s.done[k], cur = k === now, icn = ['users', 'list', 'bag'][k];
          return '<button type="button" class="stop' + (done ? ' done' : '') + (cur ? ' now' : '') + '" data-a="stop" data-k="' + k + '"' + (cur ? '' : ' disabled') + '>' +
            '<span class="dot" style="' + (done || cur ? 'background:' + ACC2 : '') + '">' + ic(done ? 'check' : cur ? icn : 'lock') + '</span><span><b>' + esc(tx(st[0])) + '</b><small>' + esc(tx(st[1])) + (done ? ' · ' + esc(tx(ok)) : '') + '</small></span></button>'; }).join('') +
        '</div></div>';
    } else if (s.view === 'team'){
      const all = s.flip.length === D.team.length;
      body = '<div class="pop"><h3 class="a-h">' + esc(tx(D.stops[0][0])) + '</h3><p class="a-p">' + esc(tx(D.tapCard)) + ' · ' + s.flip.length + ' / 4</p><div class="team">' +
        D.team.map((m, k) => { const f = s.flip.includes(k);
          return '<button type="button" class="mate' + (f ? ' flip' : '') + '" data-a="flip" data-k="' + k + '" aria-pressed="' + f + '" aria-label="' + esc(nm(m) + ', ' + tx(m.r) + (f ? '. ' + tx(m.f) : '')) + '"><span class="in" aria-hidden="true"><span class="f">' + av(m) + '<b>' + esc(nm(m)) + '</b><small>' + esc(tx(m.r)) + '</small><span class="tap">' + esc(tx(D.tapCard)) + '</span></span>' +
          '<span class="b" style="background:' + m.c + '"><b>' + esc(nm(m)) + '</b>' + esc(tx(m.f)) + '</span></span></button>'; }).join('') + '</div>' +
        (all ? '<button type="button" class="abtn pop nextb" style="background:' + ACC2 + '" data-a="finish" data-k="0">' + esc(tx(D.continue)) + ' · +20 XP</button>' : '') + '</div>';
    } else if (s.view === 'quiz'){
      const q = D.quiz[s.qi], solved = s.ans !== null && (typeof q.a === 'boolean' ? true : s.ans === q.a);
      const mark = (isRight, isWrong) => isRight ? ' right' : isWrong ? ' wrong' : '';
      const sr = (r, w) => r ? '<span class="vh"> (' + esc(tx(ok)) + ')</span>' : w ? '<span class="vh"> (' + esc(tx(wrong)) + ')</span>' : '';
      body = '<div class="pop"><h3 class="a-h">' + esc(tx(D.stops[1][0])) + '</h3><p class="a-p">' + (s.qi + 1) + ' / ' + D.quiz.length + ' · ' + esc(tx(D.firstTry)) + '</p><div class="q"><p>' + esc(tx(q.q)) + '</p>' +
        (typeof q.a === 'boolean'
          ? '<div class="vote">' + [true, false].map(v => { const picked = s.ans === v, r = s.ans !== null && v === q.a, w = picked && v !== q.a;
              return '<button type="button" data-a="rule" data-v="' + (v ? 1 : 0) + '" class="' + mark(r, w).trim() + '"' + (s.ans !== null ? ' aria-disabled="true"' : '') + '>' + (r ? ic('check') : w ? ic('x') : '') + esc(tx(v ? D.yes : D.no)) + sr(r, w) + '</button>'; }).join('') + '</div>' +
            (s.ans !== null ? '<p class="why pop">' + esc(tx(q.w)) + '</p>' : '')
          : '<div class="who-row">' + D.team.map((m, k) => { const r = solved && k === q.a, w = s.ans === k && k !== q.a;
              return '<button type="button" class="who-btn' + mark(r, w) + '" data-a="who" data-k="' + k + '">' + av(m) + esc(nm(m)) + sr(r, w) + '</button>'; }).join('') + '</div>' +
            (s.ans !== null && !solved ? '<p class="why pop">' + esc(tx(D.retry)) + '</p>' : '')) + '</div>' +
        (solved ? '<button type="button" class="abtn pop nextb" style="background:' + ACC2 + '" data-a="qNext">' + esc(tx(D.continue)) + '</button>' : '') + '</div>';
    } else if (s.view === 'prep'){
      const all = D.prep.every((_, k) => s.prep[k] != null);
      body = '<div class="pop"><h3 class="a-h">' + esc(tx(D.stops[2][0])) + '</h3><p class="a-p">' + Object.keys(s.prep).length + ' / ' + D.prep.length + '</p>' +
        D.prep.map((p, k) => '<div class="q" role="group" aria-label="' + esc(tx(p.t)) + '"><p>' + esc(tx(p.t)) + '</p><div class="seg3">' + p.o.map((o, j) => '<button type="button" data-a="prep" data-k="' + k + '" data-j="' + j + '" aria-pressed="' + (s.prep[k] === j) + '">' + esc(o) + '</button>').join('') + '</div></div>').join('') +
        (all ? '<button type="button" class="abtn pop nextb" style="background:' + ACC2 + '" data-a="finish" data-k="2">' + esc(tx(D.continue)) + ' · +20 XP</button>' : '') + '</div>';
    } else {
      const b = D.team[3], slot = D.prep[1].o[s.prep[1]], hr = [[D.hr[0], '3 / 3'], [fill(tx(D.hr[1]), {s:D.prep[0].o[s.prep[0]], c:D.prep[2].o[s.prep[2]]}), '✓'], [s.weak ? D.hrWeak : D.hr[2], s.weak ? '!' : '✓']];
      body = '<div class="end pop"><div class="badge-big" style="background:linear-gradient(140deg,' + ACC2 + ',#5B4BFF)">' + ic('star') + '</div>' +
        '<h3 class="a-h">' + esc(tx(D.doneH)) + '</h3><p class="a-p">' + esc(tx(D.doneP)) + '</p>' +
        '<div class="pills"><span class="pill gold">' + ic('star') + s.xp + ' XP</span><span class="pill green">' + esc(fill(tx(D.score), {n:s.right})) + '</span></div>' +
        '<div class="buddy">' + av(b) + '<div><b>' + esc(tx(D.buddyT)) + '</b><small>' + esc(fill(tx(D.buddyS), {t:slot})) + '</small></div></div>' +
        '<div class="see"><div class="see-h">' + ic('eye') + '<b>' + esc(tx(D.hrT)) + '</b><span>' + esc(S[lang].ui.demo) + '</span></div><ul class="see-l">' + hr.map(r => '<li><span>' + esc(tx(r[0])) + '</span><b>' + esc(r[1]) + '</b></li>').join('') + '</ul></div>' +
        '<button type="button" class="abtn light" data-a="again">' + ic('refresh') + esc(tx(D.again)) + '</button></div>';
    }
    this.el.innerHTML = '<div class="app"><div class="app-top"><span class="logo" style="background:' + ACC2 + '">N</span><div class="tt"><b>' + esc(tx(D.brand)) + '</b><small>' + n + ' / 3</small></div>' +
      '<span class="xp">' + ic('star') + s.xp + ' XP</span></div><div class="pbar"><i style="width:' + Math.round(n / 3 * 100) + '%;background:' + ACC2 + '"></i></div>' +
      (s.view !== 'map' && s.view !== 'end' ? '<button type="button" class="backbtn" data-a="map">' + ic('back') + esc(tx(D.back)) + '</button>' : '') +
      '<div class="app-body">' + body + '</div></div>';
  }
  finish(k){ const s = this.s; if (!s.done[k]){ s.done[k] = true; s.xp += 20; } s.view = s.done.every(Boolean) ? 'end' : 'map'; this.go(s.view === 'map' ? '.stop.now' : null); confetti(this.el, s.view === 'end' ? 80 : 24); }
  click(e){
    const b = e.target.closest('[data-a]'); if (!b || b.disabled || b.getAttribute('aria-disabled') === 'true') return;
    const s = this.s, a = b.dataset.a, k = +b.dataset.k, D = ONB;
    if (a === 'stop'){ s.view = ['team', 'quiz', 'prep'][k]; s.qi = 0; s.ans = null; s.tries = 0; this.go(); }
    else if (a === 'map'){ s.view = 'map'; this.go('.stop.now'); }
    else if (a === 'flip'){ if (!s.flip.includes(k)) s.flip.push(k); b.classList.add('flip'); say(tx(D.team[k].f)); setTimeout(() => this.go(s.flip.length === 4 ? '.nextb' : '[data-a="flip"][data-k="' + k + '"]'), reduced() ? 0 : 480); }
    else if (a === 'finish') this.finish(k);
    else if (a === 'who' || a === 'rule'){
      const q = D.quiz[s.qi], v = a === 'rule' ? b.dataset.v === '1' : k;
      if (s.ans !== null && (a === 'rule' || s.ans === q.a)) return;
      const right = v === q.a; s.tries++;
      if (right && s.tries === 1){ s.right++; s.xp += 10; }
      if (!right && a === 'rule' && s.qi === 3) s.weak = true;
      s.ans = v; this.go(right || a === 'rule' ? '.nextb' : '.who-btn.wrong');
      say(tx(right ? ok : wrong) + (q.w ? '. ' + tx(q.w) : ''));
      if (!right){ const r = $('.q', this.el); r && r.classList.add('shake'); }
    }
    else if (a === 'qNext'){ if (s.qi + 1 < D.quiz.length){ s.qi++; s.ans = null; s.tries = 0; this.go(); } else this.finish(1); }
    else if (a === 'prep'){ s.prep[k] = +b.dataset.j; const all = D.prep.every((_, i) => s.prep[i] != null); this.go(all ? '.nextb' : '[data-a="prep"][data-k="' + k + '"][data-j="' + b.dataset.j + '"]'); }
    else if (a === 'again') this.reset();
  }
}

/* ========== demo 3: the brand game ========== */
const BEAN = gold => '<svg viewBox="0 0 34 34" aria-hidden="true"><ellipse cx="17" cy="17" rx="11" ry="14" transform="rotate(28 17 17)" fill="' + (gold ? '#FFC93C' : '#6B3F22') + '" stroke="' + (gold ? '#C98A00' : '#3A2010') + '" stroke-width="2"/><path d="M12 7c6 6 4 14 10 20" stroke="' + (gold ? '#C98A00' : '#3A2010') + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' + (gold ? '<path d="M27 4l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#fff"/>' : '') + '</svg>';
const ICE = '<svg viewBox="0 0 34 34" aria-hidden="true"><rect x="5" y="5" width="24" height="24" rx="6" fill="#BDEBFF" stroke="#5CB9E0" stroke-width="2"/><path d="M10 11h6M10 15h3" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';
const CUP = '<svg viewBox="0 0 78 64" aria-hidden="true"><path d="M8 8h52l-5 44a8 8 0 0 1-8 7H21a8 8 0 0 1-8-7z" fill="#fff" stroke="#0E3B2C" stroke-width="3"/><path d="M60 16h4a9 9 0 0 1 0 18h-6" stroke="#0E3B2C" stroke-width="4" fill="none"/><rect x="5" y="4" width="58" height="8" rx="4" fill="#C8F04A" stroke="#0E3B2C" stroke-width="3"/><text x="34" y="42" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#0E3B2C">ც</text></svg>';
const today = () => new Date().toISOString().slice(0, 10);
class Game extends Demo {
  constructor(el){ super(el); this.phase = 'intro'; this.render(); }
  shell(inner, play){ return '<div class="app gm"><div class="game"' + (play ? ' tabindex="0" role="application" aria-label="' + esc(tx(GAME.h) + '. ' + tx(GAME.hint)) + '"' : '') + '>' + inner + '</div></div>'; }
  render(){ if (this.phase === 'intro') this.intro(); else if (this.phase === 'over') this.over(true); }
  intro(){
    this.stop(); this.phase = 'intro'; const D = GAME;
    this.el.innerHTML = this.shell('<div class="g-over pop"><div class="g-logo">ც</div>' +
      '<p class="g-kick">' + esc(tx(D.brand)) + '</p><h3 class="a-h">' + esc(tx(D.h)) + '</h3><p class="a-p">' + esc(tx(D.p)) + '</p>' +
      '<div class="how3"><div>' + BEAN(false) + esc(tx(D.how[0])) + '</div><div>' + BEAN(true) + esc(tx(D.how[1])) + '</div><div>' + ICE + esc(tx(D.how[2])) + '</div></div>' +
      '<button type="button" class="abtn lime" data-a="go">' + esc(tx(D.start)) + ic('arrow') + '</button>' +
      '<p class="g-hint">' + esc(tx(D.hint)) + '</p></div>');
  }
  play(){
    this.stop(); this.phase = 'play';
    this.el.innerHTML = this.shell('<div class="hud"><span>' + ic('star') + '<b id="gScore">0</b></span><span class="combo" id="gCombo" hidden>×2</span><span>' + ic('clock') + '<b id="gTime">15</b></span></div><div class="cup" id="gCup">' + CUP + '</div><div class="chill" id="gChill"></div>', true);
    const g = $('.game', this.el), cup = $('#gCup', this.el);
    g.focus({preventScroll:true});
    const W = g.clientWidth, H = g.clientHeight;
    const st = this.g = {g, cup, W, H, x:W / 2 - 39, tx:W / 2 - 39, score:0, streak:0, t0:performance.now(), last:performance.now(), spawn:0, drops:[], on:true, keys:{}};
    const move = e => { const r = g.getBoundingClientRect(); st.tx = Math.max(0, Math.min(W - 78, (e.clientX - r.left) - 39)); };
    g.addEventListener('pointerdown', e => { move(e); if (g.setPointerCapture) g.setPointerCapture(e.pointerId); });
    g.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons) move(e); });
    g.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){ st.keys[e.key] = true; e.preventDefault(); } });
    g.addEventListener('keyup', e => { st.keys[e.key] = false; });
    const loop = now => {
      if (!st.on) return;
      const dt = Math.min(.05, (now - st.last) / 1000); st.last = now;
      const el = (now - st.t0) / 1000, left = Math.max(0, 15 - el), late = el > 7;
      $('#gTime', this.el).textContent = Math.ceil(left);
      if (st.keys.ArrowLeft) st.tx = Math.max(0, st.tx - 420 * dt);
      if (st.keys.ArrowRight) st.tx = Math.min(W - 78, st.tx + 420 * dt);
      st.spawn -= dt;
      if (st.spawn <= 0 && left > .5){
        st.spawn = Math.max(.3, .6 - el * .018);
        const r = Math.random(), type = r < .1 ? 'gold' : r < (late ? .42 : .3) ? 'ice' : 'bean';
        const d = document.createElement('div'); d.className = 'drop'; d.innerHTML = type === 'ice' ? ICE : BEAN(type === 'gold'); g.appendChild(d);
        st.drops.push({d, type, x:8 + Math.random() * (W - 50), y:-40, v:(170 + Math.random() * 90 + el * 14) * (type === 'gold' ? 1.3 : 1), rot:Math.random() * 360, vr:Math.random() * 200 - 100});
      }
      st.x += (st.tx - st.x) * Math.min(1, dt * 14);
      cup.style.transform = 'translateX(' + st.x + 'px)';
      const rim = H - 26 - 64;
      st.drops = st.drops.filter(o => {
        const prev = o.y; o.y += o.v * dt; o.rot += o.vr * dt;
        o.d.style.transform = 'translate(' + o.x + 'px,' + o.y + 'px) rotate(' + o.rot + 'deg)';
        // only a drop that crosses the rim inside the cup's mouth counts
        const bottom = o.y + 28, prevBottom = prev + 28, cx = o.x + 17;
        if (prevBottom <= rim + 4 && bottom >= rim && cx > st.x + 12 && cx < st.x + 62){
          let pts = o.type === 'gold' ? 3 : o.type === 'ice' ? -2 : 1;
          if (o.type === 'bean'){ st.streak++; if (st.streak >= 3) pts = 2; } else if (o.type === 'ice') st.streak = 0;
          $('#gCombo', this.el).hidden = st.streak < 3;
          st.score = Math.max(0, st.score + pts); $('#gScore', this.el).textContent = st.score;
          const f = document.createElement('div'); f.className = 'float'; f.textContent = (pts > 0 ? '+' : '') + pts; f.style.left = (st.x + 30) + 'px'; f.style.top = (rim - 10) + 'px';
          if (pts < 0) f.style.color = '#BDEBFF'; g.appendChild(f); setTimeout(() => f.remove(), 800);
          if (pts < 0){ cup.classList.remove('shake'); void cup.offsetWidth; cup.classList.add('shake'); const c = $('#gChill', this.el); c.classList.remove('on'); void c.offsetWidth; c.classList.add('on'); }
          o.d.remove(); return false;
        }
        if (o.y > H){ if (o.type === 'bean') st.streak = 0; $('#gCombo', this.el).hidden = st.streak < 3; o.d.remove(); return false; }
        return true;
      });
      if (left <= 0 && !st.drops.length){ this.result = {score:st.score}; return this.over(); }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  over(again){
    this.stop(); this.phase = 'over'; const D = GAME, sc = this.result.score;
    // one prize per phone per day; replays only count for the leaderboard
    let saved = null; try { saved = JSON.parse(store.get('prize') || 'null'); } catch (e) {}
    if (!again){
      if (saved && saved.day === today()) this.result.keep = saved;
      else { const tier = D.prizes.findIndex(p => sc >= p[0]); saved = {day:today(), tier, code:'TSK-' + Math.random().toString(36).slice(2, 6).toUpperCase(), score:sc}; store.set('prize', JSON.stringify(saved)); this.result.prize = saved; }
    }
    const pz = this.result.prize || this.result.keep, prize = D.prizes[pz.tier][1];
    const board = [['ნინო', 'Nino', 34], ['გიორგი', 'Giorgi', 27], ['მაკა', 'Maka', 21], ['ლუკა', 'Luka', 15]].map(r => [lang === 'ka' ? r[0] : r[1], r[2], false]);
    board.push([tx(D.you), sc, true]); board.sort((a, b) => b[1] - a[1]);
    this.el.innerHTML = this.shell('<div class="g-over pop" style="justify-content:flex-start;overflow-y:auto"><p class="g-kick">' + esc(tx(D.over)) + '</p>' +
      '<h3 class="a-h" style="font-size:44px;margin:0">' + sc + '</h3><p class="a-p" style="margin-bottom:12px">' + esc(tx(D.pts)) + '</p>' +
      (this.result.keep ? '<p class="g-note">' + esc(tx(D.saved)) + '</p>' : '') +
      '<div class="scratch"><b>' + esc(tx(prize)) + '</b><code>' + pz.code + '</code><small>' + esc(tx(D.code)) + '</small>' + (this.result.keep || again ? '' : '<canvas id="gScr" role="button" tabindex="0" aria-label="' + esc(tx(D.reveal)) + '"></canvas>') + '</div>' +
      '<p class="g-kick" style="text-align:left;color:rgba(255,255,255,.8)">' + esc(tx(D.board)) + '</p><ol class="lb">' + board.slice(0, 5).map((r, k) => '<li class="' + (r[2] ? 'me' : '') + '"><span>' + (k + 1) + '. ' + esc(r[0]) + '</span><span>' + r[1] + '</span></li>').join('') + '</ol>' +
      seeCard(D.brandT, D.brandSee, true) +
      '<button type="button" class="abtn lime" data-a="go">' + ic('refresh') + esc(tx(D.again)) + '</button></div>');
    const cv = $('#gScr', this.el); if (cv) this.scratch(cv, tx(D.scratch));
    if (!again){ const h = $('.a-h', this.el); h.setAttribute('tabindex', '-1'); h.focus({preventScroll:true}); say(tx(D.over) + ' ' + sc + ' ' + tx(D.pts) + '. ' + tx(prize)); if (sc >= 18) confetti(this.el, 60); }
  }
  scratch(cv, label){
    const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; cv.width = r.width * dpr; cv.height = r.height * dpr;
    const c = cv.getContext('2d'); c.scale(dpr, dpr);
    const gr = c.createLinearGradient(0, 0, r.width, r.height); gr.addColorStop(0, '#C8F04A'); gr.addColorStop(1, '#9FD12E');
    c.fillStyle = gr; c.fillRect(0, 0, r.width, r.height);
    c.fillStyle = '#0E3B2C'; c.font = '700 14px "Google Sans","Noto Sans Georgian",sans-serif'; c.textAlign = 'center'; c.fillText(label, r.width / 2, r.height / 2 + 5);
    c.globalCompositeOperation = 'destination-out';
    let down = false, n = 0;
    const done = () => { cv.style.transition = 'opacity .3s'; cv.style.opacity = 0; setTimeout(() => cv.remove(), 300); };
    const at = e => { const b = cv.getBoundingClientRect(); c.beginPath(); c.arc(e.clientX - b.left, e.clientY - b.top, 20, 0, Math.PI * 2); c.fill(); if (++n > 28) done(); };
    cv.addEventListener('pointerdown', e => { down = true; if (cv.setPointerCapture) cv.setPointerCapture(e.pointerId); at(e); });
    cv.addEventListener('pointermove', e => { if (down) at(e); });
    cv.addEventListener('pointerup', () => { down = false; });
    cv.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); done(); } });
  }
  click(e){ const b = e.target.closest('[data-a]'); if (b && b.dataset.a === 'go') this.play(); }
  stop(){ if (this.g) this.g.on = false; cancelAnimationFrame(this.raf); }
  destroy(){ this.stop(); }
}

/* ========== demo 4: the event invitation ========== */
// the party is at 19:00 Tbilisi time (UTC+4), 12 days from today
function partyDate(){ const t = new Date(Date.now() + 4 * 3600e3); return {y:t.getUTCFullYear(), m:t.getUTCMonth(), d:t.getUTCDate() + 12}; }
class Invite extends Demo {
  constructor(el){ super(el); const p = partyDate(), u = new Date(Date.UTC(p.y, p.m, p.d, 15, 0)); this.when = u; this.wd = new Date(Date.UTC(p.y, p.m, p.d, 12)); this.reset(true); }
  reset(silent){ this.s = {view:'env', guests:0, food:0, ans:null, code:'NV-' + Math.floor(1000 + Math.random() * 9000)}; silent ? this.render() : this.go(); }
  date(short){ const d = this.wd, D = S[lang]; return short ? D.dy[d.getUTCDay()] + ', ' + d.getUTCDate() + ' ' + D.mon[d.getUTCMonth()] : D.days[d.getUTCDay()] + ', ' + d.getUTCDate() + ' ' + D.months[d.getUTCMonth()]; }
  render(){
    clearInterval(this.t);
    const s = this.s, D = INV;
    let body = '';
    if (s.view === 'env'){
      body = '<div class="env-wrap"><p class="inv-kick">' + esc(tx(D.kick)) + '</p><button type="button" class="env" data-a="open" aria-label="' + esc(tx(D.tap)) + '">' +
        '<span class="back"></span><span class="card">Nova · 5</span><span class="front"></span><span class="flap"></span><span class="seal">N</span></button>' +
        '<p class="tap-hint"><span></span>' + esc(tx(D.tap)) + '</p></div>';
    } else if (s.view === 'card'){
      body = '<div class="pop"><p class="inv-kick">' + esc(tx(D.kick)) + '</p><h3 class="inv-h">' + esc(tx(D.h)) + '</h3><p class="inv-p">' + esc(tx(D.p)) + '</p>' +
        '<div class="inv-meta"><div>' + ic('cal') + '<span><b>' + esc(this.date()) + '</b><small>19:00</small></span></div><div>' + ic('pin') + '<span><b>' + esc(tx(D.venue)) + '</b><small>' + esc(tx(D.venueS)) + '</small></span></div>' +
        '<div>' + ic('shirt') + '<span><b>' + esc(tx(D.dress)) + '</b><small>' + esc(tx(D.dressS)) + '</small></span></div></div>' +
        '<ul class="prog">' + D.prog.map(p => '<li><b>' + p[0] + '</b>' + esc(tx(p[1])) + '</li>').join('') + '</ul>' +
        '<p class="inv-q">' + esc(tx(D.q)) + '</p>' +
        (s.ans === true ? '<div class="stepper"><span id="plusL">' + esc(tx(D.plus)) + '</span><div role="group" aria-labelledby="plusL"><button type="button" data-a="minus" aria-label="−1"' + (s.guests ? '' : ' disabled') + '>' + ic('minus') + '</button><b aria-live="polite">' + s.guests + '</b><button type="button" data-a="plus" aria-label="+1"' + (s.guests >= 1 ? ' disabled' : '') + '>' + ic('plus') + '</button></div></div>' +
          '<p class="inv-sub" id="foodL">' + esc(tx(D.food)) + '</p><div class="foods" role="group" aria-labelledby="foodL">' + D.foods.map((f, k) => '<button type="button" data-a="food" data-k="' + k + '" aria-pressed="' + (s.food === k) + '">' + esc(tx(f)) + '</button>').join('') + '</div>' +
          '<button type="button" class="abtn lav nextb" data-a="confirm">' + ic('check') + esc(tx(D.confirm)) + '</button>'
          : '<div class="rsvp"><button type="button" class="yes" data-a="yes">' + esc(tx(D.yes)) + '</button><button type="button" class="no" data-a="no">' + esc(tx(D.no)) + '</button></div>') + '</div>';
    } else if (s.view === 'ticket'){
      let h = 0; for (const ch of s.code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      let qr = '';
      for (let i = 0; i < 21 * 21; i++){ const x = i % 21, y = Math.floor(i / 21); if ((x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)) continue; h = (h * 1103515245 + 12345) >>> 0; if (h & 0x100) qr += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>'; }
      const fnd = (x, y) => '<rect x="' + (x + .5) + '" y="' + (y + .5) + '" width="6" height="6" fill="none" stroke="#111"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3"/>';
      body = '<div class="pop"><p class="inv-kick">' + esc(tx(D.kick)) + '</p><h3 class="inv-h" style="font-size:24px">' + esc(tx(D.tkH)) + '</h3>' +
        '<div class="cd" id="cd" role="timer">' + D.cd.map(x => '<div><b>0</b><small>' + esc(tx(x)) + '</small></div>').join('') + '</div>' +
        '<div class="ticket"><svg class="qr" viewBox="0 0 21 21" fill="#111" aria-hidden="true">' + qr + fnd(0, 0) + fnd(14, 0) + fnd(0, 14) + '</svg>' +
        '<div class="tk-h">Nova · 5</div><div class="tk-s">' + esc(lang === 'ka' ? 'ანა' : 'Ana') + (s.guests ? ' + 1' : '') + ' · ' + esc(tx(D.foods[s.food])) + '</div><div class="tk-g">' +
        '<span>' + esc(tx(D.when)) + '<b>' + esc(this.date(true)) + ' · 19:00</b></span><span>' + esc(tx(D.where)) + '<b>' + esc(tx(D.venue)) + '</b></span>' +
        '<span>' + esc(tx(D.guests)) + '<b>' + (1 + s.guests) + '</b></span><span>' + esc(tx(D.code)) + '<b>' + s.code + '</b></span></div></div>' +
        '<button type="button" class="abtn lav" style="margin-bottom:8px" data-a="ics">' + ic('cal') + esc(tx(D.cal)) + '</button>' +
        seeCard(D.orgT, D.org, true) +
        '<button type="button" class="abtn light" data-a="change">' + esc(tx(D.change)) + '</button></div>';
    } else {
      body = '<div class="pop" style="text-align:center;padding-top:40px"><div class="no-ic">' + ic('heart') + '</div>' +
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
    const q = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Gancda//Demo//EN', 'BEGIN:VEVENT', 'UID:' + this.s.code + '@gancda.com', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(d), 'DTEND:' + f(e),
      'SUMMARY:' + q(tx(INV.h)), 'LOCATION:' + q(tx(INV.venue) + ', Tbilisi'), 'DESCRIPTION:' + q('Gancda demo invitation'), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], {type:'text/calendar'})); a.download = 'nova-5.ics'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  click(e){
    const b = e.target.closest('[data-a]'); if (!b || b.disabled) return;
    const s = this.s, a = b.dataset.a;
    if (a === 'open'){ b.classList.add('open'); setTimeout(() => { s.view = 'card'; this.go(); }, reduced() ? 0 : 1000); }
    else if (a === 'yes'){ s.ans = true; this.go('[data-a="plus"]'); }
    else if (a === 'no'){ s.ans = false; s.view = 'no'; this.go(); }
    else if (a === 'plus'){ s.guests = 1; this.go('[data-a="minus"]'); }
    else if (a === 'minus'){ s.guests = 0; this.go('[data-a="plus"]'); }
    else if (a === 'food'){ s.food = +b.dataset.k; this.go('[data-a="food"][data-k="' + s.food + '"]'); }
    else if (a === 'confirm'){ s.view = 'ticket'; this.go(); confetti(this.el, 36); say(tx(INV.tkH)); }
    else if (a === 'ics') this.ics();
    else if (a === 'change'){ s.view = 'card'; s.ans = null; this.go(); }
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
  el.setAttribute('aria-label', S[lang].fmt[k].n);
  $$('#picker .pick').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
}

/* ---------- page ---------- */
function renderStatic(){
  const D = S[lang];
  document.documentElement.lang = lang;
  document.title = D.meta.title;
  const md = $('meta[name="description"]'); if (md) md.setAttribute('content', D.meta.desc);
  $$('[data-t]').forEach(el => { const v = path(D, el.dataset.t); if (v != null) el.textContent = v; });
  $$('[data-th]').forEach(el => { const v = path(D, el.dataset.th); if (v != null) el.innerHTML = v; });
  $$('[data-tp]').forEach(el => { const v = path(D, el.dataset.tp); if (v != null) el.placeholder = v; });
  $$('[data-ic]').forEach(el => { el.innerHTML = ic(el.dataset.ic); });
  $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  $('#facts').innerHTML = D.hero.facts.map(f => '<li>' + ic('check') + esc(f) + '</li>').join('');
  $('#picker').setAttribute('aria-label', lang === 'ka' ? 'დემოს არჩევა' : 'Choose a demo');
  $('#picker').innerHTML = FMT.map(k => '<button type="button" class="pick" data-k="' + k + '" aria-pressed="' + (k === cur) + '" aria-controls="phone"><span class="ic">' + ic(k) + '</span><span class="pt"><b>' + esc(D.fmt[k].n) + '</b><span>' + esc(D.fmt[k].s) + '</span></span></button>').join('');
  $('#whoList').innerHTML = D.who.list.map(w => '<article class="persona"><div class="ic">' + ic(w.k === 'hr' ? 'users' : w.k === 'mkt' ? 'megaphone' : 'cal') + '</div><h3>' + esc(w.n) + '</h3><p>' + esc(w.o) + '</p>' +
    '<p class="mini2">' + esc(D.who.see) + '</p><ul>' + w.m.map(u => '<li>' + ic('check') + esc(u) + '</li>').join('') + '</ul>' +
    '<div class="row">' + w.f.map(k => '<button type="button" class="btn ghost sm" data-play="' + k + '">' + ic(k) + esc(D.ui.play + ': ' + D.fmt[k].n) + '</button>').join('') + '</div></article>').join('');
  $('#steps').innerHTML = D.how.steps.map(s => '<li><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></li>').join('');
  const R = D.res;
  $('#resChecks').innerHTML = R.checks.map(c => '<li>' + ic('check') + esc(c) + '</li>').join('');
  $('#dash').innerHTML = '<div class="dash-top"><b>' + esc(R.title) + '</b><span class="tag">' + ic('chart') + esc(D.ui.demo) + '</span></div>' +
    '<div class="kpis">' + R.kpis.map(k => '<div class="kpi"><b>' + esc(k[0]) + '</b><span>' + esc(k[1]) + '</span></div>').join('') + '</div>' +
    '<p class="mini2">' + esc(R.barsT) + '</p><div class="bars">' +
    R.bars.map(b => '<div class="bar"><div class="t"><span>' + esc(b[0]) + '</span><b>' + b[1] + '%</b></div><div class="tr"><i data-w="' + b[1] + '"></i></div></div>').join('') + '</div>' +
    '<p class="hard">' + esc(R.hard) + '</p>';
  if (dashSeen) $$('#dash .tr i').forEach(i => { i.style.width = i.dataset.w + '%'; });
  $('#pkgs').innerHTML = D.pk.list.map((p, i) => '<article class="pkg' + (i === 0 ? ' hl' : '') + '">' + (p.b ? '<span class="badge">' + esc(p.b) + '</span>' : '') + '<h3>' + esc(p.n) + '</h3><p class="for">' + esc(p.f) + '</p>' +
    '<ul>' + p.i.map(x => '<li>' + ic('check') + esc(x) + '</li>').join('') + '</ul>' +
    '<a class="btn ' + (i === 0 ? 'acc' : 'ghost') + '" href="#contact" data-want="' + (i === 0 ? 'pilot' : '') + '">' + esc(p.c) + '</a></article>').join('');
  $('#faqList').innerHTML = D.faq.list.map(q => '<details><summary>' + esc(q[0]) + ic('plus') + '</summary><p>' + esc(q[1]) + '</p></details>').join('');
  const picked = ($('input[name="what"]:checked') || {}).value;
  $('#whatChips').innerHTML = FMT.concat('unsure').map(k => '<label><input type="radio" name="what" value="' + k + '"' + (k === picked ? ' checked' : '') + '><span>' + esc(k === 'unsure' ? D.f.unsure : D.fmt[k].n) + '</span></label>').join('');
  $('#year').textContent = new Date().getFullYear();
  themeIcon();
  if (!$('#sent').hidden && lastReq) showSent(lastReq.mode, lastReq.err, true);
}
let dashSeen = false;
if ('IntersectionObserver' in window) new IntersectionObserver((es, ob) => { if (es[0].isIntersecting){ dashSeen = true; $$('#dash .tr i').forEach(i => { i.style.width = i.dataset.w + '%'; }); ob.disconnect(); } }, {threshold:.3}).observe($('#dash'));
else dashSeen = true;

document.addEventListener('click', e => {
  const p = e.target.closest('#picker .pick'); if (p){ mountDemo(p.dataset.k); if (innerWidth < 980) $('.stage').scrollIntoView({behavior: reduced() ? 'auto' : 'smooth', block:'center'}); return; }
  const c = e.target.closest('[data-play]');
  if (c){ mountDemo(c.dataset.play); $('.stage').scrollIntoView({behavior: reduced() ? 'auto' : 'smooth', block:'center'}); setTimeout(() => { const f = $('#phone button'); f && f.focus({preventScroll:true}); }, reduced() ? 0 : 500); return; }
  const w = e.target.closest('[data-want]'); if (w && w.dataset.want === 'pilot'){ const m = $('#fMsg'); if (m && !m.value) m.value = lang === 'ka' ? 'გვაინტერესებს პილოტი.' : 'We are interested in a pilot.'; }
});
$$('[data-lang]').forEach(b => b.addEventListener('click', () => { if (lang === b.dataset.lang) return; lang = b.dataset.lang; store.set('lang', lang); renderStatic(); if (inst){ inst.render(); $('#phone').setAttribute('aria-label', S[lang].fmt[cur].n); } }));

/* theme */
function effTheme(){ const a = document.documentElement.getAttribute('data-theme'); if (a === 'dark' || a === 'light') return a; return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
function themeIcon(){ const b = $('#themeBtn'), d = effTheme() === 'dark'; b.innerHTML = ic(d ? 'sun' : 'moon'); b.setAttribute('aria-label', S[lang].ui.theme); b.setAttribute('aria-pressed', d); }
const savedTheme = store.get('theme'); if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.setAttribute('data-theme', savedTheme);
$('#themeBtn').addEventListener('click', () => { const n = effTheme() === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', n); store.set('theme', n); themeIcon(); });
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeIcon);
window.addEventListener('scroll', () => $('#hdr').classList.toggle('scrolled', scrollY > 8), {passive:true});

/* ---------- the request form ---------- */
let lastReq = null;
// same rule as the server (functions/api/requests.js): an email, an @handle or a phone number
const contactOk = c => /@/.test(c) && c.replace(/[^\w]/g, '').length >= 3 || c.replace(/\D/g, '').length >= 9;
function readForm(){
  const what = ($('input[name="what"]:checked') || {}).value || '', company = $('#fCompany').value.trim(), msg = $('#fMsg').value.trim(), F = S[lang].f;
  return {who: FMT.includes(what) ? what : '', interest: what, name:$('#fName').value.trim(), contact:$('#fContact').value.trim(),
    message:(company ? F.company2 + ': ' + company + (msg ? '\n\n' : '') : '') + msg, lang, website:$('#fWeb').value};
}
function reqText(r){ const F = S[lang].f, D = S[lang]; return [F.what + ': ' + (r.interest === 'unsure' ? F.unsure : r.interest ? D.fmt[r.interest].n : '-'), F.name + ': ' + r.name, F.contact + ': ' + r.contact, '', r.message].join('\n'); }
function showSent(mode, err, quiet){
  const F = S[lang].f, box = $('#sent');
  const h = mode === 'ok' ? F.okH : mode === 'fail' ? F.failH : F.offH, p = mode === 'ok' ? F.ok : fill(mode === 'fail' ? F.fail : F.off, {email:CONFIG.email});
  box.innerHTML = '<div class="sent"><div class="ok' + (mode === 'ok' ? '' : ' warn') + '">' + ic(mode === 'ok' ? 'check' : 'mail') + '</div><h3 tabindex="-1">' + esc(h) + '</h3>' +
    (err ? '<p class="err-s">' + esc(err) + '</p>' : '') + '<p>' + esc(p) + '</p>' +
    (mode !== 'ok' ? '<pre id="reqText">' + esc(reqText(lastReq)) + '</pre><p style="margin-top:12px"><button type="button" class="btn ghost sm" id="copyReq">' + ic('copy') + '<span>' + esc(F.copy) + '</span></button></p>' : '') +
    '<button type="button" class="btn ghost sm" id="againReq">' + esc(mode === 'fail' ? (lang === 'ka' ? 'სცადეთ ხელახლა' : 'Try again') : F.again) + '</button></div>';
  box.hidden = false; $('#form').hidden = true;
  if (!quiet){ $('#sent h3').focus(); say(h); }
  const cp = $('#copyReq'); if (cp) cp.addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(reqText(lastReq)).then(() => { cp.lastChild.textContent = F.copied; }); });
  $('#againReq').addEventListener('click', () => { box.hidden = true; $('#form').hidden = false; if (mode === 'ok') $('#form').reset(); $('#fName').focus(); });
}
function validate(){
  const F = S[lang].f, name = $('#fName').value.trim(), c = $('#fContact').value.trim(), cOk = contactOk(c);
  $('#fbName').classList.toggle('bad', !name); $('#eName').textContent = name ? '' : F.eName; $('#fName').setAttribute('aria-invalid', !name);
  $('#fbContact').classList.toggle('bad', !cOk); $('#eContact').textContent = cOk ? '' : F.eContact; $('#fContact').setAttribute('aria-invalid', !cOk);
  if (!name){ $('#fName').focus(); return false; } if (!cOk){ $('#fContact').focus(); return false; } return true;
}
$('#form').addEventListener('submit', e => {
  e.preventDefault(); if (!validate()) return;
  lastReq = readForm();
  if (!CONFIG.formEndpoint){ lastReq.mode = 'off'; showSent('off'); return; }
  const sb = $('#sendBtn'), F = S[lang].f; sb.disabled = true; sb.firstChild.textContent = F.sending;
  fetch(CONFIG.formEndpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(Object.assign({summary:reqText(lastReq)}, lastReq))})
    .then(r => r.json().catch(() => ({})).then(d => { if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status)); lastReq.mode = 'ok'; lastReq.err = ''; showSent('ok'); }))
    .catch(err => { lastReq.mode = 'fail'; lastReq.err = err.message; showSent('fail', err.message); })
    .finally(() => { sb.disabled = false; sb.firstChild.textContent = S[lang].f.send; });
});
['#fName', '#fContact'].forEach(id => $(id).addEventListener('input', () => { if ($(id).closest('.field').classList.contains('bad')) validate(); }));

renderStatic();
mountDemo(FMT.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'learn');
})();
