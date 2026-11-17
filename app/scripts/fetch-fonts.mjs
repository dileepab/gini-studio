// One-off: download the Google Fonts the page uses into vendor/fonts so the app works fully offline.
// Run again only if the page starts using different fonts:  node scripts/fetch-fonts.mjs
import fs from "node:fs"; import path from "node:path";
const CSS_URL = "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Instrument+Sans:wght@400;500;600&family=Noto+Sans+Sinhala:wght@400;600&display=swap";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const out = new URL("../vendor/fonts/", import.meta.url).pathname;
fs.mkdirSync(out, { recursive: true });
let css = await (await fetch(CSS_URL, { headers: { "User-Agent": UA } })).text();
const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]))];
for (const u of urls) {
  const name = u.split("/").slice(-3).join("_");
  fs.writeFileSync(path.join(out, name), Buffer.from(await (await fetch(u)).arrayBuffer()));
  css = css.split(u).join("fonts/" + name);
}
fs.writeFileSync(path.join(out, "..", "fonts.css"), css);
console.log("fonts:", urls.length);
