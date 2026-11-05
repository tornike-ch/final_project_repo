/*
 * Builder smoke test.
 *   node tools/builder_test.js [--xlsx /path/to/xlsx.full.min.js] [--shots dir]
 * --xlsx serves SheetJS from a local file instead of cdnjs (offline CI).
 */
'use strict';
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const XLSX_LOCAL = arg('--xlsx');
const SHOTS = arg('--shots');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css' };

let failures = 0;
const check = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) failures++; };

(async () => {
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://localhost:' + srv.address().port;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'simb-'));

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1366, height: 860 } });
  if (XLSX_LOCAL) {
    await ctx.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/xlsx/, (route) => route.fulfill({ body: fs.readFileSync(XLSX_LOCAL), contentType: 'text/javascript' }));
  }
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(base + '/builder/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('.cards');
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'b1_overview.png') });
  const nSample = await page.evaluate(() => window.DEFAULT_CONTENT.cases.length);
  check((await page.textContent('.cards')).includes(String(nSample)), 'overview shows ' + nSample + ' sample cases');

  // ---- export SCORM zip
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.bar [data-act="export-scorm"]')]);
  const zipPath = path.join(tmp, dl.suggestedFilename());
  await dl.saveAs(zipPath);
  const listing = execFileSync('python3', ['-c', 'import zipfile,sys;z=zipfile.ZipFile(sys.argv[1]);print(z.testzip());print("\\n".join(z.namelist()))', zipPath]).toString();
  check(listing.startsWith('None'), 'exported zip passes CRC check');
  ['imsmanifest.xml', 'index.html', 'css/style.css', 'js/app.js', 'data/content.js'].forEach((f) => check(listing.includes(f), 'zip contains ' + f));

  // ---- the exported package runs
  const unz = path.join(tmp, 'pkg');
  execFileSync('python3', ['-c', 'import zipfile,sys;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])', zipPath, unz]);
  const p2 = await ctx.newPage();
  p2.on('pageerror', (e) => errors.push('pkg: ' + e.message));
  await p2.goto('file://' + path.join(unz, 'index.html'));
  await p2.waitForSelector('[data-act="start-eval"]');
  check(true, 'exported package boots from the unzipped folder');
  await p2.close();

  // ---- JSON import (merge one new case)
  await page.click('#nav [data-view="import"]');
  const newCase = JSON.parse(JSON.stringify(await page.evaluate(() => window.DEFAULT_CONTENT.cases[0])));
  newCase.id = 'C999'; newCase.title = 'იმპორტის ტესტი'; newCase.level = 2;
  const jf = path.join(tmp, 'one_case.json');
  fs.writeFileSync(jf, JSON.stringify(newCase));
  await page.setInputFiles('#imp-file', jf);
  await page.waitForSelector('.notice');
  check((await page.textContent('.notice')).includes(nSample + ' → ' + (nSample + 1)), 'JSON merge adds a case');

  // ---- settings toggle persists
  await page.click('#nav [data-view="settings"]');
  await page.uncheck('[data-path="config.features.quiz"]');
  await page.reload();
  check(await page.evaluate(() => window.Builder.content().config.features.quiz === false), 'add-on toggle saved');

  // ---- preview popup
  await page.click('#nav [data-view="cases"]');
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'b2_cases.png') });
  const [pop] = await Promise.all([page.waitForEvent('popup'), page.click('[data-act="preview-case"][data-id="C999"]')]);
  await pop.waitForSelector('#choices .opt', { timeout: 10000 });
  check((await pop.textContent('.scene-tag')).length > 0, 'case preview opens in a new window');
  await pop.close();

  // ---- Excel round trip
  if (XLSX_LOCAL) {
    await page.click('#nav [data-view="import"]');
    const [x] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="export-xlsx"]')]);
    const xp = path.join(tmp, 'content.xlsx');
    await x.saveAs(xp);
    check(fs.statSync(xp).size > 5000, 'Excel workbook exported');
    await page.selectOption('#imp-mode', 'replace');
    await page.setInputFiles('#imp-file', xp);
    await page.waitForSelector('.notice');
    const txt = await page.textContent('.notice');
    check(txt.includes((nSample + 1) + ' → ' + (nSample + 1)) && !/error/i.test(txt), 'Excel re-import (replace) keeps all cases, no errors: ' + txt.trim().slice(0, 120));
    const v = await page.evaluate(() => window.Engine.validate(window.Builder.content()).errors.length);
    check(v === 0, 'content valid after Excel round trip');
  } else {
    console.log('SKIP Excel round trip (pass --xlsx path/to/xlsx.full.min.js)');
  }

  if (SHOTS) {
    await page.click('#nav [data-view="settings"]');
    await page.screenshot({ path: path.join(SHOTS, 'b3_settings.png'), fullPage: true });
  }
  check(errors.length === 0, 'no JS errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await browser.close();
  srv.close();
  console.log(failures ? failures + ' check(s) failed' : 'All checks passed');
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
