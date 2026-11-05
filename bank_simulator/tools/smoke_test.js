/*
 * End-to-end smoke test (Playwright + Chromium).
 *   node tools/smoke_test.js [--shots <dir>]
 * Plays the game inside the mock-LMS harness and checks what reaches the LMS.
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const shotsArg = process.argv.indexOf('--shots');
const SHOTS = shotsArg > 0 ? process.argv[shotsArg + 1] : null;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.xml': 'application/xml', '.json': 'application/json' };

function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(res);
    });
    srv.listen(0, () => resolve(srv));
  });
}

let failures = 0;
function check(cond, msg) {
  console.log((cond ? 'PASS ' : 'FAIL ') + msg);
  if (!cond) failures++;
}

async function sco(page) {
  let frame = null;
  for (let i = 0; i < 100 && !frame; i++) {
    frame = page.frame({ url: /player\/index\.html/ });
    if (!frame) await page.waitForTimeout(50);
  }
  await frame.waitForFunction(() => window.SimApp);
  await frame.evaluate(() => { window.SIM_FAST = true; });
  return frame;
}

async function shot(page, name) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, name + '.png') });
}

/** strategy(node) -> option index */
async function playThrough(frame, strategy, opts = {}) {
  const errors = [];
  for (let guard = 0; guard < 400; guard++) {
    const act = await frame.evaluate(() => {
      const q = (s) => document.querySelector(s);
      if (q('#choices .opt')) return 'choose';
      if (q('.quiz .opt')) return 'quiz';
      if (q('[data-act="advance"]')) return 'advance';
      if (q('[data-act="next-step"]')) return 'next-step';
      if (q('[data-act="next-level"]')) return 'next-level';
      if (q('[data-act="finish-run"]')) return 'finish-run';
      if (q('.report')) return 'report';
      return 'wait';
    });
    if (act === 'report') return errors;
    if (opts.stopAfterCases != null) {
      const done = await frame.evaluate(() => window.SimApp.run() ? window.SimApp.run().caseResults.length : 0);
      if (done >= opts.stopAfterCases && act === 'advance') return errors;
    }
    if (act === 'wait') { await frame.waitForTimeout(30); continue; }
    if (act === 'choose') {
      const idx = await frame.evaluate(strategy);
      await frame.click('#choices .opt[data-i="' + idx + '"]');
    } else if (act === 'quiz') {
      const want = opts.quizCorrect !== false;
      await frame.evaluate((want) => {
        const qz = window.SimApp.quiz().q;
        const target = want ? qz.correct : (qz.correct + 1) % qz.options.length;
        document.querySelector('.quiz .opt[data-i="' + target + '"]').click();
      }, want);
    } else {
      if (opts.onScreen) await opts.onScreen(act);
      await frame.click('[data-act="' + act + '"]');
    }
    await frame.waitForTimeout(10);
  }
  throw new Error('playThrough did not finish');
}

const BEST = () => {
  const cur = window.SimApp.current();
  const node = cur.node();
  const best = window.Engine.bestOption(node);
  return node.options.indexOf(best);
};
const WORST = () => {
  const node = window.SimApp.current().node();
  let w = 0;
  node.options.forEach((o, i) => { if (window.Engine.optionTotal(o) < window.Engine.optionTotal(node.options[w]) || o.critical) w = i; });
  return w;
};

