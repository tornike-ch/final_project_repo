/*
 * Simulator Builder: import cases (JSON / Excel), configure, validate,
 * preview and export a SCORM 1.2 package. Runs fully in the browser.
 */
(function () {
  'use strict';

  // Engine is taken from the bundled player so the builder stays self-contained.
  if (!window.Engine) new Function(window.PLAYER_FILES['js/engine.js'])();
  var Engine = window.Engine;
  var SheetIO = window.SheetIO;
  var STORE_KEY = 'sim-builder-content-v1';
  var XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

  var main = document.getElementById('main');
  var view = 'overview';
  var content;
  var caseFilter = '';
  var lastImport = null;

  /* ---------------- utils ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function deepMerge(base, over) {
    var out = clone(base);
    Object.keys(over || {}).forEach(function (k) {
      var v = over[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) out[k] = deepMerge(out[k], v);
      else out[k] = clone(v);
    });
    return out;
  }
  function prepare(c) {
    c = clone(c || {});
    c.meta = c.meta || {};
    c.meta.schemaVersion = 1;
    c.config = deepMerge(Engine.DEFAULT_CONFIG, c.config || {});
    c.cases = c.cases || [];
    c.products = c.products || [];
    c.quiz = c.quiz || [];
    return c;
  }
  function download(name, data, type) {
    var blob = data instanceof Blob ? data : new Blob([data], { type: type || 'application/octet-stream' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function slug(s) { return String(s || 'simulator').replace(/[^A-Za-z0-9_.-]/g, '_'); }
  function normalized() { return Engine.normalize(content); }

  /* ---------------- persistence ---------------- */
  function load() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { saved = null; }
    content = prepare(saved || window.DEFAULT_CONTENT);
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(content));
      document.getElementById('save-state').textContent = 'Saved in this browser · ' + new Date().toLocaleTimeString();
    } catch (e) {
      document.getElementById('save-state').textContent = 'Not saved (browser storage blocked). Export JSON to keep your work.';
    }
    updateBadge();
  }
  function updateBadge() {
    var v = Engine.validate(content);
    var b = document.getElementById('val-badge');
    b.textContent = v.errors.length ? v.errors.length : v.warnings.length ? v.warnings.length : '✓';
    b.className = 'badge ' + (v.errors.length ? 'bad' : v.warnings.length ? 'warn' : 'ok');
  }

  /* ---------------- package generation ---------------- */
  function contentJs(c) {
    return 'window.SIM_CONTENT = ' + JSON.stringify(c, null, 1) + ';\n';
  }

  function xmlEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function manifest(c, files) {
    var title = xmlEsc(c.meta.title || 'Simulator');
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<manifest identifier="' + (/^[A-Za-z_]/.test(slug(c.meta.packageId)) ? '' : 'PKG_') + slug(c.meta.packageId) + '" version="' + xmlEsc(c.meta.version || '1.0') + '"\n' +
      '  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"\n' +
      '  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"\n' +
      '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
      '  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">\n' +
      '  <metadata>\n    <schema>ADL SCORM</schema>\n    <schemaversion>1.2</schemaversion>\n  </metadata>\n' +
      '  <organizations default="ORG-1">\n    <organization identifier="ORG-1">\n      <title>' + title + '</title>\n' +
      '      <item identifier="ITEM-1" identifierref="RES-1" isvisible="true">\n        <title>' + title + '</title>\n      </item>\n' +
      '    </organization>\n  </organizations>\n' +
      '  <resources>\n    <resource identifier="RES-1" type="webcontent" adlcp:scormtype="sco" href="index.html">\n' +
      files.map(function (f) { return '      <file href="' + xmlEsc(f) + '"/>'; }).join('\n') +
      '\n    </resource>\n  </resources>\n</manifest>\n';
  }

  function exportScorm() {
    var v = Engine.validate(content);
    if (v.errors.length && !window.confirm(v.errors.length + ' validation error(s). The package may not work correctly. Export anyway?')) {
      setView('validation');
      return;
    }
    var files = Object.keys(window.PLAYER_FILES);
    var all = files.concat(['data/content.js']);
    var zipFiles = [{ name: 'imsmanifest.xml', data: manifest(content, all) }];
    files.forEach(function (f) { zipFiles.push({ name: f, data: window.PLAYER_FILES[f] }); });
    zipFiles.push({ name: 'data/content.js', data: contentJs(content) });
    var blob = window.MiniZip.makeZip(zipFiles);
    download(slug(content.meta.packageId) + '_v' + slug(content.meta.version || '1') + '_scorm12.zip', blob);
  }

  function singleHtml(c) {
    var html = window.PLAYER_FILES['index.html'];
    var safe = function (js) { return js.replace(/<\/script/gi, '<\\/script'); };
    html = html.replace(/<link rel="stylesheet" href="css\/style\.css">/, function () { return '<style>' + window.PLAYER_FILES['css/style.css'] + '</style>'; });
    html = html.replace(/<script src="([^"]+)"><\/script>/g, function (m, src) {
      var code = src === 'data/content.js' ? contentJs(c) : window.PLAYER_FILES[src];
      return code == null ? m : '<script>' + safe(code) + '</script>';
    });
    return html;
  }

  function openPreview(hash) {
    var url = URL.createObjectURL(new Blob([singleHtml(content)], { type: 'text/html' }));
    var w = window.open(url + '#' + hash, '_blank');
    if (!w) alert('Your browser blocked the preview window. Allow pop-ups for this page.');
  }

  /* ---------------- Excel ---------------- */
  function loadXLSX() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = XLSX_URL;
      s.onload = function () { resolve(window.XLSX); };
      s.onerror = function () { reject(new Error('Could not load the Excel library (needs internet). Use JSON import/export instead.')); };
      document.head.appendChild(s);
    });
  }

  function exportExcel(templateOnly) {
    loadXLSX().then(function (XLSX) {
      var src = templateOnly ? prepare(window.DEFAULT_CONTENT) : content;
      var sheets = SheetIO.contentToSheets(src);
      var wb = XLSX.utils.book_new();
      Object.keys(SheetIO.COLUMNS).forEach(function (name) {
        var cols = SheetIO.COLUMNS[name];
        var ws = XLSX.utils.json_to_sheet(sheets[name] || [], { header: cols });
        ws['!cols'] = cols.map(function (c) { return { wch: /text|say|feedback|cue|question|brief|notes|conditions|reason|short|description/.test(c) ? 60 : Math.max(10, c.length + 2) }; });
        XLSX.utils.book_append_sheet(wb, ws, name);
      });
      XLSX.writeFile(wb, templateOnly ? 'simulator_template.xlsx' : slug(content.meta.packageId) + '_content.xlsx');
    }).catch(function (e) { alert(e.message); });
  }

  function importFile(file, mode) {
    var name = file.name.toLowerCase();
    if (/\.json$/.test(name) || /\.js$/.test(name)) {
      file.text().then(function (text) {
        text = text.replace(/^\s*window\.SIM_CONTENT\s*=\s*/, '').replace(/;\s*$/, '');
        var data;
        try { data = JSON.parse(text); } catch (e) { return report('Invalid JSON: ' + e.message, true); }
        var parts = {};
        if (Array.isArray(data)) parts.cases = data;
        else if (data.nodes && data.id) parts.cases = [data];
        else {
          ['cases', 'products', 'quiz'].forEach(function (k) { if (Array.isArray(data[k])) parts[k] = data[k]; });
          if (data.config) parts.config = data.config;
          if (data.meta) parts.meta = data.meta;
        }
        finishImport(parts, mode, file.name);
      });
    } else if (/\.xlsx?$/.test(name)) {
      loadXLSX().then(function (XLSX) {
        return file.arrayBuffer().then(function (buf) {
          var wb = XLSX.read(buf, { type: 'array' });
          var sheets = {};
          Object.keys(SheetIO.COLUMNS).forEach(function (n) {
            var ws = wb.Sheets[n] || wb.Sheets[Object.keys(wb.Sheets).filter(function (k) { return k.toLowerCase() === n.toLowerCase(); })[0]];
            if (ws) sheets[n] = XLSX.utils.sheet_to_json(ws, { defval: '' });
          });
          if (!Object.keys(sheets).length) return report('No known sheets found. Expected: ' + Object.keys(SheetIO.COLUMNS).join(', '), true);
          var parts = SheetIO.sheetsToContent(sheets);
          finishImport(parts, mode, file.name);
        });
      }).catch(function (e) { report(e.message, true); });
    } else {
      report('Unsupported file type. Use .json or .xlsx', true);
    }
  }

  function finishImport(parts, mode, fname) {
    var before = { cases: content.cases.length, products: content.products.length, quiz: content.quiz.length };
    if (parts.config) {
      content.config = deepMerge(content.config, parts.config);
      delete parts.config;
    }
    content = prepare(SheetIO.applyImport(content, parts, mode));
    save();
    var v = Engine.validate(content);
    lastImport = {
      file: fname, mode: mode,
      msg: 'Imported ' + fname + ' (' + mode + '): cases ' + before.cases + ' → ' + content.cases.length +
        ', products ' + before.products + ' → ' + content.products.length + ', quiz ' + before.quiz + ' → ' + content.quiz.length + '.',
      warnings: (parts.warnings || []),
      errors: v.errors.length
    };
    render();
  }

  function report(msg, bad) {
    lastImport = { msg: msg, warnings: [], errors: bad ? 1 : 0, failed: bad };
    render();
  }

  /* ---------------- editor dialog ---------------- */
  var dlg = document.getElementById('editor');
  var onSave = null;
  function editJson(title, obj, cb, hint) {
    document.getElementById('editor-title').textContent = title;
    document.getElementById('editor-hint').textContent = hint || 'Edit the JSON and save. See CASE_FORMAT.md for every field.';
    document.getElementById('editor-text').value = JSON.stringify(obj, null, 2);
    document.getElementById('editor-error').textContent = '';
    onSave = cb;
    dlg.showModal();
  }
  document.getElementById('editor-save').addEventListener('click', function (ev) {
    var obj;
    try { obj = JSON.parse(document.getElementById('editor-text').value); } catch (e) {
      ev.preventDefault();
      document.getElementById('editor-error').textContent = 'Invalid JSON: ' + e.message;
      return;
    }
    if (onSave) onSave(obj);
    save();
    render();
  });

  /* ---------------- views ---------------- */
  function setView(v) {
    view = v;
    document.querySelectorAll('#nav button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-view') === v); });
    render();
  }

  function render() {
    var fn = VIEWS[view] || VIEWS.overview;
    main.innerHTML = fn();
    updateBadge();
  }

  function levelStats() {
    var c = normalized();
    return c.config.levels.map(function (l) {
      var pool = c.cases.filter(function (cs) { return cs.level === l.id; });
      var qpool = c.quiz.filter(function (q) { return q.level === l.id || q.level === 0; });
      var ch = { branch: 0, phone: 0, chat: 0 };
      pool.forEach(function (cs) { ch[cs.channel]++; });
      return { level: l, pool: pool.length, qpool: qpool.length, ch: ch };
    });
  }

  var VIEWS = {
    overview: function () {
      var v = Engine.validate(content);
      var f = content.config.features;
      var rows = levelStats().map(function (s) {
        return '<tr><td><b>' + s.level.id + '</b> · ' + esc(s.level.name) + '</td><td>' + s.pool + '</td><td>' + s.level.casesPerRun + '</td>' +
          '<td>' + s.ch.branch + ' / ' + s.ch.phone + ' / ' + s.ch.chat + '</td><td>' + (f.quiz ? s.qpool + ' (' + s.level.quizQuestions + ' per run)' : 'off') + '</td><td>' + s.level.passThreshold + '%</td>' +
          '<td><button class="btn btn-sm" data-act="preview-level" data-level="' + s.level.id + '">Play level</button></td></tr>';
      }).join('');
      return '<h1>' + esc(content.meta.title) + ' <small class="muted">v' + esc(content.meta.version || '') + '</small></h1>' +
        '<div class="cards">' +
        stat('Cases', content.cases.length) + stat('Products & procedures', content.products.length) + stat('Quiz questions', content.quiz.length) +
        stat('Validation', v.errors.length ? v.errors.length + ' errors' : v.warnings.length ? v.warnings.length + ' warnings' : 'OK', v.errors.length ? 'bad' : v.warnings.length ? 'warn' : 'ok') +
        '</div>' +
        '<h2>Levels</h2><table class="grid"><thead><tr><th>Level</th><th>Case pool</th><th>Cases per run</th><th>Branch / Phone / Chat</th><th>Quiz pool</th><th>Pass at</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<h2>Add-ons</h2><p>' + pill('Reference panel', f.referencePanel) + pill('Quiz', f.quiz) + pill('Customer walk-out', f.moodWalkout) + pill('Shuffle answers', f.shuffleOptions) + pill('Show time in report', f.showTimeInReport) +
        ' <button class="link" data-view-link="settings">change</button></p>' +
        '<h2>Workflow</h2><ol class="steps">' +
        '<li>Prepare cases with your enterprise Claude in the <b>Excel template</b> or the <b>JSON format</b> (CASE_FORMAT.md).</li>' +
        '<li><button class="link" data-view-link="import">Import</button> them (merge by id, or replace everything).</li>' +
        '<li>Check <button class="link" data-view-link="validation">Validation</button> and play cases with <i>Preview</i>.</li>' +
        '<li>Adjust levels, thresholds, scoring and add-ons.</li>' +
        '<li><b>Export SCORM package</b> and upload the zip to your LMS. Bump the version for every upload.</li></ol>';
    },

    import: function () {
      var li = lastImport ? '<div class="notice ' + (lastImport.failed ? 'bad' : lastImport.errors ? 'warn' : 'ok') + '">' + esc(lastImport.msg) +
        (lastImport.errors && !lastImport.failed ? ' Content now has ' + lastImport.errors + ' validation error(s) — see Validation.' : '') +
        (lastImport.warnings.length ? '<ul>' + lastImport.warnings.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>' : '') + '</div>' : '';
      return '<h1>Import / Export</h1>' + li +
        '<section class="panel"><h2>Import cases</h2>' +
        '<p>Accepted: <b>Excel (.xlsx)</b> with the template sheets, or <b>JSON</b> (a full content file, an array of cases, or a single case). Excel import needs internet once to load the spreadsheet library.</p>' +
        '<div class="form-row"><label>Mode <select id="imp-mode"><option value="merge">Merge: add new, replace same id</option><option value="replace">Replace: overwrite imported tables</option></select></label>' +
        '<label class="file-btn btn btn-primary">Choose file…<input type="file" id="imp-file" accept=".json,.js,.xlsx,.xls" hidden></label></div>' +
        '<p class="muted small">Replace only overwrites the tables present in the file (for example a workbook with only Cases/Nodes/Options keeps your products and quiz).</p></section>' +
        '<section class="panel"><h2>Templates</h2><div class="btn-row">' +
        '<button class="btn" data-act="xlsx-template">Download Excel template (with sample cases)</button>' +
        '<button class="btn" data-act="json-template">Download JSON sample</button></div></section>' +
        '<section class="panel"><h2>Export current content</h2><div class="btn-row">' +
        '<button class="btn" data-act="export-json">Content JSON</button>' +
        '<button class="btn" data-act="export-xlsx">Excel workbook</button>' +
        '<button class="btn" data-act="export-contentjs">content.js (for the player folder)</button>' +
        '<button class="btn btn-primary" data-act="export-scorm">SCORM package (.zip)</button></div></section>' +
        '<section class="panel danger"><h2>Start over</h2><p>Discard your changes and reload the built-in sample content.</p><button class="btn" data-act="reset">Reset to sample content</button></section>';
    },

    settings: function () {
      var groups = [
        ['Package', [
          ['meta.title', 'Title (shown in LMS)', 'text'],
          ['meta.packageId', 'Package id (latin letters, no spaces)', 'text'],
          ['meta.version', 'Version', 'text']
        ]],
        ['Branding', [
          ['config.theme.bankName', 'Bank name', 'text'],
          ['config.theme.logoText', 'Logo text', 'text'],
          ['config.theme.productName', 'Game name', 'text'],
          ['config.theme.primary', 'Primary color', 'color'],
          ['config.theme.primaryDark', 'Header / dark color', 'color'],
          ['config.theme.accent', 'Accent color', 'color'],
          ['config.theme.background', 'Background', 'color']
        ]],
        ['Add-ons', [
          ['config.features.referencePanel', 'Reference panel (product catalog during cases)', 'bool'],
          ['config.features.quiz', 'Separate knowledge quiz questions', 'bool'],
          ['config.features.quizPlacement', 'Quiz placement', 'select', [['between', 'Between customers'], ['end', 'At the end of each level']]],
          ['config.features.moodWalkout', 'Customer can walk out (already angry + another bad answer)', 'bool'],
          ['config.features.shuffleOptions', 'Shuffle answer order (recommended for evaluation)', 'bool'],
          ['config.features.showTimeInReport', 'Show response times to the employee in the final report', 'bool']
        ]],
        ['Channel', [
          ['config.channel', 'Channel used for cases', 'select', [['case', 'Per case (as tagged)'], ['branch', 'All cases: branch'], ['phone', 'All cases: phone'], ['chat', 'All cases: chat']]]
        ]],
        ['Scoring & LMS', [
          ['config.scoring.criticalPenalty', 'Critical error penalty (percentage points off that skill)', 'number'],
          ['config.scoring.criticalFailsLevel', 'Any critical error fails the level (recommended for evaluation)', 'bool'],
          ['config.scoring.balanceCategories', 'Balance random draw across case categories', 'bool'],
          ['config.scorm.statusMode', 'LMS status at the end of the evaluation', 'select', [['completed', 'completed (score decides)'], ['passed_failed', 'passed / failed (all levels passed?)']]]
        ]]
      ];
      return '<h1>Settings &amp; add-ons</h1>' + groups.map(function (g) {
        return '<section class="panel"><h2>' + g[0] + '</h2><div class="fields">' + g[1].map(field).join('') + '</div></section>';
      }).join('');
    },

    levels: function () {
      var stats = levelStats();
      var rows = content.config.levels.map(function (l, i) {
        var s = stats[i];
        return '<tr>' +
          '<td><input type="number" data-level="' + i + '" data-key="id" value="' + esc(l.id) + '" class="w-xs"></td>' +
          '<td><input data-level="' + i + '" data-key="name" value="' + esc(l.name) + '"></td>' +
          '<td><input data-level="' + i + '" data-key="description" value="' + esc(l.description || '') + '" class="w-lg"></td>' +
          '<td><input type="number" min="1" data-level="' + i + '" data-key="casesPerRun" value="' + esc(l.casesPerRun) + '" class="w-xs"> <small class="muted">of ' + s.pool + '</small></td>' +
          '<td><input type="number" min="0" data-level="' + i + '" data-key="quizQuestions" value="' + esc(l.quizQuestions || 0) + '" class="w-xs"> <small class="muted">of ' + s.qpool + '</small></td>' +
          '<td><input type="number" min="0" max="100" data-level="' + i + '" data-key="passThreshold" value="' + esc(l.passThreshold) + '" class="w-xs">%</td>' +
          '<td><input type="number" min="0" max="100" data-level="' + i + '" data-key="skillFloor" value="' + esc(l.skillFloor || 0) + '" class="w-xs">%</td>' +
          '<td><button class="btn btn-sm" data-act="level-del" data-i="' + i + '">Remove</button></td></tr>';
      }).join('');
      return '<h1>Levels</h1><p class="muted">Each level draws <i>cases per run</i> random cases from the cases tagged with that level id. See the pass rule below the table. The evaluation stops at the first failed level.</p>' +
        '<table class="grid"><thead><tr><th>Id</th><th>Name</th><th>Description</th><th>Cases per run</th><th>Quiz questions</th><th>Pass at</th><th>Skill floor</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<div class="btn-row"><button class="btn" data-act="level-add">Add level</button></div>' +
        '<p class="muted small">Pass rule: level average ≥ <i>Pass at</i>, no critical errors (if enabled in Settings), and every skill with at least 6 scored decisions on that level ≥ <i>Skill floor</i> (0 = off). Recommended for a defensible result: 4–6 cases per run and a pool of at least 3× that.</p>';
    },

    cases: function () {
      var c = normalized();
      var levels = c.config.levels.map(function (l) { return l.id; });
      var list = c.cases.filter(function (cs) { return !caseFilter || String(cs.level) === caseFilter; });
      var rows = list.map(function (cs) {
        var mx = Engine.caseMax(cs);
        var crit = 0;
        Object.keys(cs.nodes).forEach(function (n) { cs.nodes[n].options.forEach(function (o) { if (o.critical) crit++; }); });
        return '<tr><td><code>' + esc(cs.id) + '</code></td><td>' + esc(cs.title) + '<br><small class="muted">' + esc(cs.category || '') + '</small></td>' +
          '<td>' + cs.level + (levels.indexOf(cs.level) < 0 ? ' <span class="badge warn">no level</span>' : '') + '</td><td>' + cs.channel + '</td>' +
          '<td>' + Object.keys(cs.nodes).length + '</td><td>' + mx.knowledge + ' / ' + mx.service + ' / ' + mx.sales + '</td><td>' + cs.opportunities.length + '</td><td>' + crit + '</td>' +
          '<td class="nowrap"><button class="btn btn-sm" data-act="preview-case" data-id="' + esc(cs.id) + '">Preview</button> ' +
          '<button class="btn btn-sm" data-act="case-edit" data-id="' + esc(cs.id) + '">Edit</button> ' +
          '<button class="btn btn-sm" data-act="case-del" data-id="' + esc(cs.id) + '">Delete</button></td></tr>';
      }).join('');
      return '<h1>Cases <small class="muted">' + c.cases.length + '</small></h1>' +
        '<div class="form-row"><label>Level <select id="case-filter"><option value="">All</option>' + levels.map(function (l) { return '<option' + (String(l) === caseFilter ? ' selected' : '') + '>' + l + '</option>'; }).join('') + '</select></label>' +
        '<button class="btn" data-act="case-add">New case</button></div>' +
        '<table class="grid"><thead><tr><th>Id</th><th>Title</th><th>Level</th><th>Channel</th><th>Nodes</th><th>Max K / S / Sales</th><th>Sales opps</th><th>Critical opts</th><th></th></tr></thead><tbody>' +
        (rows || '<tr><td colspan="9" class="muted">No cases</td></tr>') + '</tbody></table>' +
        '<p class="muted small">Max = points on the ideal path (best answer at every step). A skill with max 0 in a case does not count for that case.</p>';
    },

    products: function () {
      var rows = content.products.map(function (p) {
        return '<tr><td><code>' + esc(p.id) + '</code></td><td>' + esc(p.type || 'product') + '</td><td>' + esc(p.category || '') + '</td><td>' + esc(p.name) + '<br><small class="muted">' + esc(p.short || '') + '</small></td><td>' + (p.conditions || []).length + '</td>' +
          '<td class="nowrap"><button class="btn btn-sm" data-act="prod-edit" data-id="' + esc(p.id) + '">Edit</button> <button class="btn btn-sm" data-act="prod-del" data-id="' + esc(p.id) + '">Delete</button></td></tr>';
      }).join('');
      return '<h1>Products &amp; procedures <small class="muted">' + content.products.length + '</small></h1>' +
        '<p class="muted">Shown in the in-game reference panel (if enabled) and used as choices in "product" steps. Type <code>procedure</code> items appear in the reference panel only.</p>' +
        '<div class="btn-row"><button class="btn" data-act="prod-add">New product</button></div>' +
        '<table class="grid"><thead><tr><th>Id</th><th>Type</th><th>Category</th><th>Name</th><th>Conditions</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>';
    },

    quiz: function () {
      var rows = content.quiz.map(function (q) {
        return '<tr><td><code>' + esc(q.id) + '</code></td><td>' + (q.level || 'any') + '</td><td>' + esc(q.question) + '<br><small class="muted">✓ ' + esc((q.options || [])[q.correct || 0]) + '</small></td><td>' + (q.points || 1) + '</td>' +
          '<td class="nowrap"><button class="btn btn-sm" data-act="preview-quiz" data-id="' + esc(q.id) + '">Preview</button> <button class="btn btn-sm" data-act="quiz-edit" data-id="' + esc(q.id) + '">Edit</button> <button class="btn btn-sm" data-act="quiz-del" data-id="' + esc(q.id) + '">Delete</button></td></tr>';
      }).join('');
      return '<h1>Quiz questions <small class="muted">' + content.quiz.length + '</small></h1>' +
        (content.config.features.quiz ? '' : '<div class="notice warn">The quiz add-on is switched off in Settings — these questions will not be shown.</div>') +
        '<p class="muted">Level 0 = can be drawn on any level. Correct answers add to the <b>Product knowledge</b> score.</p>' +
        '<div class="btn-row"><button class="btn" data-act="quiz-add">New question</button></div>' +
        '<table class="grid"><thead><tr><th>Id</th><th>Level</th><th>Question</th><th>Points</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>';
    },

    validation: function () {
      var v = Engine.validate(content);
      var li = function (x) { return '<li>' + esc(x) + '</li>'; };
      return '<h1>Validation</h1>' +
        (v.errors.length ? '<h2 class="bad-text">Errors (' + v.errors.length + ')</h2><ul class="vlist bad">' + v.errors.map(li).join('') + '</ul>' : '<div class="notice ok">No errors.</div>') +
        (v.warnings.length ? '<h2>Warnings (' + v.warnings.length + ')</h2><ul class="vlist warn">' + v.warnings.map(li).join('') + '</ul>' : '');
    }
  };

  function stat(label, value, cls) {
    return '<div class="stat ' + (cls || '') + '"><span>' + label + '</span><b>' + esc(value) + '</b></div>';
  }
  function pill(label, on) { return '<span class="pill ' + (on ? 'on' : 'off') + '">' + label + ': ' + (on ? 'on' : 'off') + '</span> '; }

  function field(f) {
    var path = f[0], label = f[1], type = f[2];
    var val = SheetIO.get(content, path);
    var input;
    if (type === 'bool') input = '<input type="checkbox" data-path="' + path + '"' + (val ? ' checked' : '') + '>';
    else if (type === 'select') input = '<select data-path="' + path + '">' + f[3].map(function (o) { return '<option value="' + o[0] + '"' + (val === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
    else if (type === 'color') input = '<span class="color"><input type="color" data-path="' + path + '" value="' + esc(val || '#000000') + '"><code>' + esc(val) + '</code></span>';
    else input = '<input type="' + (type === 'number' ? 'number' : 'text') + '" data-path="' + path + '" value="' + esc(val == null ? '' : val) + '">';
    return '<label class="field ' + (type === 'bool' ? 'field-bool' : '') + '"><span>' + label + '</span>' + input + '</label>';
  }

  /* ---------------- templates for new items ---------------- */
  function newCaseTemplate() {
    var n = content.cases.length + 1;
    return {
      id: 'NEW' + n, title: 'ახალი ქეისი', level: (content.config.levels[0] || { id: 1 }).id, channel: 'branch', category: '',
      brief: 'კლიენტი მოვიდა ფილიალში.',
      customer: { name: 'კლიენტი', gender: 'f', age: 35, segment: '', occupation: '', income: '', productsHeld: [], digital: '', notes: '', initialMood: 0 },
      opportunities: [],
      start: 'n1',
      nodes: {
        n1: {
          say: 'გამარჯობა!',
          options: [
            { text: 'საუკეთესო პასუხი', next: 'end_ok', scores: { knowledge: 1, service: 2, sales: 0 }, mood: 1, feedback: '' },
            { text: 'სუსტი პასუხი', next: 'end_ok', scores: { knowledge: 0, service: -1, sales: 0 }, mood: -1, feedback: '' }
          ]
        },
        end_ok: { end: true, outcome: 'resolved', say: 'მადლობა!' }
      }
    };
  }

  function findIndex(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return i; return -1; }

  function upsert(listName, oldId) {
    return function (obj) {
      var list = content[listName];
      var i = oldId != null ? findIndex(list, oldId) : -1;
      if (i >= 0) list[i] = obj;
      else {
        var j = findIndex(list, obj.id);
        if (j >= 0) list[j] = obj; else list.push(obj);
      }
    };
  }

  /* ---------------- events ---------------- */
  var ACTIONS = {
    'export-scorm': exportScorm,
    'preview-full': function () { openPreview('reset'); },
    'preview-case': function (el) { openPreview('preview=' + encodeURIComponent(el.getAttribute('data-id'))); },
    'preview-quiz': function (el) { openPreview('preview=' + encodeURIComponent(el.getAttribute('data-id'))); },
    'preview-level': function (el) { openPreview('previewLevel=' + el.getAttribute('data-level')); },
    'xlsx-template': function () { exportExcel(true); },
    'json-template': function () { download('simulator_sample.json', JSON.stringify(window.DEFAULT_CONTENT, null, 2), 'application/json'); },
    'export-json': function () { download(slug(content.meta.packageId) + '_content.json', JSON.stringify(content, null, 2), 'application/json'); },
    'export-xlsx': function () { exportExcel(false); },
    'export-contentjs': function () { download('content.js', contentJs(content), 'text/javascript'); },
    'reset': function () {
      if (!confirm('Discard all changes and load the sample content?')) return;
      content = prepare(window.DEFAULT_CONTENT);
      lastImport = null;
      save();
      render();
    },
    'level-add': function () {
      var max = content.config.levels.reduce(function (m, l) { return Math.max(m, Number(l.id) || 0); }, 0);
      content.config.levels.push({ id: max + 1, name: 'დონე ' + (max + 1), description: '', casesPerRun: 4, quizQuestions: 0, passThreshold: 70, skillFloor: 0 });
      save(); render();
    },
    'level-del': function (el) {
      if (content.config.levels.length <= 1) return alert('At least one level is required.');
      content.config.levels.splice(Number(el.getAttribute('data-i')), 1);
      save(); render();
    },
    'case-add': function () { editJson('New case', newCaseTemplate(), upsert('cases')); },
    'case-edit': function (el) {
      var id = el.getAttribute('data-id');
      editJson('Edit case ' + id, content.cases[findIndex(content.cases, id)], upsert('cases', id));
    },
    'case-del': function (el) {
      var id = el.getAttribute('data-id');
      if (!confirm('Delete case ' + id + '?')) return;
      content.cases.splice(findIndex(content.cases, id), 1);
      save(); render();
    },
    'prod-add': function () { editJson('New product', { id: 'P_NEW', type: 'product', category: '', name: '', short: '', conditions: [{ label: '', value: '' }] }, upsert('products')); },
    'prod-edit': function (el) { var id = el.getAttribute('data-id'); editJson('Edit ' + id, content.products[findIndex(content.products, id)], upsert('products', id)); },
    'prod-del': function (el) {
      var id = el.getAttribute('data-id');
      if (!confirm('Delete ' + id + '?')) return;
      content.products.splice(findIndex(content.products, id), 1);
      save(); render();
    },
    'quiz-add': function () { editJson('New question', { id: 'Q' + (content.quiz.length + 1), level: 0, question: '', options: ['', '', '', ''], correct: 0, points: 2, explanation: '' }, upsert('quiz')); },
    'quiz-edit': function (el) { var id = el.getAttribute('data-id'); editJson('Edit ' + id, content.quiz[findIndex(content.quiz, id)], upsert('quiz', id), 'correct = index of the right option, starting at 0.'); },
    'quiz-del': function (el) {
      var id = el.getAttribute('data-id');
      if (!confirm('Delete ' + id + '?')) return;
      content.quiz.splice(findIndex(content.quiz, id), 1);
      save(); render();
    }
  };

  document.addEventListener('click', function (ev) {
    var nav = ev.target.closest('#nav button');
    if (nav) return setView(nav.getAttribute('data-view'));
    var link = ev.target.closest('[data-view-link]');
    if (link) return setView(link.getAttribute('data-view-link'));
    var el = ev.target.closest('[data-act]');
    if (el && ACTIONS[el.getAttribute('data-act')]) ACTIONS[el.getAttribute('data-act')](el);
  });

  main.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.id === 'imp-file' && t.files[0]) {
      importFile(t.files[0], document.getElementById('imp-mode').value);
      t.value = '';
      return;
    }
    if (t.id === 'case-filter') { caseFilter = t.value; render(); return; }
    var path = t.getAttribute('data-path');
    if (path) {
      var v = t.type === 'checkbox' ? t.checked : t.type === 'number' ? Number(t.value) : t.value;
      SheetIO.set(content, path, v);
      save();
      if (t.type === 'color') render();
      return;
    }
    var li = t.getAttribute('data-level');
    if (li != null) {
      var key = t.getAttribute('data-key');
      content.config.levels[Number(li)][key] = t.type === 'number' ? Number(t.value) : t.value;
      save();
      render();
    }
  });

  window.Builder = { content: function () { return content; }, singleHtml: function () { return singleHtml(content); } };

  load();
  render();
  updateBadge();
})();
