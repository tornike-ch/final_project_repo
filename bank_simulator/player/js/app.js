/*
 * Player UI and session flow.
 *
 * Evaluation run: starts at level 1 and continues while levels are passed.
 * It ends when all levels are passed or a level is failed. Only this first
 * run is reported to the LMS. Afterwards the employee may practise without
 * limit (practice never overwrites the LMS score).
 */
(function () {
  'use strict';

  var Engine = window.Engine;
  var Scorm = window.Scorm;
  var Avatar = window.Avatar;

  var content = Engine.normalize(window.SIM_CONTENT || {});
  var cfg = content.config;
  var SKILLS = Engine.SKILLS;

  /* ---------------- Georgian UI strings ---------------- */
  var T = {
    skills: { knowledge: 'პროდუქტის ცოდნა', service: 'მომსახურება', sales: 'გაყიდვები' },
    channels: { branch: 'ფილიალი', phone: 'ტელეფონი', chat: 'ჩატი' },
    outcomes: {
      resolved: 'საკითხი მოგვარებულია',
      unresolved: 'საკითხი არ მოგვარდა',
      walkout: 'კლიენტი წავიდა',
      escalated: 'გადაეცა მენეჯერს'
    },
    walkout: {
      branch: 'კლიენტმა უკმაყოფილოდ დატოვა ფილიალი.',
      phone: 'კლიენტმა ზარი გათიშა.',
      chat: 'კლიენტმა ჩატი დატოვა.'
    },
    verdicts: { best: 'საუკეთესო', ok: 'მისაღები', poor: 'სუსტი', critical: 'კრიტიკული შეცდომა' },
    you: 'თქვენ',
    system: 'სისტემა',
    customer: 'კლიენტი'
  };

  /* ---------------- helpers ---------------- */
  var app = document.getElementById('app');

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function byId(list) {
    var m = {};
    list.forEach(function (x) { m[x.id] = x; });
    return m;
  }

  window.SIM_PORTRAITS = Array.isArray(content.portraits) ? content.portraits : [];
  window.SIM_PORTRAITS_AUTO = cfg.features.autoPortraits !== false;

  var CASES = byId(content.cases);
  var QUIZ = byId(content.quiz);
  var PRODUCTS = byId(content.products);
  var LEVELS = cfg.levels;

  function fmtTime(sec) {
    sec = Math.round(sec || 0);
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function fullscreenSupported() {
    return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  }
  function isFullscreen() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function toggleFullscreen() {
    var el = document.documentElement;
    try {
      if (isFullscreen()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    } catch (e) { /* refused by the host */ }
  }
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
    document.addEventListener(ev, function () {
      var b = document.querySelector('.fs-btn');
      if (b) b.innerHTML = isFullscreen() ? ICONS.fsExit : ICONS.fs;
    });
  });

  var ICONS = {
    fs: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z" fill="currentColor"/></svg>',
    fsExit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h2v6H4V8h4zm6 0h2v4h4v2h-6zM4 14h6v6H8v-4H4zm10 0h6v2h-4v4h-2z" fill="currentColor"/></svg>',
    branch: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10 12 4l9 6v1H3zM5 12h2v6H5zm4 0h2v6H9zm4 0h2v6h-2zm4 0h2v6h-2zM3 19h18v2H3z" fill="currentColor"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1z" fill="currentColor"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11a3 3 0 0 1 3 3v15H7a2 2 0 0 1-2-2zm2 14v2h10v-2zM8 6v2h7V6z" fill="currentColor"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 16.2-3.5-3.5L4 14.2l5 5 11-11-1.5-1.4z" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" fill="currentColor"/></svg>'
  };

  /* ---------------- theme ---------------- */
  /** Darken a brand colour until white text on it reaches WCAG AA (4.5:1). */
  function strongShade(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return hex;
    var rgb = [0, 2, 4].map(function (i) { return parseInt(m[1].substr(i, 2), 16); });
    function lum(c) {
      var v = c.map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
      return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    }
    for (var k = 0; k < 30 && 1.05 / (lum(rgb) + 0.05) < 4.6; k++) rgb = rgb.map(function (x) { return Math.round(x * 0.93); });
    return '#' + rgb.map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }

  function applyTheme() {
    var t = cfg.theme;
    var r = document.documentElement.style;
    r.setProperty('--primary', t.primary);
    r.setProperty('--primary-dark', t.primaryDark);
    r.setProperty('--accent', t.accent);
    r.setProperty('--bg', t.background);
    r.setProperty('--primary-strong', strongShade(t.primary));
    r.setProperty('--accent-strong', strongShade(t.accent));
    document.title = t.productName + ' — ' + t.bankName;
  }

  /* ---------------- persistent state (suspend_data) ---------------- */
  var state;
  var studentName = '';
  var studentId = '';
  var detailKey;

  function emptyEval() { return { s: 'n', li: 0, st: [], i: 0, r: [], q: [], lv: [], n: 0, res: null }; }

  function loadState() {
    var raw = Scorm.get('cmi.suspend_data');
    var parsed = null;
    try { parsed = raw ? JSON.parse(raw) : null; } catch (e) { parsed = null; }
    state = parsed && parsed.v === 1 ? parsed : { v: 1, e: emptyEval(), p: { u: 0, n: 0 } };
    var status = Scorm.get('cmi.core.lesson_status');
    var scoreRaw = Scorm.get('cmi.core.score.raw');
    // The LMS holds a finished, scored attempt but our saved data is gone: keep the evaluation locked.
    // (A status without a score can come from an LMS that auto-completes on exit; that must not lock.)
    if (!parsed && /^(completed|passed|failed)$/.test(status) && scoreRaw !== '') {
      state.e.s = 'd';
      state.e.res = { o: Number(scoreRaw), lost: 1 };
      state.e.sent = 1;
    }
  }

  /** LMS launched us for browsing/review, or the attempt does not count. */
  function noCredit() {
    var mode = Scorm.get('cmi.core.lesson_mode');
    return mode === 'browse' || mode === 'review' || Scorm.get('cmi.core.credit') === 'no-credit';
  }

  function saveState() {
    var data = JSON.stringify(state);
    if (data.length > 4000) {
      // SCORM 1.2 limit is 4096 chars. First drop the replay strings of finished cases
      // (only the report detail is lost), keeping scores, level index and outcome.
      state.e.r = state.e.r.map(function (r) { return r.slice(0, 12); });
      data = JSON.stringify(state);
    }
    if (data.length > 4000) {
      state.e.r = state.e.r.map(function (r) { return r.slice(0, 10); });
      data = JSON.stringify(state);
    }
    Scorm.set('cmi.suspend_data', data);
    Scorm.commit();
  }

  function saveDetail(run) {
    try {
      var keep = run.caseResults.map(function (r) { return r.compact ? null : r; }).filter(Boolean);
      window.localStorage.setItem(detailKey, JSON.stringify({ cases: keep, quiz: run.quizResults }));
    } catch (e) { /* storage unavailable */ }
  }

  function loadDetail() {
    try {
      var raw = window.localStorage.getItem(detailKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  /* compact case result for suspend_data */
  function compactCase(r, caseRun) {
    var crit = { knowledge: 0, service: 0, sales: 0 };
    r.criticals.forEach(function (c) { crit[c.skill] = (crit[c.skill] || 0) + 1; });
    var enc = caseRun ? caseRun.encodeSteps() : [];
    var simple = enc.every(function (x) { return typeof x === 'number'; });
    return [r.caseId, r.earned.knowledge, r.earned.service, r.earned.sales, crit.knowledge, crit.service, crit.sales,
      r.lvl, r.seconds, (r.outcome || 'u').charAt(0), r.captured.length, r.ref.opens + r.ref.views,
      simple ? enc.join('') : enc];
  }

  /** Re-runs recorded steps through the engine (resume / report after reload). */
  function replayCase(cs, saved) {
    var list = typeof saved === 'string' ? saved.split('').map(Number) : (saved || []);
    var cr = new Engine.CaseRun(content, cs);
    for (var k = 0; k < list.length; k++) {
      var r = cr.applyStep(list[k]);
      if (!r || r.ended) break;
    }
    cr.steps.forEach(function (st) { st.latency = null; });
    return cr;
  }

  function expandCase(a) {
    var criticals = [];
    [['knowledge', a[4]], ['service', a[5]], ['sales', a[6]]].forEach(function (p) {
      for (var i = 0; i < (p[1] || 0); i++) criticals.push({ skill: p[0], reason: '' });
    });
    var o = { r: 'resolved', u: 'unresolved', w: 'walkout', e: 'escalated' }[a[9]] || 'resolved';
    var cs = CASES[a[0]];
    if (cs && a[12]) {
      try {
        var res = replayCase(cs, a[12]).result();
        // keep the scores that were reported; take the step detail from the replay
        res.earned = { knowledge: a[1], service: a[2], sales: a[3] };
        if (res.criticals.length !== criticals.length) res.criticals = criticals;
        res.lvl = a[7] || 0; res.seconds = a[8] || 0; res.outcome = o;
        res.ref = { opens: 0, searches: 0, views: a[11] || 0 };
        return res;
      } catch (e) { /* content changed: fall back to the summary */ }
    }
    return {
      caseId: a[0], level: cs ? cs.level : 0, lvl: a[7] || 0,
      earned: { knowledge: a[1], service: a[2], sales: a[3] },
      criticals: criticals, captured: [], steps: [], outcome: o, seconds: a[8] || 0,
      ref: { opens: 0, searches: 0, views: a[11] || 0 }, compact: true, channel: cs ? cs.channel : 'branch'
    };
  }

  /* ---------------- LMS reporting ---------------- */
  function sanitizeId(s) { return String(s).replace(/[^A-Za-z0-9_\-.]/g, '_').slice(0, 250); }

  function interaction(fields) {
    var i = state.e.n++;
    var p = 'cmi.interactions.' + i + '.';
    if (!Scorm.set(p + 'id', sanitizeId(fields.id), true)) {
      // index out of step with the LMS (e.g. it dropped stored interactions): append at _count
      var c = parseInt(Scorm.get('cmi.interactions._count'), 10);
      if (!isNaN(c) && c !== i) { i = c; state.e.n = c + 1; p = 'cmi.interactions.' + i + '.'; }
      Scorm.set(p + 'id', sanitizeId(fields.id));
    }
    Scorm.set(p + 'type', fields.type);
    Scorm.set(p + 'time', fields.time || Scorm.clock());
    if (fields.weighting != null) Scorm.set(p + 'weighting', fields.weighting);
    if (fields.pattern != null) Scorm.set(p + 'correct_responses.0.pattern', fields.pattern);
    Scorm.set(p + 'student_response', String(fields.response).slice(0, 255));
    Scorm.set(p + 'result', fields.result);
    if (fields.latency != null) Scorm.set(p + 'latency', Scorm.timespan(fields.latency / 1000));
  }

  function reportCaseInteractions(res) {
    var cs = CASES[res.caseId];
    res.steps.forEach(function (st) {
      var node = cs.nodes[st.node];
      if (st.kind === 'ask' || st.kind === 'task') {
        var resp = st.kind === 'ask' ? 'ASKED:' + st.asked.join(',') + (st.missed.length ? ';MISSED:' + st.missed.join(',') : '') :
          Object.keys(st.fields).filter(function (k) { return st.fields[k] !== null; }).map(function (k) {
            return k + '=' + String(st.values[k]).replace(/[;=]/g, ' ').slice(0, 30) + (st.fields[k] ? '' : '(x)');
          }).join(';');
        interaction({
          id: res.caseId + '_' + st.node, type: 'fill-in', response: resp,
          result: st.verdict === 'best' ? 'correct' : (st.verdict === 'critical' || st.verdict === 'poor') ? 'wrong' : 'neutral',
          latency: st.latency, time: st.at ? Scorm.clock(new Date(st.at)) : null
        });
        return;
      }
      var best = Engine.bestOption(node);
      interaction({
        id: res.caseId + '_' + st.node,
        type: 'choice',
        response: String.fromCharCode(97 + st.option),
        pattern: best ? String.fromCharCode(97 + node.options.indexOf(best)) : null,
        result: st.verdict === 'best' ? 'correct' : (st.verdict === 'critical' || st.verdict === 'poor') ? 'wrong' : 'neutral',
        latency: st.latency,
        time: st.at ? Scorm.clock(new Date(st.at)) : null,
        weighting: best ? Engine.optionTotal(best) : 0
      });
    });
    var mx = Engine.caseMax(cs);
    var crit = res.criticals.map(function (c) { return c.skill.charAt(0).toUpperCase(); }).join('');
    interaction({
      id: res.caseId + '_SUMMARY',
      type: 'fill-in',
      response: 'K' + res.earned.knowledge + '/' + mx.knowledge + ';S' + res.earned.service + '/' + mx.service +
        ';SA' + res.earned.sales + '/' + mx.sales + ';CRIT' + res.criticals.length + (crit ? '(' + crit + ')' : '') +
        ';OPP' + res.captured.length + '/' + cs.opportunities.length + ';OUT' + res.outcome + ';REF' + (res.ref.opens + res.ref.views) +
        ';T' + res.seconds + 's',
      result: 'neutral',
      latency: res.seconds * 1000
    });
  }

  function reportFinal(agg, levelsPassed, levelsAttempted) {
    Scorm.set('cmi.core.score.min', '0');
    Scorm.set('cmi.core.score.max', '100');
    Scorm.set('cmi.core.score.raw', String(agg.overall));
    var idx = 0;
    SKILLS.forEach(function (s) {
      var p = 'cmi.objectives.' + idx++ + '.';
      Scorm.set(p + 'id', s);
      Scorm.set(p + 'score.min', '0');
      Scorm.set(p + 'score.max', '100');
      if (agg.skills[s].pct != null) Scorm.set(p + 'score.raw', String(agg.skills[s].pct));
      Scorm.set(p + 'status', 'completed');
    });
    var lp = 'cmi.objectives.' + idx + '.';
    Scorm.set(lp + 'id', 'levels');
    Scorm.set(lp + 'score.min', '0');
    Scorm.set(lp + 'score.max', '100');
    Scorm.set(lp + 'score.raw', String(Math.round(levelsPassed / LEVELS.length * 100)));
    Scorm.set(lp + 'status', 'completed');
    var cp = 'cmi.objectives.' + (idx + 1) + '.';
    Scorm.set(cp + 'id', 'critical_errors');
    Scorm.set(cp + 'score.min', '0');
    Scorm.set(cp + 'score.max', '100');
    Scorm.set(cp + 'score.raw', String(Math.min(100, agg.criticals)));
    Scorm.set(cp + 'status', agg.criticals ? 'failed' : 'passed');
    interaction({
      id: 'SESSION_SUMMARY',
      type: 'fill-in',
      response: SKILLS.map(function (s) {
        var a = agg.skills[s];
        return { knowledge: 'K', service: 'S', sales: 'SA' }[s] + (a.pct == null ? 'na' : a.pct) + '(' + a.earned + '/' + a.max + ',n' + a.decisions + ')';
      }).join(';') + ';CRIT' + agg.criticals + ';LVL' + levelsPassed + '/' + LEVELS.length + ';TRIED' + levelsAttempted +
        ';CASES' + run.caseResults.length + ';T' + run.caseResults.reduce(function (t, r) { return t + (r.seconds || 0); }, 0) + 's',
      result: 'neutral'
    });
    var status = 'completed';
    if (cfg.scorm.statusMode === 'passed_failed') status = levelsPassed === LEVELS.length ? 'passed' : 'failed';
    Scorm.set('cmi.core.lesson_status', status);
    Scorm.commit();
  }

  /* ---------------- run (in memory) ---------------- */
  var run = null;      // current evaluation or practice run
  var current = null;  // current CaseRun
  var preview = null;  // builder preview target

  function newRun(mode, levelIndex) {
    return {
      mode: mode, levelIndex: levelIndex, steps: [], stepIndex: 0,
      caseResults: [], quizResults: [], levelResults: [], lvl: 0
    };
  }

  function levelSteps(li) {
    return Engine.buildLevelSteps(content, LEVELS[li]);
  }

  /* ---------------- screens ---------------- */
  function topbar(extra) {
    var t = cfg.theme;
    var opts = typeof extra === 'object' && extra ? extra : { html: extra };
    var mode = run ? (run.mode === 'eval' ? '<span class="pill pill-eval">' + ICONS.check + 'შეფასება · ითვლება</span>' : '<span class="pill pill-practice">პრაქტიკა · არ ითვლება</span>') : '';
    var lvName = run && LEVELS[run.levelIndex] ? 'დონე ' + LEVELS[run.levelIndex].id + ' · ' + LEVELS[run.levelIndex].name : '';
    var lvl = lvName && !opts.noLevel ? '<span class="pill" title="' + esc(lvName) + '">' + esc(lvName) + '</span>' : '';
    extra = opts.html;
    return '<header class="topbar">' +
      '<div class="brand"><span class="logo">' + esc(t.logoText) + '</span><span class="brand-text"><b>' + esc(t.bankName) + '</b><small>' + esc(t.productName) + '</small></span></div>' +
      '<div class="topbar-mid">' + mode + lvl + (extra || '') + '</div>' +
      '<div class="user">' + (studentName ? esc(studentName) : '') + '</div>' +
      (fullscreenSupported() ? '<button class="icon-btn fs-btn" data-act="fullscreen" aria-label="სრული ეკრანი" title="სრული ეკრანი">' + (isFullscreen() ? ICONS.fsExit : ICONS.fs) + '</button>' : '') +
      '</header>' +
      (Scorm.isStandalone() ? '<div class="standalone-bar">სატესტო რეჟიმი: LMS არ არის დაკავშირებული, პროგრესი ინახება ამ ბრაუზერში. <button class="link" data-act="reset-local">თავიდან დაწყება</button></div>' : '');
  }

  var screenGen = 0;          // bumps on every screen change; stale timers check it
  var inputLockedUntil = 0;   // ignore answer/next clicks right after a screen changes (double-click guard)

  function lockInput() { inputLockedUntil = Date.now() + (window.SIM_FAST ? 0 : 350); }

  function render(html) {
    stopCallTimer();
    screenGen++;
    lockInput();
    app.innerHTML = html;
    app.scrollTop = 0;
    window.scrollTo(0, 0);
    var h = app.querySelector('h1');
    if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } }
  }

  function showWelcome() {
    run = null;
    var e = state.e;
    var t = cfg.theme;
    var body;
    var rules = '<ul class="rules">' +
      '<li>სიმულაცია შედგება <b>' + LEVELS.length + ' დონისგან</b>. თითოეულ დონეზე შემთხვევითად შეირჩევა კლიენტები' + (cfg.features.quiz ? ' და ცოდნის შემოწმების კითხვები' : '') + '.</li>' +
      '<li>ყოველ ნაბიჯზე აირჩიეთ პასუხი, რომელსაც კლიენტს ეტყოდით. შეფასდება სამი უნარი: <b>პროდუქტის ცოდნა, მომსახურება და გაყიდვები</b>.</li>' +
      '<li>შემდეგ დონეზე გადასასვლელად საჭიროა დონის გასვლის ზღვრის მიღწევა.</li>' +
      '<li>გამოიყენეთ კლიენტის პროფილი (CRM)' + (cfg.features.referencePanel ? ' და საცნობარო პანელი' : '') + ' — ისინი მინიშნებებს შეიცავს' + (cfg.features.referencePanel ? ' (საცნობაროს გამოყენება ფიქსირდება, ქულას არ ამცირებს)' : '') + '.</li>' +
      '<li>დრო შეზღუდული არ არის. პასუხის ხანგრძლივობა ფიქსირდება, მაგრამ ქულაზე გავლენას არ ახდენს.</li>' +
      '<li>უკუკავშირს და დეტალურ შედეგებს სესიის ბოლოს ნახავთ. შეფასების დროს გაცემული პასუხის შეცვლა შეუძლებელია.</li>' +
      '<li><b>შეფასებისთვის მხოლოდ პირველი მცდელობა ითვლება.</b> შემდეგ შეგიძლიათ შეუზღუდავად ივარჯიშოთ.</li>' +
      '</ul>';
    if (e.s !== 'd' && noCredit()) {
      body = '<p class="lead">კურსი გახსნილია ნახვის რეჟიმში — შეფასება ამ რეჟიმში არ ითვლება.</p>' +
        '<p class="muted">შეფასების გასავლელად კურსი LMS-დან ჩვეულებრივ რეჟიმში გახსენით. აქ შეგიძლიათ მხოლოდ ივარჯიშოთ.</p>' +
        '<div class="actions"><button class="btn btn-primary btn-lg" data-act="practice-menu">პრაქტიკა</button></div>';
    } else if (e.s === 'n') {
      body = '<p class="lead">მოგესალმებით' + (studentName ? ', ' + esc(firstName(studentName)) : '') + '! თქვენ მომსახურების ოპერატორის როლში ხართ.</p>' + rules +
        '<div class="actions"><button class="btn btn-primary btn-lg" data-act="start-eval">შეფასების დაწყება</button></div>';
    } else if (e.s === 'a') {
      var lv = LEVELS[e.li];
      body = '<p class="lead">შეფასება დაწყებულია. გააგრძელეთ იქიდან, სადაც შეჩერდით.</p>' +
        '<p class="muted">დონე ' + (lv ? lv.id + ' · ' + esc(lv.name) : '') + ', ნაბიჯი ' + Math.min(e.i + 1, e.st.length) + ' / ' + e.st.length + '. უკვე გაცემული პასუხები შენახულია და შეცვლა შეუძლებელია.</p>' + rules +
        '<div class="actions"><button class="btn btn-primary btn-lg" data-act="resume-eval">გაგრძელება</button></div>';
    } else {
      body = '<p class="lead">შეფასება დასრულებულია. შედეგი უკვე გაგზავნილია.</p>' + summaryTiles(e.res) +
        '<div class="actions">' +
        (e.res && !e.res.lost ? '<button class="btn" data-act="eval-report">დეტალური შედეგები</button>' : '') +
        '<button class="btn btn-primary btn-lg" data-act="practice-menu">პრაქტიკა</button></div>';
    }
    render(topbar() + '<main class="screen center"><section class="card welcome"><h1>' + esc(t.productName) + '</h1>' + body +
      '<p class="credits">კლიენტების ილუსტრაციები: Micah Lanier, „Avatar Illustration System“ (CC BY 4.0), DiceBear-ის მეშვეობით.</p></section></main>');
  }

  function firstName(n) {
    // SCORM 1.2 student_name is usually "Last, First"
    var parts = String(n).split(',');
    return (parts.length > 1 ? parts[1] : parts[0]).trim();
  }

  function summaryTiles(res) {
    if (!res) return '';
    if (res.lost) return res.o != null ? '<div class="tiles"><div class="tile"><span>საერთო ქულა</span><b>' + res.o + '%</b></div></div>' : '';
    return '<div class="tiles">' +
      '<div class="tile tile-main"><span>საერთო ქულა</span><b>' + res.o + '%</b></div>' +
      SKILLS.map(function (s) { var v = res[s.charAt(0) + (s === 'sales' ? 'a' : '')]; return '<div class="tile"><span>' + T.skills[s] + '</span><b>' + (v == null ? '—' : v + '%') + '</b></div>'; }).join('') +
      '</div><p class="muted">გავლილი დონეები: ' + res.lp + ' / ' + LEVELS.length + '</p>';
  }

  function showPracticeMenu() {
    run = null;
    var u = Math.min(state.p.u, LEVELS.length - 1);
    var cards = LEVELS.map(function (l, i) {
      var locked = i > u;
      return '<button class="level-card' + (locked ? ' locked' : '') + '" ' + (locked ? 'disabled' : 'data-act="start-practice" data-level="' + i + '"') + '>' +
        '<span class="level-num">' + (locked ? ICONS.lock : l.id) + '</span>' +
        '<span class="level-info"><b>' + esc(l.name) + '</b><small>' + esc(l.description || '') + '</small><small class="muted">' + l.casesPerRun + ' კლიენტი · ზღვარი ' + l.passThreshold + '%</small></span></button>';
    }).join('');
    render(topbar() + '<main class="screen center"><section class="card wide"><h1>პრაქტიკა</h1>' +
      '<p class="muted">პრაქტიკის შედეგები შეფასებაზე გავლენას არ ახდენს. დონე იხსნება წინა დონის გავლის შემდეგ.</p>' +
      '<div class="level-grid">' + cards + '</div>' +
      '<div class="actions"><button class="btn" data-act="home">მთავარი</button></div></section></main>');
  }

  function showLevelIntro() {
    var l = LEVELS[run.levelIndex];
    var nCases = run.steps.filter(function (s) { return s.charAt(0) === 'c'; }).length;
    var nQuiz = run.steps.length - nCases;
    render(topbar() + '<main class="screen center"><section class="card level-intro">' +
      '<div class="level-badge">' + l.id + '</div><h1>დონე ' + l.id + ': ' + esc(l.name) + '</h1>' +
      '<p class="lead">' + esc(l.description || '') + '</p>' +
      '<div class="tiles"><div class="tile"><span>კლიენტები</span><b>' + nCases + '</b></div>' +
      (nQuiz ? '<div class="tile"><span>ცოდნის კითხვები</span><b>' + nQuiz + '</b></div>' : '') +
      '<div class="tile"><span>გასვლის ზღვარი</span><b>' + l.passThreshold + '%</b></div></div>' +
      (run.mode === 'eval' ? '<p class="notice-eval">ეს შეფასებაა: პასუხები ითვლება და მათი შეცვლა შეუძლებელია.' +
        (cfg.scoring.criticalFailsLevel ? ' კრიტიკული შეცდომა (მაგ., წესების დარღვევა) დონის ჩაჭრას ნიშნავს.' : '') + '</p>' : '') +
      '<div class="actions"><button class="btn btn-primary btn-lg" data-act="next-step">დაწყება</button></div></section></main>');
  }

  /* ---------------- step flow ---------------- */
  function nextStep() {
    if (run.stepIndex >= run.steps.length) { finishLevel(); return; }
    var step = run.steps[run.stepIndex];
    var id = step.slice(2);
    if (step.charAt(0) === 'c' && CASES[id]) playCase(CASES[id]);
    else if (step.charAt(0) === 'q' && QUIZ[id]) playQuiz(QUIZ[id]);
    else { run.stepIndex++; nextStep(); } // content changed: skip missing item
  }

  function advance() {
    run.stepIndex++;
    if (run.mode === 'eval') {
      state.e.i = Math.max(state.e.i, run.stepIndex);
      if (LEVELS[run.levelIndex]) Scorm.set('cmi.core.lesson_location', 'L' + LEVELS[run.levelIndex].id + '-S' + run.stepIndex, true);
      saveState();
      saveDetail(run);
    }
    nextStep();
  }

  /* ---------------- case play: scene + speech box + bank system monitor ---------------- */
  var callTimer = null;
  function stopCallTimer() { if (callTimer) { clearInterval(callTimer); callTimer = null; } }

  var transcript = [];      // full conversation of the current case (history drawer)
  var monTab = 'crm';       // active monitor tab
  var awaitingChoice = false;

  var STAGE_LABELS = {
    greeting: 'მისალმება', identification: 'იდენტიფიკაცია', verification: 'გადამოწმება', needs: 'საჭიროებები',
    solution: 'გადაწყვეტა', offer: 'შეთავაზება', closing: 'დასრულება'
  };
  var CRM_LABELS = {
    fullName: 'სახელი, გვარი', personalNumber: 'პირადი ნომერი', birthDate: 'დაბადების თარიღი', phone: 'მობილური', email: 'ელ. ფოსტა',
    address: 'მისამართი', employer: 'დამსაქმებელი', position: 'თანამდებობა', income: 'ყოველთვიური შემოსავალი', incomeSource: 'შემოსავლის წყარო',
    segment: 'სეგმენტი', clientSince: 'კლიენტია', idDocument: 'დოკუმენტი სისტემაში', idExpiry: 'დოკუმენტის ვადა', lastUpdate: 'ბოლო განახლება',
    codeWord: 'კოდური სიტყვა', maritalStatus: 'ოჯახური მდგომარეობა', dependants: 'სარჩენი პირები'
  };

  function caseStages(cs) {
    var used = {};
    Object.keys(cs.nodes).forEach(function (k) { if (cs.nodes[k].stage) used[cs.nodes[k].stage] = true; });
    return Engine.STAGES.filter(function (s) { return used[s]; });
  }

  function stageTrack() {
    var stages = caseStages(current.cs);
    if (stages.length < 2) return '';
    var node = current.node();
    var cur = node && node.stage ? stages.indexOf(node.stage) : -1;
    if (cur < 0) cur = current._lastStage || 0;
    current._lastStage = cur;
    return '<ol class="stage-track" aria-label="მომსახურების ეტაპები">' + stages.map(function (s, i) {
      return '<li class="' + (i < cur ? 'done' : i === cur ? 'now' : '') + '"' + (i === cur ? ' aria-current="step"' : '') + ' title="' + STAGE_LABELS[s] + '"><span>' + (i + 1) + '</span>' +
        (i === cur ? STAGE_LABELS[s] : '<i class="sr-only">' + STAGE_LABELS[s] + '</i>') + '</li>';
    }).join('') + '</ol>';
  }

  function sceneBackdrop(ch) {
    var t = cfg.theme;
    if (ch === 'phone') {
      return '<svg class="backdrop" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        '<defs><linearGradient id="phg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + t.primaryDark + '"/><stop offset="1" stop-color="#1d3a5c"/></linearGradient></defs>' +
        '<rect width="600" height="260" fill="url(#phg)"/>' +
        [40, 80, 120, 160].map(function (r, i) { return '<circle cx="300" cy="120" r="' + (70 + r) + '" fill="none" stroke="rgba(255,255,255,' + (0.09 - i * 0.02) + ')" stroke-width="2"/>'; }).join('') +
        '<g fill="rgba(255,255,255,.18)">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { var h = [12, 26, 40, 22, 54, 30, 18, 46, 24, 36, 16, 28][i]; return '<rect x="' + (210 + i * 15) + '" y="' + (232 - h / 2) + '" width="8" height="' + h + '" rx="4"/>'; }).join('') + '</g>' +
        '</svg>';
    }
    if (ch === 'chat') {
      return '<svg class="backdrop" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        '<rect width="600" height="260" fill="#E9EEF4"/>' +
        '<g fill="#fff" stroke="#D5DEE8"><rect x="40" y="40" width="170" height="44" rx="14"/><rect x="390" y="70" width="170" height="44" rx="14"/><rect x="60" y="150" width="140" height="44" rx="14"/><rect x="410" y="170" width="140" height="44" rx="14"/></g>' +
        '<g fill="#C9D4E0"><rect x="56" y="56" width="110" height="8" rx="4"/><rect x="406" y="86" width="120" height="8" rx="4"/><rect x="76" y="166" width="90" height="8" rx="4"/><rect x="426" y="186" width="96" height="8" rx="4"/></g>' +
        '</svg>';
    }
    return '<svg class="backdrop" viewBox="0 0 600 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE0F5"/><stop offset="1" stop-color="#E6F3FB"/></linearGradient>' +
      '<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F1EC"/><stop offset="1" stop-color="#E9E4DC"/></linearGradient></defs>' +
      '<rect width="600" height="260" fill="url(#wall)"/>' +
      '<rect x="24" y="26" width="150" height="150" rx="6" fill="url(#sky)" stroke="#CFC6B8" stroke-width="5"/>' +
      '<path d="M29 176 V120 h18 v-18 h16 v30 h14 v-44 h22 v38 h14 v-22 h18 v40 h18 v-26 h16 v58 Z" fill="#A9C3D6"/>' +
      '<line x1="99" y1="26" x2="99" y2="176" stroke="#CFC6B8" stroke-width="4"/>' +
      '<rect x="230" y="30" width="140" height="40" rx="8" fill="' + t.primaryDark + '"/>' +
      '<text x="300" y="56" text-anchor="middle" font-family="Noto Sans Georgian, sans-serif" font-size="16" font-weight="700" fill="#fff">' + esc(t.logoText) + '</text>' +
      '<rect x="452" y="34" width="110" height="58" rx="6" fill="#1F2933"/>' +
      '<text x="507" y="58" text-anchor="middle" font-family="monospace" font-size="12" fill="#7DD3FC">ტალონი</text>' +
      '<text x="507" y="81" text-anchor="middle" font-family="monospace" font-size="20" font-weight="700" fill="#FDE68A">A-' + (100 + (current.cs.id.length * 37) % 900) + '</text>' +
      '<path d="M540 196 q-14 -40 4 -70 q10 30 -4 70 Z M556 196 q6 -46 30 -60 q-6 36 -30 60 Z M528 196 q-20 -26 -30 -46 q22 10 30 46 Z" fill="#6A9C78"/>' +
      '<rect x="520" y="192" width="44" height="40" rx="6" fill="#B5835A"/>' +
      '<rect y="216" width="600" height="44" fill="#D8CFC2"/>' +
      '</svg>';
  }

  function playCase(cs) {
    current = new Engine.CaseRun(content, cs);
    transcript = [];
    monTab = cs.crm ? 'crm' : 'crm';
    var ch = current.channel;
    var nCases = run.steps.filter(function (s) { return s.charAt(0) === 'c'; });
    var pos = nCases.indexOf('c:' + cs.id) + 1;
    var progress = '<span class="pill">კლიენტი ' + pos + ' / ' + nCases.length + '</span>';
    var label = { branch: 'ფილიალის ვიზიტორი', phone: 'შემომავალი ზარი', chat: 'ონლაინ ჩატი' }[ch];
    var callStatus = ch === 'phone' ? '<span class="call-status" id="call-status"><span class="dot"></span>ზარი მიმდინარეობს' + (run.mode === 'eval' ? '' : ' · <span id="call-timer">0:00</span>') + '</span>' :
      ch === 'chat' ? '<span class="call-status" id="call-status"><span class="dot"></span>ონლაინ</span>' : '';
    render(topbar(progress) +
      '<div class="pane-switch" role="tablist" aria-label="ხედი">' +
      '<button role="tab" data-act="pane" data-pane="talk" aria-selected="true" class="active">საუბარი</button>' +
      '<button role="tab" data-act="pane" data-pane="system" aria-selected="false">ბანკის სისტემა</button></div>' +
      '<main class="desk desk-' + ch + '" data-pane="talk">' +
      '<h1 class="sr-only" tabindex="-1">კლიენტი ' + pos + ' / ' + nCases.length + ' — ' + T.channels[ch] + ': ' + esc(cs.brief || '') + '</h1>' +
      '<section class="scene" aria-label="კლიენტთან საუბარი">' +
      '<div id="stage-wrap">' + stageTrack() + '</div>' +
      (Avatar.portraitFor && Avatar.portraitFor(cs.customer, cs.id + cs.customer.name)
        ? '<div class="scene-view scene-photo scene-' + ch + '"><div class="scene-customer" id="cust-avatar">' + Avatar.render(cs.customer, current.mood, cs.id + cs.customer.name) + '</div>' +
          '<div class="photo-shade" aria-hidden="true"></div>'
        : '<div class="scene-view scene-' + ch + '">' + sceneBackdrop(ch) +
          '<div class="scene-customer" id="cust-avatar">' + Avatar.render(cs.customer, current.mood, cs.id + cs.customer.name) + '</div>' +
          (ch === 'branch' ? '<div class="counter" aria-hidden="true"></div>' : '')) +
      '<div class="scene-tag"><span class="ch-icon">' + ICONS[ch] + '</span><span><small>' + label + '</small><b>' + esc(cs.customer.name || T.customer) + '</b>' + callStatus +
      (cs.brief ? '<em class="scene-brief">' + esc(cs.brief) + '</em>' : '') + '</span></div>' +
      '</div>' +
      '<div class="speech" id="speech" role="log" aria-live="polite" aria-label="საუბარი" tabindex="0"></div>' +
      '<div class="reply" id="choices" role="group" aria-labelledby="choices-label" tabindex="-1"></div>' +
      '</section>' +
      '<section class="monitor" aria-label="ბანკის სისტემა">' +
      '<div class="mon-bar"><span class="mon-dots"><i></i><i></i><i></i></span><span class="mon-title">' + esc(cfg.theme.bankName) + ' · ოპერატორის სამუშაო სივრცე</span>' +
      '<span class="mon-date">' + esc(fmtDate(cs.date)) + '</span></div>' +
      '<nav class="mon-tabs" id="mon-tabs" role="tablist"></nav>' +
      '<div class="mon-body" id="mon-body" role="tabpanel"></div>' +
      '</section>' +
      '</main>');
    if (ch === 'phone' && run.mode !== 'eval') startCallTimer();
    renderMonitor();
    var saved = run.mode === 'eval' && state.e.cur && state.e.cur[0] === cs.id ? state.e.cur[1] : null;
    if (saved && (typeof saved === 'string' ? saved.length : saved.length)) resumeConversation(saved);
    else showNode(current.node());
  }

  function fmtDate(d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d || ''));
    if (m) return m[3] + '.' + m[2] + '.' + m[1];
    var now = new Date();
    return ('0' + now.getDate()).slice(-2) + '.' + ('0' + (now.getMonth() + 1)).slice(-2) + '.' + now.getFullYear();
  }

  function startCallTimer() {
    var started = Date.now();
    callTimer = setInterval(function () {
      var el = document.getElementById('call-timer');
      if (el) el.textContent = fmtTime((Date.now() - started) / 1000);
    }, 1000);
  }

  /* ----- speech box: only the latest exchange, full history in a drawer ----- */
  function say(who, text) {
    if (!text) return;
    transcript.push({ who: who, text: text });
    renderSpeech();
  }

  function renderSpeech(typingNow) {
    var box = document.getElementById('speech');
    if (!box) return;
    var name = esc(current.cs.customer.name || T.customer);
    var html = transcript.map(function (m) {
      if (m.who === 'system') return '<div class="sp sp-system"><span>' + T.system + ':</span> ' + esc(m.text) + '</div>';
      if (m.who === 'employee') return '<div class="sp sp-employee"><small>' + T.you + '</small>' + esc(m.text) + '</div>';
      return '<div class="sp sp-customer"><small>' + name + '</small>' + esc(m.text) + '</div>';
    }).join('');
    if (typingNow) html += '<div class="sp sp-customer sp-typing" aria-label="კლიენტი წერს"><span></span><span></span><span></span></div>';
    box.innerHTML = html;
    box.scrollTop = box.scrollHeight; // the box scrolls, never the page
  }

  function renderHistory() {
    var body = document.getElementById('history-body');
    if (!body) return;
    var name = esc(current.cs.customer.name || T.customer);
    body.innerHTML = transcript.map(function (m) {
      if (m.who === 'system') return '<div class="sp sp-system"><span>' + T.system + ':</span> ' + esc(m.text) + '</div>';
      return '<div class="sp sp-' + m.who + '"><small>' + (m.who === 'employee' ? T.you : name) + '</small>' + esc(m.text) + '</div>';
    }).join('');
  }

  function updateAvatar() {
    var el = document.getElementById('cust-avatar');
    if (el) el.innerHTML = Avatar.render(current.cs.customer, current.mood, current.cs.id + current.cs.customer.name);
    var sw = document.getElementById('stage-wrap');
    if (sw) sw.innerHTML = stageTrack();
  }

  function typing(cb, text) {
    renderSpeech(true);
    var delay = window.SIM_FAST ? 0 : Math.min(1300, 450 + String(text || '').length * 6);
    var gen = screenGen;
    var caseRun = current;
    setTimeout(function () {
      if (gen !== screenGen || caseRun !== current) return; // screen changed meanwhile
      cb();
    }, delay);
  }

  /* ----- monitor ----- */
  function monitorTabs() {
    var node = current.node();
    var cs = current.cs;
    var tabs = [];
    if (node && node.type === 'task') tabs.push(['task', 'ამოცანა']);
    tabs.push(['crm', 'კლიენტი']);
    if (caseDocuments(cs).length) tabs.push(['doc', 'დოკუმენტები']);
    if (cs.bureau) tabs.push(['bureau', 'ბიურო']);
    if (cfg.features.referencePanel) tabs.push(['products', 'პროდუქტები']);
    tabs.push(['calc', 'კალკულატორი']);
    return tabs;
  }

  function renderMonitor() {
    var nav = document.getElementById('mon-tabs');
    var body = document.getElementById('mon-body');
    if (!nav || !body || !current) return;
    var tabs = monitorTabs();
    if (!tabs.some(function (t) { return t[0] === monTab; })) monTab = 'crm';
    nav.innerHTML = tabs.map(function (t) {
      var locked = (t[0] === 'doc' && !caseDocuments(current.cs).some(function (d) { return current.unlocked[d.key || 'id']; })) || (t[0] === 'bureau' && !current.unlocked.bureau);
      return '<button role="tab" data-act="mon-tab" data-tab="' + t[0] + '" aria-selected="' + (monTab === t[0]) + '" class="' + (monTab === t[0] ? 'active' : '') +
        (t[0] === 'task' ? ' tab-task' : '') + (locked ? ' locked' : '') + '">' + (locked ? ICONS.lock : '') + t[1] + '</button>';
    }).join('');
    var html;
    if (monTab === 'doc') html = docView();
    else if (monTab === 'bureau') html = bureauView();
    else if (monTab === 'products') html = '<div class="ref-in-mon"><input type="search" id="ref-search" placeholder="ძიება: პროდუქტი, პირობა…" aria-label="ძიება პროდუქტებში" autocomplete="off">' +
      '<div class="ref-list" id="ref-list">' + refList('') + '</div><div class="ref-detail hidden" id="ref-detail"></div></div>';
    else if (monTab === 'calc') html = calcView();
    else if (monTab === 'task') html = taskView(current.node());
    else html = crmView();
    body.innerHTML = html;
    if (monTab === 'task') updateComputed();
  }

  function kv(label, val) {
    if (val == null || val === '' || (Array.isArray(val) && !val.length)) val = '<span class="empty">— არ არის შევსებული</span>';
    else if (Array.isArray(val)) val = '<ul>' + val.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>';
    else val = esc(val);
    return '<div class="kv"><span>' + label + '</span><div>' + val + '</div></div>';
  }

  function crmView() {
    var c = current.cs.customer;
    var crm = current.cs.crm ? current.crm : null;
    var head = '<div class="mon-h"><b>' + esc(crm && crm.fullName || c.name || '') + '</b>' + (c.segment ? '<span class="tag">' + esc(c.segment) + '</span>' : '') + '</div>';
    var rows;
    if (crm) {
      rows = Object.keys(crm).map(function (k) { return kv(CRM_LABELS[k] || k, crm[k]); }).join('');
    } else {
      rows = kv('სახელი', c.name) + kv('ასაკი', c.age) + kv('საქმიანობა', c.occupation) + kv('შემოსავალი', c.income) + kv('ციფრული არხები', c.digital);
    }
    return head + '<div class="kv-grid">' + rows + '</div>' +
      '<h4>აქტიური პროდუქტები</h4>' + (c.productsHeld && c.productsHeld.length ? '<ul class="plist">' + c.productsHeld.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' : '<p class="muted">არ აქვს</p>') +
      '<h4>შენიშვნები</h4>' + (c.notes ? '<p class="note">' + esc(c.notes) + '</p>' : '<p class="muted">შენიშვნები არ არის</p>');
  }

  function caseDocuments(cs) {
    var c = cs.customer;
    if (Array.isArray(c.documents)) return c.documents;
    return c.document ? [Object.assign({ key: 'id' }, c.document)] : [];
  }

  function docView() {
    var docs = caseDocuments(current.cs).filter(function (d) { return current.unlocked[d.key || 'id']; });
    if (!docs.length) return '<div class="locked-view">' + ICONS.lock + '<p>კლიენტს დოკუმენტი ჯერ არ წარმოუდგენია.</p></div>';
    var photo = Avatar.render(current.cs.customer, 0, current.cs.id + current.cs.customer.name);
    return '<div class="doc-stack">' + docs.map(function (d) {
      var isPass = /პასპორტ/.test(d.type || '');
      return '<div class="id-card' + (isPass ? ' passport' : '') + '" aria-label="' + esc(d.type || 'დოკუმენტი') + '">' +
        '<div class="id-top"><b>საქართველო · GEORGIA</b><span>' + esc(d.type || 'პირადობის მოწმობა') + '</span></div>' +
        '<div class="id-main"><div class="id-photo">' + photo + '</div><div class="id-fields">' +
        [['გვარი', d.surname], ['სახელი', d.name], ['დაბადების თარიღი', d.birthDate], ['სქესი', d.sex], ['პირადი ნომერი', d.personalNumber],
          ['მოქმედების ვადა', d.expiry], ['დოკუმენტის ნომერი', d.number], ['გაცემის თარიღი', d.issueDate]].filter(function (x) { return x[1]; })
          .map(function (x) { return '<div><small>' + x[0] + '</small><b>' + esc(x[1]) + '</b></div>'; }).join('') +
        '</div></div><div class="id-mrz">' + esc(((isPass ? 'P<GEO' : 'IDGEO') + (d.number || '') + '<<' + (d.personalNumber || '')).toUpperCase().replace(/[^A-Z0-9<]/g, '<').slice(0, 30)) + '<<<<<<</div></div>';
    }).join('') + '</div><p class="muted small">სისტემის თარიღი: ' + esc(fmtDate(current.cs.date)) + '</p>';
  }

  function bureauView() {
    if (!current.unlocked.bureau) return '<div class="locked-view">' + ICONS.lock + '<p>საკრედიტო ისტორიის მოთხოვნა შესაძლებელია მხოლოდ კლიენტის თანხმობის შემდეგ.</p></div>';
    var b = current.cs.bureau;
    return '<div class="mon-h"><b>საკრედიტო ბიუროს ანგარიში</b><span class="tag">' + esc(fmtDate(current.cs.date)) + '</span></div>' +
      '<div class="kv-grid">' + kv('საკრედიტო ქულა', b.score) + kv('რეიტინგი', b.rating) + kv('ვადაგადაცილება', b.overdue) + kv('ბოლო 6 თვის მოთხოვნები', b.inquiries) + '</div>' +
      '<h4>აქტიური ვალდებულებები</h4>' + (b.loans && b.loans.length ? '<table class="cond"><tr><th>გამსესხებელი</th><th>ტიპი</th><th>ნაშთი</th><th>თვიური შენატანი</th></tr>' +
        b.loans.map(function (l) { return '<tr><td>' + esc(l.lender) + '</td><td>' + esc(l.type) + '</td><td>' + esc(l.balance) + '</td><td>' + esc(l.monthly) + '</td></tr>'; }).join('') + '</table>' : '<p class="muted">არ აქვს</p>') +
      (b.note ? '<p class="note">' + esc(b.note) + '</p>' : '');
  }

  var calc = { display: '0', acc: null, op: null, fresh: true };
  function calcView() {
    var keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+'];
    return '<div class="calc"><output class="calc-display" id="calc-display">' + esc(calc.display) + '</output>' +
      '<div class="calc-keys">' + keys.map(function (k) { return '<button data-act="calc" data-k="' + k + '" class="' + (/[÷×−+=]/.test(k) ? 'op' : '') + '">' + k + '</button>'; }).join('') +
      '<button data-act="calc" data-k="C" class="wide">C</button></div></div>';
  }
  function calcPress(k) {
    var cur = parseFloat(calc.display);
    function apply(a, b, op) { return op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : op === '÷' ? (b ? a / b : NaN) : b; }
    if (k === 'C') { calc = { display: '0', acc: null, op: null, fresh: true }; }
    else if (/[0-9]/.test(k)) { calc.display = calc.fresh || calc.display === '0' ? k : calc.display + k; calc.fresh = false; }
    else if (k === '.') { if (calc.fresh) { calc.display = '0.'; calc.fresh = false; } else if (calc.display.indexOf('.') < 0) calc.display += '.'; }
    else {
      if (calc.op && !calc.fresh) cur = apply(calc.acc, cur, calc.op);
      if (k === '=') { calc.display = String(Math.round(cur * 10000) / 10000); calc.acc = null; calc.op = null; }
      else { calc.acc = cur; calc.op = k; calc.display = String(Math.round(cur * 10000) / 10000); }
      calc.fresh = true;
    }
    var el = document.getElementById('calc-display');
    if (el) el.textContent = calc.display;
  }

  function resolveValue(v) {
    if (typeof v !== 'string') return v;
    return v.replace(/\{crm\.([A-Za-z0-9_]+)\}/g, function (m, k) { return current.crm[k] != null ? current.crm[k] : ''; });
  }

  function taskView(node) {
    if (!node || node.type !== 'task') return '<p class="muted">აქტიური ამოცანა არ არის.</p>';
    var html = '<form class="task-form" id="task-form" novalidate><div class="mon-h"><b>' + esc(node.title || 'ამოცანა') + '</b></div>' +
      (node.instructions ? '<p class="task-instr">' + esc(node.instructions) + '</p>' : '');
    node.fields.forEach(function (f) {
      var id = 'tf-' + f.id;
      var val = resolveValue(f.value !== undefined ? f.value : '');
      var hint = f.hint ? '<small class="hint">' + esc(f.hint) + '</small>' : '';
      var input;
      if (f.type === 'select') {
        input = '<select id="' + id + '" name="' + esc(f.id) + '"><option value="">— აირჩიეთ —</option>' + (f.options || []).map(function (o) {
          return '<option' + (String(o) === String(val) ? ' selected' : '') + '>' + esc(o) + '</option>';
        }).join('') + '</select>';
      } else if (f.type === 'radio') {
        input = '<div class="radios" role="radiogroup" aria-labelledby="' + id + '-l">' + (f.options || []).map(function (o, k) {
          return '<label><input type="radio" name="' + esc(f.id) + '" value="' + esc(o) + '"' + (String(o) === String(val) ? ' checked' : '') + '> ' + esc(o) + '</label>';
        }).join('') + '</div>';
      } else if (f.type === 'checkbox') {
        return (html += '<label class="tf tf-check"><input type="checkbox" id="' + id + '" name="' + esc(f.id) + '"' + (val === true ? ' checked' : '') + '><span>' + esc(f.label) + '</span>' + hint + '</label>');
      } else if (f.type === 'computed') {
        input = '<output id="' + id + '" class="computed" data-field="' + esc(f.id) + '">—</output>';
      } else {
        input = '<input id="' + id + '" name="' + esc(f.id) + '" type="text"' + (f.type === 'number' ? ' inputmode="decimal"' : '') +
          (f.type === 'date' ? ' placeholder="დდ.თთ.წწწწ"' : f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') +
          ' value="' + esc(val) + '" autocomplete="off">';
      }
      html += '<div class="tf tf-' + f.type + '"><label id="' + id + '-l" for="' + id + '">' + esc(f.label) + (f.unit ? ' <span class="unit">(' + esc(f.unit) + ')</span>' : '') +
        (f.type === 'computed' ? ' <span class="unit">· ითვლის სისტემა</span>' : '') + '</label>' + input + hint + '</div>';
    });
    html += '<div class="task-actions"><button type="submit" class="btn btn-primary">' + esc(node.submitLabel || 'დადასტურება') + '</button></div></form>';
    return html;
  }

  function readTaskForm(node) {
    var form = document.getElementById('task-form');
    var vals = {};
    if (!form) return vals;
    node.fields.forEach(function (f) {
      if (f.type === 'computed') return;
      if (f.type === 'checkbox') { var cb = form.querySelector('[name="' + f.id + '"]'); vals[f.id] = !!(cb && cb.checked); return; }
      if (f.type === 'radio') { var r = form.querySelector('[name="' + f.id + '"]:checked'); vals[f.id] = r ? r.value : ''; return; }
      var el = form.querySelector('[name="' + f.id + '"]');
      vals[f.id] = el ? el.value : '';
    });
    return vals;
  }

  function updateComputed() {
    var node = current && current.node();
    if (!node || node.type !== 'task') return;
    var v = Engine.taskValues(node, readTaskForm(node));
    node.fields.forEach(function (f) {
      if (f.type !== 'computed') return;
      var out = document.getElementById('tf-' + f.id);
      if (out) out.textContent = v[f.id] === '' ? '—' : Number(v[f.id]).toLocaleString('ka-GE', { maximumFractionDigits: 2 }) + (f.unit ? ' ' + f.unit : '');
    });
  }


  function refList(q) {
    q = (q || '').toLowerCase();
    var groups = {};
    var order = [];
    content.products.forEach(function (p) {
      var hay = (p.name + ' ' + (p.short || '') + ' ' + (p.category || '') + ' ' + (p.conditions || []).map(function (c) { return c.label + ' ' + c.value; }).join(' ')).toLowerCase();
      if (q && hay.indexOf(q) < 0) return;
      var g = p.category || 'სხვა';
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(p);
    });
    if (!order.length) return '<p class="muted">ვერაფერი მოიძებნა</p>';
    return order.map(function (g) {
      return '<div class="ref-group"><small>' + esc(g) + '</small>' + groups[g].map(function (p) {
        return '<button class="ref-item" data-act="ref-view" data-id="' + esc(p.id) + '"><b>' + esc(p.name) + '</b><span>' + esc(p.short || '') + '</span></button>';
      }).join('') + '</div>';
    }).join('');
  }

  function refDetail(p) {
    return '<button class="link" data-act="ref-back">← უკან</button><h3>' + esc(p.name) + '</h3><p class="muted">' + esc(p.short || '') + '</p>' +
      '<table class="cond">' + (p.conditions || []).map(function (c) { return '<tr><th>' + esc(c.label) + '</th><td>' + esc(c.value) + '</td></tr>'; }).join('') + '</table>' +
      (p.table && p.table.columns ? '<h4>' + esc(p.table.title || 'ტარიფები') + '</h4><div class="table-wrap"><table class="rate-table"><tr>' + p.table.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>' +
        (p.table.rows || []).map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>' +
        (p.table.note ? '<p class="muted small">' + esc(p.table.note) + '</p>' : '') : '');
  }

  /* ----- node flow ----- */
  function showNode(node) {
    var choices = document.getElementById('choices');
    choices.innerHTML = '';
    if (node.system) say('system', node.system);
    var go = function () {
      updateAvatar();
      if (node.say) say('customer', node.say);
      else renderSpeech();
      if (node.end) return endCase(node);
      if (node.type === 'task') { monTab = 'task'; renderMonitor(); renderTaskPrompt(node); }
      else { renderMonitor(); if (node.type === 'ask') renderAsk(node); else renderOptions(node); }
      current.markShown();
    };
    if (node.say) typing(go, node.say); else go();
  }

  function renderOptions(node) {
    var choices = document.getElementById('choices');
    var isProduct = node.type === 'product';
    var html = '<div class="choices-label" id="choices-label">' + (isProduct ? 'აირჩიეთ შესათავაზებელი პროდუქტი' : 'აირჩიეთ თქვენი პასუხი') + '</div>';
    html += '<div class="opt-list' + (isProduct ? ' opt-products' : '') + '">';
    var order = node.options.map(function (_, i) { return i; });
    if (cfg.features.shuffleOptions !== false && !window.SIM_NO_SHUFFLE) order = Engine.shuffle(order);
    order.forEach(function (i, pos) {
      var o = node.options[i];
      var p = o.product && PRODUCTS[o.product];
      html += '<button class="opt" data-act="choose" data-i="' + i + '"><span class="opt-key">' + String.fromCharCode(65 + pos) + '</span><span class="opt-text">' +
        (isProduct && p ? '<b class="opt-product">' + esc(p.name) + '</b>' : '') + esc(o.text) + '</span></button>';
    });
    html += '</div>';
    choices.innerHTML = html;
    awaitingChoice = true;
    lockInput();
  }

  function renderAsk(node) {
    var choices = document.getElementById('choices');
    var left = node.maxQuestions - current.asked.length;
    var order = node._order || (node._order = cfg.features.shuffleOptions !== false && !window.SIM_NO_SHUFFLE ? Engine.shuffle(node.questions.map(function (_, i) { return i; })) : node.questions.map(function (_, i) { return i; }));
    var html = '<div class="choices-label" id="choices-label">' + esc(node.prompt || 'რა ჰკითხავთ კლიენტს?') +
      (node.maxQuestions < node.questions.length ? ' <span class="muted">(კიდევ ' + left + ' კითხვა)</span>' : '') + '</div><div class="q-list">';
    order.forEach(function (i) {
      var q = node.questions[i];
      var done = current.asked.indexOf(q.id) >= 0;
      html += '<button class="q-chip' + (done ? ' asked' : '') + '" data-act="ask-q" data-q="' + esc(q.id) + '"' + (done || left <= 0 ? ' disabled' : '') + '>' +
        (done ? ICONS.check : '') + esc(q.text) + '</button>';
    });
    html += '</div><div class="ask-actions"><button class="btn btn-primary" data-act="ask-done"' + (current.asked.length ? '' : ' disabled') + '>' + esc(node.doneLabel || 'საუბრის გაგრძელება') + '</button></div>';
    choices.innerHTML = html;
    awaitingChoice = true;
    lockInput();
  }

  /** narrow screens show one pane at a time: the conversation or the bank system */
  function setPane(p) {
    var d = app.querySelector('.desk');
    if (!d) return;
    d.setAttribute('data-pane', p);
    app.querySelectorAll('.pane-switch button').forEach(function (b) {
      var on = b.getAttribute('data-pane') === p;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function renderTaskPrompt(node) {
    var choices = document.getElementById('choices');
    choices.innerHTML = '<div class="task-prompt"><span class="tp-icon">' + ICONS.book + '</span><div><b>' + esc(node.title || 'ამოცანა') + '</b>' +
      '<span>შეასრულეთ ოპერაცია ბანკის სისტემაში და დააჭირეთ „' + esc(node.submitLabel || 'დადასტურება') + '“.</span></div>' +
      '<button class="btn btn-sm" data-act="mon-tab" data-tab="task" data-pane="system">გახსნა</button></div>';
    awaitingChoice = true;
  }

  function persistCurrent() {
    if (run.mode !== 'eval') return;
    state.e.cur = [current.cs.id, current.encodeSteps()];
    saveState();
  }

  function afterStep(r) {
    persistCurrent();
    if (r.walkout) {
      typing(function () {
        updateAvatar();
        say('system', T.walkout[current.channel]);
        endCase(null);
      }, '');
      return;
    }
    showNode(r.node);
  }

  function choose(i) {
    if (!awaitingChoice || !current) return;
    var node = current.node();
    if (node.type === 'ask' || node.type === 'task') return;
    var opt = node.options[i];
    if (!opt) return;
    awaitingChoice = false;
    var chEl = document.getElementById('choices');
    if (chEl) { chEl.focus({ preventScroll: true }); chEl.innerHTML = ''; }
    say('employee', opt.text);
    afterStep(current.choose(i));
  }

  function askQuestion(qid) {
    if (!awaitingChoice || !current) return;
    var node = current.node();
    var q = current.ask(qid);
    if (!q) return;
    say('employee', q.text);
    if (run.mode === 'eval') { state.e.cur = [current.cs.id, current.encodeSteps().concat([{ a: current.asked.slice(), open: 1 }])]; saveState(); }
    awaitingChoice = false;
    document.getElementById('choices').innerHTML = '';
    typing(function () {
      updateAvatar();
      say('customer', q.answer || '…');
      awaitingChoice = true;
      renderAsk(node);
    }, q.answer);
  }

  function finishAsk() {
    if (!awaitingChoice || !current || !current.asked.length) return;
    awaitingChoice = false;
    document.getElementById('choices').innerHTML = '';
    afterStep(current.finishAsk());
  }

  function submitTask() {
    if (!awaitingChoice || !current) return;
    var node = current.node();
    if (node.type !== 'task') return;
    var vals = readTaskForm(node);
    var missing = node.fields.filter(function (f) { return f.required && (vals[f.id] === '' || vals[f.id] == null); });
    if (missing.length) {
      var form = document.getElementById('task-form');
      var msg = form && form.querySelector('.form-error');
      if (!msg && form) { msg = document.createElement('p'); msg.className = 'form-error'; msg.setAttribute('role', 'alert'); form.appendChild(msg); }
      if (msg) msg.textContent = 'შეავსეთ სავალდებულო ველები: ' + missing.map(function (f) { return f.label; }).join(', ');
      return;
    }
    awaitingChoice = false;
    var r = current.submitTask(vals);
    setPane('talk');
    say('system', node.doneText || ((node.title || 'ოპერაცია') + ' — შესრულდა.'));
    monTab = node.saveTo === 'crm' ? 'crm' : 'crm';
    renderMonitor();
    afterStep(r);
  }

  /** Rebuild an interrupted conversation from the saved steps. */
  function resumeConversation(saved) {
    var list = typeof saved === 'string' ? saved.split('').map(Number) : saved;
    var openAsk = null;
    for (var k = 0; k < list.length; k++) {
      var enc = list[k];
      var node = current.node();
      if (!node || node.end) break;
      if (node.system) transcript.push({ who: 'system', text: node.system });
      if (node.say) transcript.push({ who: 'customer', text: node.say });
      if (enc && typeof enc === 'object' && enc.open) { openAsk = enc.a; break; }
      if (enc && typeof enc === 'object' && enc.a) {
        enc.a.forEach(function (qid) {
          var q = node.questions.filter(function (x) { return x.id === qid; })[0];
          if (q) { transcript.push({ who: 'employee', text: q.text }); transcript.push({ who: 'customer', text: q.answer || '' }); }
        });
      } else if (enc && typeof enc === 'object' && enc.t) {
        transcript.push({ who: 'system', text: node.doneText || ((node.title || 'ოპერაცია') + ' — შესრულდა.') });
      } else if (node.options && node.options[Number(enc)]) {
        transcript.push({ who: 'employee', text: node.options[Number(enc)].text });
      }
      var r = current.applyStep(enc);
      if (current.steps.length) current.steps[current.steps.length - 1].latency = null;
      if (r && r.walkout) { updateAvatar(); say('system', T.walkout[current.channel]); return endCase(null); }
      if (r && r.ended) { updateAvatar(); var en = current.node(); if (en && en.say) say('customer', en.say); return endCase(en); }
    }
    transcript.push({ who: 'system', text: 'საუბარი გაგრძელდა შეწყვეტის შემდეგ. წინა მოქმედებები შენახულია.' });
    updateAvatar();
    renderMonitor();
    if (openAsk) {
      var an = current.node();
      openAsk.forEach(function (qid) {
        var q = current.ask(qid);
        if (q) { transcript.push({ who: 'employee', text: q.text }); transcript.push({ who: 'customer', text: q.answer || '' }); }
      });
      renderSpeech();
      awaitingChoice = true;
      renderAsk(an);
      return;
    }
    var cur = current.node();
    // the current node's line is already in the transcript when it was saved mid-node; avoid a duplicate
    showNode(cur);
  }

  function endCase(node) {
    stopCallTimer();
    awaitingChoice = false;
    var res = current.result();
    res.lvl = run.lvl;
    run.caseResults.push(res);
    if (run.mode === 'eval') {
      state.e.r.push(compactCase(res, current));
      reportCaseInteractions(res);
      state.e.cur = null;
      state.e.i = run.stepIndex + 1; // this case can never be replayed
      saveState();
      saveDetail(run);
    }
    var cst = document.getElementById('call-status');
    if (cst) { cst.classList.add('ended'); cst.innerHTML = '<span class="dot"></span>' + (current.channel === 'phone' ? 'ზარი დასრულდა' : 'ჩატი დასრულდა'); }
    // neutral on purpose: no hint about how the conversation went until the session report
    document.getElementById('choices').innerHTML =
      '<div class="case-end"><span class="outcome outcome-neutral">საუბარი დასრულდა</span>' +
      '<button class="btn btn-primary" data-act="advance">' + (run.stepIndex + 1 < run.steps.length ? 'შემდეგი კლიენტი' : 'დონის დასრულება') + '</button></div>';
    lockInput();
    var btn = app.querySelector('[data-act="advance"]');
    if (btn) btn.focus();
  }

  /* ---------------- quiz ---------------- */
  var currentQuiz = null;

  function playQuiz(q) {
    currentQuiz = { q: q, shownAt: Date.now(), order: Engine.shuffle(q.options.map(function (_, i) { return i; })) };
    var nQ = run.steps.filter(function (s) { return s.charAt(0) === 'q'; });
    var pos = nQ.indexOf('q:' + q.id) + 1;
    render(topbar('<span class="pill">ცოდნის შემოწმება ' + pos + ' / ' + nQ.length + '</span>') +
      '<main class="screen center"><section class="card quiz"><small class="eyebrow">ცოდნის შემოწმება</small><h2>' + esc(q.question) + '</h2>' +
      '<div class="opt-list">' + currentQuiz.order.map(function (oi, k) {
        return '<button class="opt" data-act="quiz-answer" data-i="' + oi + '"><span class="opt-key">' + String.fromCharCode(65 + k) + '</span><span class="opt-text">' + esc(q.options[oi]) + '</span></button>';
      }).join('') + '</div></section></main>');
  }

  function answerQuiz(i) {
    if (!currentQuiz) return;
    var q = currentQuiz.q;
    var latency = Date.now() - currentQuiz.shownAt;
    var qr = { id: q.id, answer: i, correct: i === q.correct, points: q.points, lvl: run.lvl, latency: latency };
    run.quizResults.push(qr);
    if (run.mode === 'eval') {
      state.e.q.push([q.id, qr.correct ? 1 : 0, run.lvl]);
      state.e.i = run.stepIndex + 1;
      interaction({
        id: 'QUIZ_' + q.id, type: 'choice', response: String.fromCharCode(97 + i),
        pattern: String.fromCharCode(97 + q.correct), result: qr.correct ? 'correct' : 'wrong',
        latency: latency, weighting: q.points
      });
    }
    currentQuiz = null;
    advance();
  }

  /* ---------------- level & run end ---------------- */
  function levelAggregate(lvl) {
    return Engine.aggregate(content,
      run.caseResults.filter(function (r) { return r.lvl === lvl; }),
      run.quizResults.filter(function (q) { return q.lvl === lvl; }));
  }

  function finishLevel() {
    var l = LEVELS[run.levelIndex];
    var agg = levelAggregate(run.lvl);
    var verdict = Engine.levelPass(content, l, agg);
    var passed = verdict.passed;
    run.levelResults.push({ levelId: l.id, pct: agg.overall, passed: passed });
    if (passed) {
      state.p.u = Math.max(state.p.u, run.levelIndex + 1);
      if (run.mode === 'practice' && !preview) saveState();
    }
    var more = passed && run.levelIndex + 1 < LEVELS.length && !preview;
    if (run.mode === 'eval') {
      state.e.lv.push([l.id, agg.overall, passed ? 1 : 0]);
      if (more) {
        state.e.li = run.levelIndex + 1;
        state.e.st = levelSteps(state.e.li);
        state.e.i = 0;
        saveState();
      } else {
        finalizeEval(); // lock the result now, before the employee even opens the report
      }
    }
    var why = verdict.reasons.map(function (r) {
      if (r === 'threshold') return 'დონის ქულა ზღვარზე დაბალია';
      if (r === 'critical') return 'დაშვებულია კრიტიკული შეცდომა';
      return '„' + T.skills[r.slice(6)] + '“ მინიმალურ ზღვარზე (' + l.skillFloor + '%) დაბალია';
    });
    var verdictHtml = passed ? '<div class="level-result ok">' + ICONS.check + ' დონე გავლილია</div>' :
      '<div class="level-result bad">დონე ვერ გაიარეთ</div>' + (why.length ? '<p class="muted">მიზეზი: ' + why.join('; ') + '.</p>' : '');
    var next = more ? '<button class="btn btn-primary btn-lg" data-act="next-level">შემდეგი დონე</button>' :
      '<button class="btn btn-primary btn-lg" data-act="finish-run">შედეგების ნახვა</button>';
    render(topbar() + '<main class="screen center"><section class="card level-intro">' +
      '<div class="level-badge">' + l.id + '</div><h1>დონე ' + l.id + ': ' + esc(l.name) + '</h1>' + verdictHtml +
      (run.mode === 'eval' ? '' : '<div class="tiles"><div class="tile tile-main"><span>დონის ქულა</span><b>' + agg.overall + '%</b></div><div class="tile"><span>ზღვარი</span><b>' + l.passThreshold + '%</b></div></div>') +
      (more ? '<p class="muted">დეტალურ უკუკავშირს სესიის ბოლოს მიიღებთ.</p>' : '') +
      '<div class="actions">' + next + '</div></section></main>');
  }

  function nextLevel() {
    run.levelIndex++;
    run.lvl++;
    run.steps = run.mode === 'eval' ? state.e.st.slice() : levelSteps(run.levelIndex);
    run.stepIndex = 0;
    showLevelIntro();
  }

  function finalizeEval() {
    var agg = Engine.aggregate(content, run.caseResults, run.quizResults);
    var levelsPassed = run.levelResults.filter(function (l) { return l.passed; }).length;
    state.e.s = 'd';
    state.e.res = {
      o: agg.overall, k: agg.skills.knowledge.pct, s: agg.skills.service.pct, sa: agg.skills.sales.pct,
      lp: levelsPassed, c: agg.criticals
    };
    state.e.cur = null;
    reportFinal(agg, levelsPassed, run.levelResults.length);
    saveState();
    if (Scorm.ok) { state.e.sent = 1; saveState(); }
    saveDetail(run);
  }

  function finishRun() {
    var agg = Engine.aggregate(content, run.caseResults, run.quizResults);
    if (run.mode === 'practice' && !preview) {
      state.p.n++;
      saveState();
    }
    showReport(run, agg);
  }

  /* ---------------- report ---------------- */
  function bar(pct) {
    if (pct == null) return '<div class="bar na"><span style="width:0"></span></div>';
    var cls = pct >= 80 ? 'good' : pct >= 60 ? 'mid' : 'low';
    return '<div class="bar ' + cls + '"><span style="width:' + pct + '%"></span></div>';
  }

  function showReport(r, agg) {
    var title = r.mode === 'eval' ? 'შეფასების შედეგები' : (preview ? 'წინასწარი ნახვა: შედეგები' : 'პრაქტიკის შედეგები');
    var skillCards = SKILLS.map(function (s) {
      var a = agg.skills[s];
      return '<div class="skill-card"><div class="skill-head"><span>' + T.skills[s] + '</span><b>' + (a.pct == null ? '—' : a.pct + '%') + '</b></div>' + bar(a.pct) +
        '<small class="muted">' + (a.max ? a.earned + ' / ' + a.max + ' ქულა · ' + a.decisions + ' შეფასებული გადაწყვეტილება' : 'ამ სესიაში არ შეფასებულა') +
        (a.criticals ? ' · <span class="crit-text">' + a.criticals + ' კრიტიკული შეცდომა</span>' : '') + '</small></div>';
    }).join('');

    var levels = r.levelResults.map(function (l) {
      var lv = LEVELS.filter(function (x) { return x.id === l.levelId; })[0] || {};
      return '<li class="' + (l.passed ? 'ok' : 'bad') + '"><b>დონე ' + l.levelId + ' · ' + esc(lv.name || '') + '</b><span>' + l.pct + '% ' + (l.passed ? '— გავლილია' : '— ვერ გაიარეთ') + '</span></li>';
    }).join('');

    var criticals = [];
    var missed = [];
    r.caseResults.forEach(function (res) {
      var cs = CASES[res.caseId];
      if (!cs) return;
      res.criticals.forEach(function (c) { if (c.reason) criticals.push('<li><b>' + esc(cs.title) + ':</b> ' + esc(c.reason) + ' <span class="tag">' + T.skills[c.skill] + '</span></li>'); });
      if (!res.compact) {
        cs.opportunities.forEach(function (o) {
          if (res.captured.indexOf(o.id) < 0) {
            var p = PRODUCTS[o.product];
            missed.push('<li><b>' + esc(cs.title) + ':</b> ' + esc(p ? p.name : o.product) + ' — <span class="muted">' + esc(o.cue || '') + '</span></li>');
          }
        });
      }
    });

    var cases = r.caseResults.map(function (res) { return caseReport(res); }).join('');
    var quiz = r.quizResults.length ? '<h2>ცოდნის შემოწმება</h2><div class="quiz-review">' + r.quizResults.map(function (q) {
      var qq = QUIZ[q.id];
      if (!qq) return '';
      return '<div class="qr ' + (q.correct ? 'ok' : 'bad') + '"><b>' + esc(qq.question) + '</b>' +
        '<div>თქვენი პასუხი: ' + esc(qq.options[q.answer] != null ? qq.options[q.answer] : '—') + (q.correct ? ' ' + ICONS.check : '') + '</div>' +
        (q.correct ? '' : '<div>სწორი პასუხი: <b>' + esc(qq.options[qq.correct]) + '</b></div>') +
        (qq.explanation ? '<small class="muted">' + esc(qq.explanation) + '</small>' : '') + '</div>';
    }).join('') + '</div>' : '';

    var refUse = r.caseResults.reduce(function (a, x) { return a + x.ref.opens + x.ref.views; }, 0);
    var totalTime = r.caseResults.reduce(function (a, x) { return a + x.seconds; }, 0);

    var buttons = preview ? '<button class="btn btn-primary" data-act="preview-restart">თავიდან</button>' :
      '<button class="btn" data-act="home">მთავარი</button><button class="btn btn-primary" data-act="practice-menu">პრაქტიკა</button>';

    render(topbar({ noLevel: true }) + '<main class="screen report"><section class="card wide">' +
      '<div class="report-head"><div><small class="eyebrow">' + (r.mode === 'eval' ? 'პირველი მცდელობა · იგზავნება LMS-ში' : 'არ იგზავნება LMS-ში') + '</small><h1>' + title + '</h1></div>' +
      '<div class="overall"><span>საერთო</span><b>' + agg.overall + '%</b></div></div>' +
      '<div class="skill-grid">' + skillCards + '</div>' +
      (levels ? '<h2>დონეები</h2><ul class="level-list">' + levels + '</ul>' : '') +
      (criticals.length ? '<h2>კრიტიკული შეცდომები</h2><ul class="crit-list">' + criticals.join('') + '</ul>' : '') +
      (missed.length ? '<h2>გამოტოვებული გაყიდვის შესაძლებლობები</h2><ul class="missed-list">' + missed.join('') + '</ul>' : '') +
      '<div class="review-head"><h2>საუბრების მიმოხილვა</h2><button class="btn btn-sm" data-act="expand-all">ყველას გაშლა</button></div>' + cases + quiz +
      '<p class="muted small">' + (cfg.features.referencePanel ? 'საცნობარო პანელის გამოყენება: ' + refUse + '-ჯერ. ' : '') +
      (cfg.features.showTimeInReport ? 'საუბრებში გატარებული დრო: ' + fmtTime(totalTime) + '.' : '') + '</p>' +
      '<div class="actions">' + buttons + '</div></section></main>');
  }

  function caseReport(res) {
    var cs = CASES[res.caseId];
    if (!cs) return '';
    var mx = Engine.caseMax(cs);
    var penalty = Number(cfg.scoring.criticalPenalty) || 0;
    var critBy = {};
    res.criticals.forEach(function (c) { critBy[c.skill] = (critBy[c.skill] || 0) + 1; });
    var pills = SKILLS.map(function (s) {
      var p = Engine.skillPct(res.earned[s], mx[s], critBy[s] || 0, penalty);
      return '<span class="mini-score">' + T.skills[s] + ': <b>' + (p == null ? '—' : p + '%') + '</b></span>';
    }).join('');
    var cls = { resolved: 'ok', escalated: 'warn', unresolved: 'bad', walkout: 'bad' }[res.outcome] || 'ok';
    var steps = res.compact ? '<p class="muted">დეტალური ჩანაწერი ამ საუბრისთვის მიუწვდომელია (სესია განახლდა სხვა მოწყობილობაზე/ბრაუზერში).</p>' :
      res.steps.filter(function (st) {
        var nd = cs.nodes[st.node];
        if (!nd) return false;
        if (st.kind === 'ask') return nd.type === 'ask';
        if (st.kind === 'task') return nd.type === 'task';
        return nd.options && nd.options[st.option];
      }).map(function (st, idx) {
        var node = cs.nodes[st.node];
        if (st.kind === 'ask') return askReport(node, st, idx);
        if (st.kind === 'task') return taskReport(node, st, idx);
        var opt = node.options[st.option];
        var best = Engine.bestOption(node);
        return '<div class="step v-' + st.verdict + '"><div class="step-n">' + (idx + 1) + '</div><div class="step-body">' +
          (node.say ? '<div class="say"><small>' + T.customer + '</small>' + esc(node.say) + '</div>' : '') +
          '<div class="ans"><small>' + T.you + ' <span class="verdict">' + T.verdicts[st.verdict] + '</span>' +
          (cfg.features.showTimeInReport ? ' · ' + fmtTime(st.latency / 1000) : '') + '</small>' + esc(opt.text) + '</div>' +
          (opt.feedback ? '<div class="fb">' + esc(opt.feedback) + '</div>' : '') +
          (opt.critical && opt.critical.reason ? '<div class="fb crit-text">' + esc(opt.critical.reason) + '</div>' : '') +
          (st.verdict !== 'best' && best ? '<div class="best"><small>საუკეთესო პასუხი</small>' + esc(best.text) + '</div>' : '') +
          '</div></div>';
      }).join('');
    return '<details class="case-review"><summary><span class="ch-icon">' + ICONS[res.channel || cs.channel] + '</span><b>' + esc(cs.title) + '</b>' +
      '<span class="outcome outcome-' + cls + '">' + T.outcomes[res.outcome] + '</span><span class="pills">' + pills + '</span></summary>' +
      '<div class="steps">' + steps + '</div></details>';
  }

  function stepHead(st, idx, title) {
    return '<div class="step v-' + st.verdict + '"><div class="step-n">' + (idx + 1) + '</div><div class="step-body">' +
      '<div class="ans"><small>' + title + ' <span class="verdict">' + T.verdicts[st.verdict] + '</span>' +
      (cfg.features.showTimeInReport && st.latency != null ? ' · ' + fmtTime(st.latency / 1000) : '') + '</small></div>';
  }

  function askReport(node, st, idx) {
    var byQ = {};
    node.questions.forEach(function (q) { byQ[q.id] = q; });
    var asked = st.asked.map(function (id) {
      var q = byQ[id];
      if (!q) return '';
      var t = Engine.optionTotal(q);
      return '<li class="' + (t > 0 ? 'q-good' : t < 0 ? 'q-bad' : '') + '">' + esc(q.text) + (q.feedback && t <= 0 ? '<div class="fb">' + esc(q.feedback) + '</div>' : '') + '</li>';
    }).join('');
    var useful = node.questions.filter(function (q) { return Engine.optionTotal(q) > 0 && st.asked.indexOf(q.id) < 0; });
    return stepHead(st, idx, 'კითხვები კლიენტს') +
      '<div class="ans"><ul class="asked">' + asked + '</ul></div>' +
      (useful.length ? '<div class="best"><small>არ დაგისვამთ (მნიშვნელოვანი)</small><ul>' + useful.map(function (q) {
        return '<li>' + esc(q.text) + (q.required ? ' <span class="tag">აუცილებელი</span>' : '') + '</li>';
      }).join('') + '</ul></div>' : '') + '</div></div>';
  }

  function taskReport(node, st, idx) {
    var exp = Engine.expectedValues(node);
    var rows = node.fields.map(function (f) {
      var ok = st.fields[f.id];
      if (ok === null || ok === undefined) {
        if (f.type !== 'computed') return '';
        return '<tr class="t-info"><th>' + esc(f.label) + '</th><td>' + esc(st.values[f.id]) + '</td><td>—</td><td></td></tr>';
      }
      var shown = f.type === 'checkbox' ? (st.values[f.id] ? 'კი' : 'არა') : st.values[f.id];
      var want = f.type === 'checkbox' ? (exp[f.id] ? 'კი' : 'არა') : (f.expect && f.expect.min !== undefined && f.expect.max !== undefined ? f.expect.min + '–' + f.expect.max : exp[f.id]);
      return '<tr class="' + (ok ? 't-ok' : 't-bad') + '"><th>' + esc(f.label) + '</th><td>' + esc(shown === '' ? '—' : shown) + '</td><td>' + esc(want) + '</td><td>' + (ok ? ICONS.check : '✗') + '</td></tr>' +
        (!ok && (f.feedback || (f.critical && f.critical.reason)) ? '<tr class="t-fb"><td colspan="4">' + esc(f.critical && f.critical.reason ? f.critical.reason : f.feedback) + '</td></tr>' : '');
    }).join('');
    return stepHead(st, idx, 'სისტემაში: ' + esc(node.title || 'ამოცანა')) +
      '<div class="table-wrap"><table class="task-table"><tr><th>ველი</th><th>თქვენ</th><th>სწორი</th><th></th></tr>' + rows + '</table></div></div></div>';
  }

  /* ---------------- actions ---------------- */
  function startEval() {
    if (noCredit()) return showWelcome();
    state.e = emptyEval();
    state.e.s = 'a';
    state.e.st = levelSteps(0);
    if (Scorm.get('cmi.core.lesson_status') === 'not attempted' || !Scorm.get('cmi.core.lesson_status')) Scorm.set('cmi.core.lesson_status', 'incomplete');
    saveState();
    try { window.localStorage.removeItem(detailKey); } catch (e) { /* ignore */ }
    run = newRun('eval', 0);
    run.steps = state.e.st.slice();
    showLevelIntro();
  }

  function rebuildEvalRun() {
    var e = state.e;
    var r = newRun('eval', 0);
    var detail = loadDetail();
    var detailCases = detail && detail.cases ? detail.cases.slice() : [];
    r.caseResults = e.r.map(function (a) {
      for (var i = 0; i < detailCases.length; i++) {
        if (detailCases[i] && detailCases[i].caseId === a[0] && detailCases[i].lvl === (a[7] || 0)) return detailCases.splice(i, 1)[0];
      }
      return expandCase(a);
    });
    r.quizResults = e.q.map(function (q) {
      var d = detail && detail.quiz ? detail.quiz.filter(function (x) { return x.id === q[0] && x.lvl === q[2]; })[0] : null;
      return d || { id: q[0], correct: !!q[1], points: QUIZ[q[0]] ? QUIZ[q[0]].points : 1, lvl: q[2], answer: null };
    });
    r.levelResults = e.lv.map(function (l) { return { levelId: l[0], pct: l[1], passed: !!l[2] }; });
    r.levelIndex = e.li;
    r.lvl = e.li; // evaluation always starts at level index 0, so lvl === level index
    r.steps = e.st.slice();
    r.stepIndex = e.i;
    return r;
  }

  function resumeEval() {
    run = rebuildEvalRun();
    if (!LEVELS[run.levelIndex]) {
      // the package was updated and this level no longer exists: close the evaluation with what was recorded
      run.levelIndex = LEVELS.length - 1;
      finalizeEval();
      return showReport(run, Engine.aggregate(content, run.caseResults, run.quizResults));
    }
    if (run.stepIndex === 0) showLevelIntro();
    else nextStep();
  }

  function showEvalReport() {
    run = rebuildEvalRun();
    var agg = Engine.aggregate(content, run.caseResults, run.quizResults);
    showReport(run, agg);
  }

  function startPractice(li) {
    run = newRun('practice', li);
    run.steps = levelSteps(li);
    showLevelIntro();
  }

  var actions = {
    'start-eval': startEval,
    'resume-eval': resumeEval,
    'eval-report': showEvalReport,
    'practice-menu': showPracticeMenu,
    'home': showWelcome,
    'start-practice': function (el) { startPractice(Number(el.getAttribute('data-level'))); },
    'next-step': nextStep,
    'advance': advance,
    'next-level': nextLevel,
    'finish-run': finishRun,
    'choose': function (el) { choose(Number(el.getAttribute('data-i'))); },
    'quiz-answer': function (el) { answerQuiz(Number(el.getAttribute('data-i'))); },
    'ref-view': function (el) {
      var p = PRODUCTS[el.getAttribute('data-id')];
      if (!p) return;
      if (current) current.ref.views++;
      var d = document.getElementById('ref-detail');
      d.innerHTML = refDetail(p);
      d.classList.remove('hidden');
      document.getElementById('ref-list').classList.add('hidden');
    },
    'ref-back': function () {
      document.getElementById('ref-detail').classList.add('hidden');
      document.getElementById('ref-list').classList.remove('hidden');
    },
    'reset-local': function (el) {
      // two-step confirmation inside the page (window.confirm is blocked in some hosts)
      if (el.getAttribute('data-armed') !== '1') {
        el.setAttribute('data-armed', '1');
        el.textContent = 'პროგრესი წაიშლება — დააჭირეთ ისევ დასადასტურებლად';
        setTimeout(function () {
          if (el.isConnected) { el.removeAttribute('data-armed'); el.textContent = 'თავიდან დაწყება'; }
        }, 4000);
        return;
      }
      restartLocal();
    },
    'preview-restart': function () { startPreview(); },
    'mon-tab': function (el) {
      var tab = el.getAttribute('data-tab');
      if (el.getAttribute('data-pane')) setPane(el.getAttribute('data-pane'));
      if (tab === 'products' && current && monTab !== 'products') current.ref.opens++;
      monTab = tab;
      renderMonitor();
      var b = app.querySelector('.mon-tabs [data-tab="' + tab + '"]');
      if (b) b.focus();
    },
    'ask-q': function (el) { askQuestion(el.getAttribute('data-q')); },
    'ask-done': function () { finishAsk(); },
    'task-submit': function () { submitTask(); },
    'calc': function (el) { calcPress(el.getAttribute('data-k')); },
    'fullscreen': function () { toggleFullscreen(); },
    'pane': function (el) { setPane(el.getAttribute('data-pane')); },
    'history': function () {
      renderHistory();
      var h = document.getElementById('history');
      if (h) { h.hidden = false; var c = h.querySelector('[data-act="history-close"]'); if (c) c.focus(); }
    },
    'history-close': function () {
      var h = document.getElementById('history');
      if (h) h.hidden = true;
      var b = app.querySelector('.history-btn');
      if (b) b.focus();
    },
    'expand-all': function (el) {
      var all = app.querySelectorAll('.case-review');
      var open = !Array.prototype.every.call(all, function (d) { return d.open; });
      all.forEach(function (d) { d.open = open; });
      el.textContent = open ? 'ყველას აკეცვა' : 'ყველას გაშლა';
    }
  };

  var GUARDED = { 'choose': 1, 'quiz-answer': 1, 'advance': 1, 'next-step': 1, 'next-level': 1, 'finish-run': 1, 'start-eval': 1, 'resume-eval': 1, 'ask-q': 1, 'ask-done': 1, 'task-submit': 1 };

  app.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el || el.disabled) return;
    var act = el.getAttribute('data-act');
    if (GUARDED[act] && Date.now() < inputLockedUntil) { ev.preventDefault(); return; }
    var fn = actions[act];
    if (fn) { ev.preventDefault(); fn(el); }
  });

  app.addEventListener('submit', function (ev) {
    if (ev.target && ev.target.id === 'task-form') {
      ev.preventDefault();
      if (Date.now() >= inputLockedUntil) submitTask();
    }
  });
  app.addEventListener('change', function (ev) { if (ev.target && ev.target.closest && ev.target.closest('#task-form')) updateComputed(); });

  var searchTimer = null;
  app.addEventListener('input', function (ev) {
    if (ev.target.closest && ev.target.closest('#task-form')) { updateComputed(); return; }
    if (ev.target.id !== 'ref-search') return;
    var list = document.getElementById('ref-list');
    list.innerHTML = refList(ev.target.value);
    list.classList.remove('hidden');
    document.getElementById('ref-detail').classList.add('hidden');
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { if (current && ev.target.value) current.ref.searches++; }, 600);
  });

  document.addEventListener('keydown', function (ev) {
    var hist = document.getElementById('history');
    if (ev.key === 'Escape' && hist && !hist.hidden) { ev.preventDefault(); actions['history-close'](); return; }
    var tab = ev.target && ev.target.closest && ev.target.closest('[role="tab"]');
    if (tab && /^(ArrowLeft|ArrowRight|Home|End)$/.test(ev.key)) {
      var tabs = Array.prototype.slice.call(tab.parentNode.querySelectorAll('[role="tab"]'));
      var at = tabs.indexOf(tab);
      var to = ev.key === 'Home' ? 0 : ev.key === 'End' ? tabs.length - 1 : (at + (ev.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      ev.preventDefault();
      tabs[to].click();
      tabs[to].focus();
      return;
    }
    if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.repeat || ev.isComposing) return;
    var t = ev.target;
    if (t && t.closest && (t.closest('input,textarea,select,[contenteditable],dialog,.monitor,.history,.review-strip') || t.isContentEditable)) return;
    var m = /^(?:Digit|Numpad)([1-7])$/.exec(ev.code || '');
    var idx = -1;
    if (m) idx = Number(m[1]) - 1;
    else if ((m = /^Key([A-G])$/.exec(ev.code || ''))) idx = m[1].charCodeAt(0) - 65;
    if (idx < 0) return;
    var opts = app.querySelectorAll('#choices .opt, .quiz .opt');
    if (opts[idx]) { ev.preventDefault(); opts[idx].click(); }
  });

  function restartLocal() {
    preview = null;
    Scorm.resetLocal();
    try { window.localStorage.removeItem(detailKey); } catch (e) { /* ignore */ }
    state = { v: 1, e: emptyEval(), p: { u: 0, n: 0 } };
    showWelcome();
  }

  /* ---------------- builder preview ---------------- */
  function startPreview() {
    var id = preview.id;
    run = newRun('practice', 0);
    var item = CASES[id] ? 'c:' + id : QUIZ[id] ? 'q:' + id : null;
    if (preview.level != null) {
      var li = Math.max(0, LEVELS.map(function (l) { return l.id; }).indexOf(preview.level));
      run.levelIndex = li;
      run.steps = levelSteps(li);
      return showLevelIntro();
    }
    if (!item) { render('<main class="screen center"><section class="card"><h1>ვერ მოიძებნა: ' + esc(id) + '</h1></section></main>'); return; }
    if (CASES[id]) run.levelIndex = Math.max(0, LEVELS.map(function (l) { return l.id; }).indexOf(CASES[id].level));
    run.steps = [item];
    nextStep();
  }

  function showLmsBanner(on) {
    var el = document.getElementById('lms-banner');
    if (!on) { if (el) el.remove(); return; }
    if (el) return;
    el = document.createElement('div');
    el.id = 'lms-banner';
    el.className = 'lms-banner';
    el.setAttribute('role', 'alert');
    el.textContent = 'შედეგები LMS-ში ვერ ინახება. ნუ დახურავთ ფანჯარას — ვცდილობთ ხელახლა. თუ შეტყობინება არ ქრება, მიმართეთ ადმინისტრატორს.';
    document.body.insertBefore(el, document.body.firstChild);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    applyTheme();
    var hash = window.location.hash || '';
    var m = hash.match(/preview=([^&]+)/);
    var lm = hash.match(/previewLevel=(\d+)/);
    if (m || lm) {
      preview = { id: m ? decodeURIComponent(m[1]) : null, level: lm ? Number(lm[1]) : null };
      Scorm.init('preview-' + Date.now());
      state = { v: 1, e: emptyEval(), p: { u: LEVELS.length, n: 0 } };
      startPreview();
      return;
    }
    if (!Scorm.init(content.meta.packageId)) {
      render('<main class="screen center"><section class="card"><h1>LMS-თან კავშირი ვერ დამყარდა</h1>' +
        '<p class="lead">შეფასება ვერ დაიწყება, რადგან შედეგები LMS-ში ვერ შეინახება.</p>' +
        '<p>დახურეთ ეს ფანჯარა და კურსი თავიდან გაუშვით LMS-დან. თუ პრობლემა განმეორდა, მიმართეთ ადმინისტრატორს.</p>' +
        '<p class="muted small">კოდი: ' + esc(Scorm.error) + '</p></section></main>');
      return;
    }
    studentName = Scorm.get('cmi.core.student_name');
    studentId = Scorm.get('cmi.core.student_id');
    detailKey = 'sim-detail:' + content.meta.packageId + ':' + (studentId || 'local');
    if (Scorm.isStandalone() && /(^|[#&])reset/.test(hash)) {
      // builder "test full game" opens with #reset for a clean local run
      Scorm.resetLocal();
      try { window.localStorage.removeItem(detailKey); } catch (e) { /* ignore */ }
    }
    loadState();
    var st0 = Scorm.get('cmi.core.lesson_status');
    if ((st0 === '' || st0 === 'not attempted') && !noCredit()) Scorm.set('cmi.core.lesson_status', 'incomplete');
    Scorm.set('cmi.core.exit', 'suspend');
    Scorm.commit();
    Scorm.onFailure = function () { showLmsBanner(true); };
    Scorm.onRecover = function () {
      showLmsBanner(false);
      if (state.e.s === 'd' && !state.e.sent) { state.e.sent = 1; saveState(); }
    };
    // finish only when the page really goes away; commit on the earlier signals
    window.addEventListener('pagehide', function () { Scorm.finish(); });
    window.addEventListener('beforeunload', function () { Scorm.commit(); });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') Scorm.commit(); });
    // final result computed earlier but never confirmed by the LMS: send it again
    if (state.e.s === 'd' && !state.e.sent && state.e.res && !state.e.res.lost) {
      run = rebuildEvalRun();
      var agg = Engine.aggregate(content, run.caseResults, run.quizResults);
      reportFinal(agg, run.levelResults.filter(function (l) { return l.passed; }).length, run.levelResults.length);
      saveState();
      if (Scorm.ok) { state.e.sent = 1; saveState(); }
      run = null;
    }
    showWelcome();
  }

  // exposed for automated tests
  window.SimApp = {
    /** jump straight into a case or quiz id, or a level ({level: 2}); used by review tools */
    jump: function (target) {
      if (!detailKey) detailKey = 'sim-detail:' + content.meta.packageId + ':local';
      preview = typeof target === 'object' ? { id: null, level: target.level } : { id: target, level: null };
      state = state || { v: 1, e: emptyEval(), p: { u: LEVELS.length, n: 0 } };
      startPreview();
    },
    /** standalone only: wipe local progress and go back to the start screen */
    restart: function () { if (Scorm.isStandalone()) restartLocal(); },
    state: function () { return state; },
    run: function () { return run; },
    current: function () { return current; },
    quiz: function () { return currentQuiz; },
    content: content
  };

  boot();
})();
