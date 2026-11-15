// Makes the source images for app icons + splash from the GINI wordmark (brand/gini_logo_on-dark.svg).
// Output in assets/ is then turned into every Android/iOS size by `capacitor-assets generate` (npm run icons).
import sharp from "sharp"; import fs from "node:fs";
const BG = "#111111";
const svg = fs.readFileSync(new URL("../brand/gini_logo_on-dark.svg", import.meta.url));
fs.mkdirSync(new URL("../assets/", import.meta.url), { recursive: true });
const out = f => new URL("../assets/" + f, import.meta.url).pathname;
async function logo(width) { const t = await sharp(svg, { density: 900 }).png().trim().toBuffer(); return sharp(t).resize({ width }).png().toBuffer(); }
async function onSquare(size, logoW, file, bg = BG) {
  const l = await logo(logoW); const m = await sharp(l).metadata();
  const base = bg ? { r: 17, g: 17, b: 17, alpha: 1 } : { r: 0, g: 0, b: 0, alpha: 0 };
  await sharp({ create: { width: size, height: size, channels: 4, background: base } })
    .composite([{ input: l, left: Math.round((size - m.width) / 2), top: Math.round((size - m.height) / 2) }])
    .png().toFile(out(file));
}
await onSquare(1024, 700, "icon-only.png");                 // iOS icon + legacy Android icon
await onSquare(1024, 520, "icon-foreground.png", null);     // Android adaptive icon (safe zone = middle 66%)
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BG } }).png().toFile(out("icon-background.png"));
await onSquare(2732, 1000, "splash.png");
await onSquare(2732, 1000, "splash-dark.png");
console.log("brand assets ready in app/assets/");
