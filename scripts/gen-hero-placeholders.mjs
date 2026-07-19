// Hero-format placeholders for the carousel slides (beyond rav4-hero.webp).
// Contract: public/vehicles/{slug}-hero.webp, 1920×1080 — real photography
// replaces these files with no code changes.
import sharp from "sharp";
import path from "node:path";

const dir = path.join(import.meta.dirname, "..", "public", "vehicles");

const silhouette = (fill, wheel) => `
  <g>
    <path fill="${fill}" d="M40,250 L40,205 Q40,185 65,180 L170,160
      Q260,80 360,74 L560,74 Q660,80 730,150 L830,172
      Q860,178 860,200 L860,250 Q860,258 850,258 L50,258 Q40,258 40,250 Z"/>
    <circle cx="235" cy="248" r="52" fill="${wheel}"/>
    <circle cx="235" cy="248" r="24" fill="${fill}"/>
    <circle cx="680" cy="248" r="52" fill="${wheel}"/>
    <circle cx="680" cy="248" r="24" fill="${fill}"/>
  </g>`;

const hero = (name) => `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <rect width="1920" height="1080" fill="#FFFFFF"/>
  <g transform="translate(430 340) scale(1.2)">${silhouette("#ECECEC", "#DDDDDD")}</g>
  <text x="50%" y="960" font-family="Helvetica, Arial, sans-serif" font-size="36"
    letter-spacing="8" fill="#DDDDDD" text-anchor="middle">${name.toUpperCase()}</text>
</svg>`;

const MODELS = [
  ["land-cruiser", "Land Cruiser 300"],
  ["corolla-cross", "Corolla Cross"],
  ["camry", "Camry HEV"],
];

for (const [slug, name] of MODELS) {
  await sharp(Buffer.from(hero(name)))
    .webp({ quality: 82 })
    .toFile(path.join(dir, `${slug}-hero.webp`));
}
console.log(`${MODELS.length} hero images written`);
