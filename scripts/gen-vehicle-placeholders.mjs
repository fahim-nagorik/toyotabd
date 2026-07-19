// Placeholder model hero shots. Same contract idea as the 360 frames:
// real photography replaces public/vehicles/{slug}.webp with no code changes.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const dir = path.join(import.meta.dirname, "..", "public", "vehicles");
await mkdir(dir, { recursive: true });

// Simple SUV side profile, 900×280 local coordinates.
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

const card = (name) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675">
  <rect width="1200" height="675" fill="#F5F5F5"/>
  <g transform="translate(150 140)">${silhouette("#E4E4E4", "#D6D6D6")}</g>
  <text x="50%" y="590" font-family="Helvetica, Arial, sans-serif" font-size="34"
    letter-spacing="6" fill="#C4C4C4" text-anchor="middle">${name.toUpperCase()}</text>
</svg>`;

const hero = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <rect width="1920" height="1080" fill="#FFFFFF"/>
  <g transform="translate(330 300) scale(1.4)">${silhouette("#ECECEC", "#DDDDDD")}</g>
</svg>`;

const MODELS = [
  ["rav4", "RAV4 Hybrid"],
  ["land-cruiser", "Land Cruiser 300"],
  ["corolla-cross", "Corolla Cross"],
  ["camry", "Camry HEV"],
  ["fortuner", "Fortuner"],
  ["hilux", "Hilux"],
  ["corolla-altis", "Corolla Altis"],
  ["rush", "Rush"],
];

for (const [slug, name] of MODELS) {
  await sharp(Buffer.from(card(name)))
    .webp({ quality: 82 })
    .toFile(path.join(dir, `${slug}.webp`));
}
await sharp(Buffer.from(hero))
  .webp({ quality: 82 })
  .toFile(path.join(dir, "rav4-hero.webp"));
console.log(`${MODELS.length} model cards + hero written to public/vehicles`);
