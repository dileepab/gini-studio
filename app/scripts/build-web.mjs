// Builds app/www from the Custom Studio site in the repo root (the same files GitHub Pages serves).
// - copies index.html + garment bases (b/), prints (p/), thumbs (t/)
// - swaps Google Fonts for local copies (works with no internet)
// - drops the service worker and web-manifest tags (the app already has every file inside it)
// - adds native/native.js + native.css (WhatsApp in the WhatsApp app, share/save mockup, back button, haptics)
// Run: npm run web   (npm run sync also runs it)
import fs from "node:fs"; import path from "node:path";
const app = path.dirname(new URL("..", import.meta.url).pathname + "x");
const root = path.join(app, "..");
const www = path.join(app, "www");
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });
for (const d of ["b", "p", "t"]) fs.cpSync(path.join(root, d), path.join(www, d), { recursive: true });
fs.cpSync(path.join(app, "vendor", "fonts"), path.join(www, "fonts"), { recursive: true });
fs.copyFileSync(path.join(app, "vendor", "fonts.css"), path.join(www, "fonts.css"));
for (const f of ["native.js", "native.css"]) fs.copyFileSync(path.join(app, "native", f), path.join(www, f));

let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const must = (re, what) => { if (!re.test(html)) throw new Error("index.html changed, could not find: " + what); };
must(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, "Google Fonts link");
html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\n?/, "")
  .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link rel="stylesheet" href="fonts.css">\n<link rel="stylesheet" href="native.css">')
  .replace(/<link rel="manifest"[^>]*>\n?/, "")
  .replace(/<link rel="(apple-touch-icon|icon)"[^>]*>\n?/g, "")
  .replace(/<script>if\("serviceWorker"[^<]*<\/script>\n?/, "")
  .replace(/<\/html>\s*$/, '<script src="native.js"></script>\n</html>\n');
// Personal prints never go in the app (they are not in the public site either; this is a safety check).
if (/personal_dileepa|personal/i.test(fs.readdirSync(path.join(www, "p")).join(" "))) throw new Error("personal print found in p/");
fs.writeFileSync(path.join(www, "index.html"), html);
const files = d => fs.readdirSync(path.join(www, d)).length;
console.log(`www ready: ${files("b")} bases, ${files("p")} prints, ${files("t")} thumbs`);
