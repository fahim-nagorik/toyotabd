// 360° placeholder frames for every model except the RAV4 (which keeps its
// original PLAN.md §4 contract at public/rav4-360). Contract per model:
//   public/360/{slug}/{color}/001.webp … 036.webp
// Real photography drops into these exact directories with no code changes.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const MODELS = [
  ["land-cruiser", "Land Cruiser 300"],
  ["corolla-cross", "Corolla Cross"],
  ["camry", "Camry HEV"],
  ["fortuner", "Fortuner"],
  ["hilux", "Hilux"],
  ["corolla-altis", "Corolla Altis"],
  ["rush", "Rush"],
];
const COLORS = ["white", "silver", "red", "black"];
const FRAMES = 36;
const W = 1600;
const H = 900;

const root = path.join(import.meta.dirname, "..", "public", "360");

for (const [slug, name] of MODELS) {
  for (const color of COLORS) {
    const dir = path.join(root, slug, color);
    await mkdir(dir, { recursive: true });
    for (let i = 1; i <= FRAMES; i++) {
      const n = String(i).padStart(3, "0");
      const deg = (i - 1) * 10;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
        <rect width="${W}" height="${H}" fill="#F5F5F5"/>
        <text x="50%" y="200" font-family="Helvetica, Arial, sans-serif"
          font-size="44" letter-spacing="8" fill="#D6D6D6"
          text-anchor="middle">${name.toUpperCase()}</text>
        <text x="50%" y="50%" font-family="Helvetica, Arial, sans-serif"
          font-size="90" fill="#CCCCCC" text-anchor="middle"
          dominant-baseline="central">${color} ${n}</text>
        <g transform="translate(${W / 2} 700) rotate(${deg})">
          <circle r="60" fill="none" stroke="#CCCCCC" stroke-width="4"/>
          <line x1="0" y1="0" x2="0" y2="-60" stroke="#CCCCCC" stroke-width="6"/>
        </g>
      </svg>`;
      await sharp(Buffer.from(svg))
        .webp({ quality: 82 })
        .toFile(path.join(dir, `${n}.webp`));
    }
  }
  console.log(`${slug}: ${COLORS.length * FRAMES} frames`);
}
