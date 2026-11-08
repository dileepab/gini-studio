# GINI Custom Studio

Customers pick a garment, colour, design and size, see a live mockup, and send the order on WhatsApp.

Live: https://dileepab.github.io/gini-studio/

This repo is the built site. The source lives on Dileepa's Mac in `TikTokBrand/07_web/gini_designer/` (`index.html`, `prep_assets.py`, `build_site.py`); update steps are in `CUSTOM_STUDIO_UPDATE.md` there.

- `b/` garment base photos (900x1205)
- `p/` print images, `t/` thumbnails

## Updating
1. Edit the page source on the Mac: TikTokBrand/07_web/gini_designer/index.html (new prints in p/, thumbs in t/, bases in b/).
2. `python3 build_from_page.py <path to page index.html>` rebuilds this index.html (keeps head, adds PWA tags + service worker).
3. If image files were replaced under the same name, bump `CACHE` in sw.js.
4. Commit and push to main; GitHub Pages serves it.

## App (PWA)
manifest.webmanifest + sw.js + icons make the site installable ("Add to Home Screen" on iPhone, "Install app" on Android Chrome). It works offline for pages and images already seen.
