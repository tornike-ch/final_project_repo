#!/usr/bin/env python3
"""
Builds a single-file *review* copy of the game (for sharing as a web page):
  python3 tools/make_review_page.py <output.html>

Differences from the SCORM package:
- neutral "sample bank" branding (no real bank name or logo)
- a review strip: jump to any case / level / quiz question, restart, and an
  optional overlay that shows each answer's scores
- no doctype/html/head/body tags (the hosting page adds them)
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PLAYER = ROOT / "player"


def load_content():
    text = (PLAYER / "data/content.js").read_text(encoding="utf-8")
    body = re.sub(r"^\s*window\.SIM_CONTENT\s*=\s*", "", text)
    return json.loads(re.sub(r";\s*$", "", body.strip()))


REVIEW_CSS = """
.review-strip { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; padding: 8px max(16px, env(safe-area-inset-right, 0px)) 8px max(16px, env(safe-area-inset-left, 0px));
  background: #26313D; color: #E8EEF3; font-size: 13px; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
.review-strip b { letter-spacing: .6px; font-size: 11px; text-transform: uppercase; color: #9FD3E6; }
.review-strip label { display: inline-flex; gap: 6px; align-items: center; }
.review-strip select { max-width: min(420px, 70vw); padding: 4px 8px; border-radius: 6px; border: 1px solid #4A5866; background: #fff; color: #1B2733; font: inherit; }
.review-strip button { padding: 4px 10px; border-radius: 6px; border: 1px solid #4A5866; background: transparent; color: #E8EEF3; font: inherit; cursor: pointer; }
.review-strip button:hover { border-color: #9FD3E6; }
.review-strip .hint { color: #A9B6C2; }
.topbar { top: env(safe-area-inset-top, 0px); }
.app:has(> .ws) { height: calc(100dvh - 44px); }
@media (max-width: 860px) { .app:has(> .ws) { height: auto; } }
.score-tag { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; font-size: 11.5px; font-family: system-ui, sans-serif; }
.score-tag span { padding: 1px 7px; border-radius: 999px; background: #EEF2F6; color: #36414D; border: 1px solid #D3DBE3; }
.score-tag .best { background: #DFF3E8; color: #146B42; border-color: #A9DCC0; }
.score-tag .crit { background: #FBE3E3; color: #9C2B2B; border-color: #EDB4B4; }
.score-tag .pos { color: #146B42; }
.score-tag .neg { color: #9C2B2B; }
"""

REVIEW_JS = r"""
(function () {
  var C = window.SimApp.content;
  function esc(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var strip = document.createElement('div');
  strip.className = 'review-strip';
  var opts = '<option value="">Jump to…</option>' +
    '<optgroup label="Whole game"><option value="restart">Restart the evaluation from level 1 (clears progress)</option></optgroup>' +
    '<optgroup label="Levels">' + C.config.levels.map(function (l) {
      return '<option value="level:' + esc(l.id) + '">Level ' + esc(l.id) + ' · ' + esc(l.name) + ' (random draw)</option>';
    }).join('') + '</optgroup>' +
    '<optgroup label="Cases">' + C.cases.map(function (c) {
      return '<option value="case:' + esc(c.id) + '">' + esc(c.id) + ' · ' + esc(c.title) + ' · L' + esc(c.level) + ' · ' + esc(c.channel) + '</option>';
    }).join('') + '</optgroup>' +
    (C.quiz.length ? '<optgroup label="Quiz questions">' + C.quiz.map(function (q) {
      return '<option value="case:' + esc(q.id) + '">' + esc(q.id) + ' · ' + esc(String(q.question).slice(0, 60)) + '</option>';
    }).join('') + '</optgroup>' : '');
  strip.innerHTML = '<b>Review build</b><label for="rv-jump">Go to</label><select id="rv-jump">' + opts + '</select>' +
    '<label><input type="checkbox" id="rv-scores"> Show answer scores</label>' +
    '<span class="hint">Leave feedback as comments on this page.</span>';
  document.body.insertBefore(strip, document.body.firstChild);

  strip.querySelector('#rv-jump').addEventListener('change', function (e) {
    var v = e.target.value;
    e.target.value = '';
    if (!v) return;
    if (v === 'restart') return window.SimApp.restart();
    if (v.indexOf('level:') === 0) return window.SimApp.jump({ level: Number(v.slice(6)) });
    window.SimApp.jump(v.slice(5));
  });

  var showScores = false;
  try { showScores = localStorage.getItem('rv-scores') === '1'; } catch (e) { /* ignore */ }
  var box = strip.querySelector('#rv-scores');
  box.checked = showScores;
  box.addEventListener('change', function () {
    showScores = box.checked;
    try { localStorage.setItem('rv-scores', showScores ? '1' : '0'); } catch (e) { /* ignore */ }
    decorate();
  });

  var NAMES = { knowledge: 'Knowledge', service: 'Service', sales: 'Sales' };
  function decorate() {
    document.querySelectorAll('.score-tag').forEach(function (t) { if (!showScores) t.remove(); });
    if (!showScores) return;
    var cur = window.SimApp.current && window.SimApp.current();
    var buttons = document.querySelectorAll('#choices .opt[data-act="choose"]');
    if (cur && buttons.length) {
      var node = cur.node();
      buttons.forEach(function (b) {
        if (b.querySelector('.score-tag')) return;
        var o = node.options[Number(b.getAttribute('data-i'))];
        if (!o) return;
        var v = window.Engine.verdict(node, o);
        var parts = ['knowledge', 'service', 'sales'].map(function (k) {
          var n = (o.scores && o.scores[k]) || 0;
          return '<span class="' + (n > 0 ? 'pos' : n < 0 ? 'neg' : '') + '">' + NAMES[k] + ' ' + (n > 0 ? '+' : '') + n + '</span>';
        });
        if (o.mood) parts.push('<span>Mood ' + (o.mood > 0 ? '+' : '') + o.mood + '</span>');
        if (v === 'best') parts.unshift('<span class="best">Best</span>');
        if (o.critical) parts.unshift('<span class="crit">Critical: ' + NAMES[o.critical.skill] + '</span>');
        if (o.opportunity) parts.push('<span>Captures ' + esc(o.opportunity) + '</span>');
        var tag = document.createElement('span');
        tag.className = 'score-tag';
        tag.innerHTML = parts.join('');
        b.querySelector('.opt-text').appendChild(tag);
      });
    }
    var qz = window.SimApp.quiz && window.SimApp.quiz();
    document.querySelectorAll('.quiz .opt').forEach(function (b) {
      if (!qz || b.querySelector('.score-tag')) return;
      if (Number(b.getAttribute('data-i')) === qz.q.correct) {
        var t = document.createElement('span');
        t.className = 'score-tag';
        t.innerHTML = '<span class="best">Correct · ' + qz.q.points + ' pts</span>';
        b.querySelector('.opt-text').appendChild(t);
      }
    });
  }
  new MutationObserver(function () { if (showScores) decorate(); }).observe(document.getElementById('app'), { childList: true, subtree: true });
})();
"""


def main():
    out = pathlib.Path(sys.argv[1])
    content = load_content()
    content["config"]["theme"].update({
        "bankName": "სანიმუშო ბანკი",
        "logoText": "BANK",
        "primary": "#1D7A8C",
        "primaryDark": "#14303D",
        "accent": "#C0802A",
        "background": "#F1F4F6",
    })
    content["meta"]["packageId"] = "service-simulator-review"

    def js(name):
        return (PLAYER / name).read_text(encoding="utf-8").replace("</script", "<\\/script")

    content_js = "window.SIM_CONTENT = " + json.dumps(content, ensure_ascii=False).replace("</", "<\\/") + ";"
    page = "\n".join([
        "<title>Bank Service Simulator</title>",
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap">',
        "<style>" + (PLAYER / "css/style.css").read_text(encoding="utf-8") + REVIEW_CSS + "</style>",
        '<div id="app" class="app"><main class="screen center"><section class="card"><p>იტვირთება…</p></section></main></div>',
        "<script>window.SIM_ALLOW_STANDALONE = true;</script>",
        "<script>" + content_js + "</script>",
        "<script>" + js("js/scorm.js") + "</script>",
        "<script>" + js("js/engine.js") + "</script>",
        "<script>" + js("js/micah.js") + "</script>",
        "<script>" + js("js/avatar.js") + "</script>",
        "<script>" + js("js/app.js") + "</script>",
        "<script>" + REVIEW_JS + "</script>",
    ])
    out.write_text(page, encoding="utf-8")
    print(out, len(page) // 1024, "KB")


if __name__ == "__main__":
    main()
