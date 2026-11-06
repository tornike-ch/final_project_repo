#!/usr/bin/env python3
"""Inline src/story.css, src/story.js and the story markup into public/index.html.

Run from anywhere:  python3 invite_site/tools/build_story.py
The page stays one self-contained file (it is also served for /e/<code> links, where
relative asset paths would break). Re-running replaces the previous copy between markers.
"""
import pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
page = root / 'public' / 'play.html'
css = (root / 'src' / 'story.css').read_text()
js = (root / 'src' / 'story.js').read_text()
peeps = (root / 'src' / 'peeps.json').read_text().strip()
assert js.count('/*PEEPS*/null') == 1
js = js.replace('/*PEEPS*/null', peeps)

HTML = '''<!--story:html-->
  <section class="story" id="story">
    <div class="st-pin">
      <div class="st-sky" aria-hidden="true"><i class="d"></i><i class="n"></i></div>
      <svg class="st-world" id="stWorld" aria-hidden="true" focusable="false"></svg>
      <div class="st-grain" aria-hidden="true"></div>
      <button type="button" class="st-orb" id="stOrb"></button>
      <p class="st-orb-tip" aria-hidden="true"></p>
      <div class="st-cards" id="stCards" aria-live="polite"></div>
      <div class="st-ui">
        <ol class="st-dots"></ol>
        <a class="st-skip" href="#goal"></a>
      </div>
      <p class="st-hint" aria-hidden="true"><span></span><i></i></p>
    </div>
  </section>
<!--/story:html-->'''

s = page.read_text()

def put(s, start, end, body, anchor, before=True):
    pat = re.compile(re.escape(start) + r'.*?' + re.escape(end), re.S)
    block = start + body + end
    if pat.search(s):
        return pat.sub(lambda m: block, s, count=1)
    assert s.count(anchor) == 1, anchor
    return s.replace(anchor, block + '\n' + anchor if before else anchor + '\n' + block)

s = put(s, '/* story:css */', '/* /story:css */', '\n' + css + '\n', '</style>\n</head>')
pat = re.compile(r'<!--story:html-->.*?<!--/story:html-->', re.S)
if pat.search(s):
    s = pat.sub(lambda m: HTML, s, count=1)
else:
    a = '  <section class="scene hero" id="goal">'
    assert s.count(a) == 1
    s = s.replace(a, HTML + '\n\n' + a)
s = put(s, '<script id="story-js">', '</script>', '\n' + js + '\n', '</body>')
page.write_text(s)
print('story inlined into', page.relative_to(root.parent))
