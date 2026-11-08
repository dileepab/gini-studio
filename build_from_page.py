"""Rebuild index.html from the Custom Studio page source (index.html of 07_web/gini_designer).
Usage: python3 build_from_page.py <page.html>
Keeps the site head (charset, viewport, reset), adds PWA tags + service worker registration."""
import sys
page = open(sys.argv[1], encoding="utf-8").read()
old = open("index.html", encoding="utf-8").read()
head = old[:old.index("<title>")]
PWA = ('<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color" content="#151211">\n'
       '<link rel="icon" type="image/png" href="favicon.png">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
       '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'
       '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="apple-mobile-web-app-title" content="GINI Studio">\n')
if 'rel="manifest"' not in head: head += PWA
SW = '<script>if("serviceWorker" in navigator) addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));</script>\n'
body = page[page.index("<title>"):].rstrip()
if body.endswith("</html>"): body = body[:-7].rstrip()
open("index.html", "w", encoding="utf-8").write(head + body + "\n" + SW + "</html>\n")
print("built index.html")