(async () => {
  const srv = await serve();
  const base = 'http://localhost:' + srv.address().port;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 820 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g/.test(m.text())) consoleErrors.push(m.text()); });

  /* ---------- 1. perfect evaluation run ---------- */
  await page.goto(base + '/tools/lms_test_harness.html');
  await page.click('#wipe');
  await page.waitForTimeout(400);
  let frame = await sco(page);
  await shot(page, '01_welcome');
  await frame.click('[data-act="start-eval"]');
  let shotTaken = {};
  await playThrough(frame, BEST, {
    onScreen: async (act) => {
      if (act === 'advance' && !shotTaken.case) {
        shotTaken.case = 1;
        await frame.evaluate(() => { const b = document.querySelector('[data-act="ref-toggle"]'); if (b) b.click(); });
        await frame.waitForTimeout(300);
        await shot(page, '02_case_end_with_reference');
        await frame.evaluate(() => { const b = document.querySelector('.ref-head [data-act="ref-toggle"]'); if (b) b.click(); });
      }
      if (act === 'next-level' && !shotTaken.level) { shotTaken.level = 1; await shot(page, '04_level_passed'); }
    }
  });
  await shot(page, '05_report');
  let lms = await page.evaluate(() => window.mockLMS.data());
  check(lms['cmi.core.score.raw'] === '100', 'perfect run reports score 100 (got ' + lms['cmi.core.score.raw'] + ')');
  check(lms['cmi.core.lesson_status'] === 'completed', 'lesson_status completed (got ' + lms['cmi.core.lesson_status'] + ')');
  check(lms['cmi.objectives.0.id'] === 'knowledge' && lms['cmi.objectives.0.score.raw'] === '100', 'knowledge objective = 100');
  check(lms['cmi.objectives.2.id'] === 'sales' && lms['cmi.objectives.2.score.raw'] === '100', 'sales objective = 100');
  check(lms['cmi.objectives.3.id'] === 'levels' && lms['cmi.objectives.3.score.raw'] === '100', 'levels objective = 100% of levels passed');
  check(lms['cmi.objectives.4.id'] === 'critical_errors' && lms['cmi.objectives.4.status'] === 'passed', 'critical-errors objective passed (none)');
  check(Number(lms['cmi.interactions._count']) > 20, 'interactions written (' + lms['cmi.interactions._count'] + ')');
  check(lms['cmi.suspend_data'].length < 4096, 'suspend_data within 4096 chars (' + lms['cmi.suspend_data'].length + ')');
  const summaries = Object.keys(lms).filter((k) => /interactions\.\d+\.id$/.test(k) && /^C\w+_SUMMARY$/.test(lms[k]));
  check(Object.keys(lms).some((k) => /interactions\.\d+\.id$/.test(k) && lms[k] === 'SESSION_SUMMARY'), 'session summary interaction written');
  check(summaries.length === 6, 'one summary interaction per case (' + summaries.length + ')');

  /* ---------- 2. relaunch after completion: evaluation locked ---------- */
  await page.click('#reload');
  await page.waitForTimeout(300);
  frame = await sco(page);
  const welcome = await frame.textContent('.welcome');
  check(/შეფასება დასრულებულია/.test(welcome), 'relaunch shows evaluation finished');
  check(!(await frame.$('[data-act="start-eval"]')), 'no way to restart evaluation');
  await frame.click('[data-act="practice-menu"]');
  const unlocked = await frame.$$eval('.level-card:not(.locked)', (els) => els.length);
  check(unlocked === 3, 'all 3 levels unlocked for practice (' + unlocked + ')');
  await shot(page, '06_practice_menu');
  await frame.click('[data-act="start-practice"][data-level="1"]');
  await playThrough(frame, WORST, { quizCorrect: false });
  lms = await page.evaluate(() => window.mockLMS.data());
  check(lms['cmi.core.score.raw'] === '100', 'practice does not overwrite LMS score');
  await shot(page, '07_practice_report_failed');

  /* ---------- 3. failing evaluation + resume ---------- */
  await page.click('#wipe');
  await page.waitForTimeout(300);
  frame = await sco(page);
  await frame.click('[data-act="start-eval"]');
  await playThrough(frame, BEST, { stopAfterCases: 1 });
  // close mid-level (before pressing "next")
  await page.click('#reload');
  await page.waitForTimeout(300);
  frame = await sco(page);
  check(!!(await frame.$('[data-act="resume-eval"]')), 'resume offered after relaunch');
  await shot(page, '08_resume');
  await frame.click('[data-act="resume-eval"]');
  await playThrough(frame, WORST, { quizCorrect: false });
  lms = await page.evaluate(() => window.mockLMS.data());
  const raw = Number(lms['cmi.core.score.raw']);
  check(raw < 70, 'failing run reports low score (' + raw + ')');
  check(lms['cmi.objectives.3.score.raw'] === '0', 'levels objective = 0% when level 1 failed (' + lms['cmi.objectives.3.score.raw'] + ')');
  const st = await frame.evaluate(() => window.SimApp.state());
  check(st.e.s === 'd' && st.e.lv.length === 1, 'evaluation stopped after failed level 1');
  check(st.e.r.length === 2, 'resumed run kept the case played before relaunch (' + st.e.r.length + ')');
  const critCount = st.e.r.reduce((t, r) => t + r[4] + r[5] + r[6], 0);
  const crit = await frame.$$eval('.crit-list li', (els) => els.length);
  check(crit === critCount, 'report lists every critical error (' + crit + ' of ' + critCount + ')');
  if (critCount) check(lms['cmi.objectives.4.status'] === 'failed', 'critical-errors objective failed');

  check((await page.evaluate(() => window.mockLMS.errors())).length === 0, 'no SCORM errors in the mock LMS: ' + (await page.evaluate(() => window.mockLMS.errors())).slice(0, 3).join(' | '));

  /* ---------- 3b. open and close without starting: must not lock the evaluation ---------- */
  await page.click('#wipe');
  await page.waitForTimeout(400);
  frame = await sco(page);
  await page.click('#reload'); // close without starting
  await page.waitForTimeout(400);
  frame = await sco(page);
  check(!!(await frame.$('[data-act="start-eval"]')), 'opening and closing without starting keeps the evaluation available');
  lms = await page.evaluate(() => window.mockLMS.data());
  check(lms['cmi.core.lesson_status'] === 'incomplete', 'status set to incomplete at launch (' + lms['cmi.core.lesson_status'] + ')');

  /* ---------- 3c. LMS refuses initialisation: game must not run silently ---------- */
  await page.goto(base + '/tools/lms_test_harness.html?initfail=1');
  await page.waitForTimeout(600);
  const blocked = await page.frame({ url: /player\/index\.html/ }).textContent('body');
  check(/LMS-თან კავშირი ვერ დამყარდა/.test(blocked), 'init failure shows a blocking message instead of a silent test mode');

  /* ---------- 4. standalone (no LMS) + preview hash + phone screen ---------- */
  const p2 = await ctx.newPage();
  p2.on('pageerror', (e) => consoleErrors.push(e.message));
  await p2.goto(base + '/player/index.html#preview=C202');
  await p2.waitForSelector('#choices .opt', { timeout: 5000 });
  await p2.evaluate(() => { window.SIM_FAST = true; });
  if (SHOTS) await p2.screenshot({ path: path.join(SHOTS, '03_phone_case.png') });
  await p2.goto(base + '/player/index.html?r=2#preview=C103');
  await p2.waitForSelector('#choices .opt');
  await p2.evaluate(() => { window.SIM_FAST = true; });
  await p2.click('#choices .opt[data-i="1"]'); // CVV request -> critical
  await p2.waitForSelector('#choices .opt');
  if (SHOTS) await p2.screenshot({ path: path.join(SHOTS, '03b_chat_case.png') });
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mobile.on('pageerror', (e) => consoleErrors.push(e.message));
  await mobile.goto(base + '/player/index.html?r=3#preview=C201');
  await mobile.waitForSelector('#choices .opt');
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check(!overflow, 'no horizontal scroll at phone width');
  if (SHOTS) await mobile.screenshot({ path: path.join(SHOTS, '09_mobile.png'), fullPage: true });

  check(consoleErrors.length === 0, 'no JS errors' + (consoleErrors.length ? ': ' + consoleErrors.join(' | ') : ''));

  await browser.close();
  srv.close();
  console.log(failures ? failures + ' check(s) failed' : 'All checks passed');
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
