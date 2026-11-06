#!/usr/bin/env python3
"""Build public/index.html (the site) from src/site/: index.html + app.css + copy.js + app.js.

Run from anywhere:  python3 invite_site/tools/build_site.py
The result is one self-contained file, so it also works opened straight from disk.
"""
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
src = root / 'src' / 'site'
page = (src / 'index.html').read_text()
css = (src / 'app.css').read_text()
js = (src / 'app.js').read_text().replace('/*COPY*/', (src / 'copy.js').read_text())
assert page.count('/*APP_CSS*/') == 1 and page.count('/*APP_JS*/') == 1
out = page.replace('/*APP_CSS*/', css).replace('/*APP_JS*/', js)
(root / 'public' / 'index.html').write_text(out)
print('built public/index.html', round(len(out.encode()) / 1024), 'KB')
