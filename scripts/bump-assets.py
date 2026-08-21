#!/usr/bin/env python3
"""
Bump the ?v= cache-busting query on css/js across every HTML page.

GitHub Pages serves CSS and JS with caching that outlives a push, so a visitor
who has been on the site before can keep running the old files — which is
exactly how a broken build looks like a working one. Run this before pushing
any change to css/ or js/:

    python3 scripts/bump-assets.py
"""
import re
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def main():
    v = str(int(time.time()))
    total_js = total_css = 0
    for page in sorted(ROOT.glob("*.html")):
        s = page.read_text()
        s, n1 = re.subn(r'(src="js/[a-z-]+\.js)(\?v=\d+)?', r'\1?v=' + v, s)
        s, n2 = re.subn(r'(href="css/[a-z-]+\.css)(\?v=\d+)?', r'\1?v=' + v, s)
        page.write_text(s)
        total_js += n1
        total_css += n2
        print(f"{page.name}: {n1} script(s), {n2} stylesheet(s)")
    print(f"bumped {total_js} script(s) and {total_css} stylesheet(s) to v={v}")

if __name__ == "__main__":
    main()
