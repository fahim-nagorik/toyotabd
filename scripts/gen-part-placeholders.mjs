// Placeholder product shots for the parts shop. Same contract as elsewhere:
// real photography replaces public/parts/{slug}.webp with no code changes.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const dir = path.join(import.meta.dirname, "..", "public", "parts");
await mkdir(dir, { recursive: true });

// One simple glyph per category, drawn in a 400×400 box centered on canvas.
const GLYPHS = {
  oil: `<path d="M160,80 h60 v40 h30 l30,40 v160 a20,20 0 0 1 -20,20 H140 a20,20 0 0 1 -20,-20 V160 z"
    fill="#E4E4E4"/><rect x="150" y="40" width="80" height="40" rx="8" fill="#D6D6D6"/>`,
  filter: `<rect x="110" y="110" width="180" height="200" rx="24" fill="#E4E4E4"/>
    <ellipse cx="200" cy="110" rx="90" ry="28" fill="#D6D6D6"/>
    <rect x="140" y="150" width="120" height="8" rx="4" fill="#D6D6D6"/>
    <rect x="140" y="180" width="120" height="8" rx="4" fill="#D6D6D6"/>
    <rect x="140" y="210" width="120" height="8" rx="4" fill="#D6D6D6"/>`,
  brake: `<circle cx="200" cy="200" r="120" fill="#E4E4E4"/>
    <circle cx="200" cy="200" r="60" fill="#F5F5F5"/>
    <circle cx="200" cy="200" r="18" fill="#D6D6D6"/>
    <circle cx="200" cy="120" r="8" fill="#D6D6D6"/><circle cx="200" cy="280" r="8" fill="#D6D6D6"/>
    <circle cx="120" cy="200" r="8" fill="#D6D6D6"/><circle cx="280" cy="200" r="8" fill="#D6D6D6"/>`,
  battery: `<rect x="90" y="140" width="220" height="160" rx="16" fill="#E4E4E4"/>
    <rect x="120" y="110" width="40" height="30" rx="6" fill="#D6D6D6"/>
    <rect x="240" y="110" width="40" height="30" rx="6" fill="#D6D6D6"/>
    <text x="140" y="235" font-family="Helvetica" font-size="48" fill="#C4C4C4">+</text>
    <text x="245" y="233" font-family="Helvetica" font-size="48" fill="#C4C4C4">−</text>`,
  accessory: `<rect x="110" y="130" width="180" height="140" rx="16" fill="#E4E4E4"/>
    <path d="M110,180 h180" stroke="#D6D6D6" stroke-width="8"/>
    <rect x="170" y="100" width="60" height="30" rx="8" fill="#D6D6D6"/>`,
};

const CATEGORY_GLYPH = {
  "Genuine Engine Oil": "oil",
  Filters: "filter",
  "Brake Parts": "brake",
  Batteries: "battery",
  Accessories: "accessory",
};

const PARTS = [
  ["oil-0w20", "Genuine Engine Oil"],
  ["oil-5w30", "Genuine Engine Oil"],
  ["oil-filter", "Filters"],
  ["air-filter", "Filters"],
  ["cabin-filter", "Filters"],
  ["brake-pads-front", "Brake Parts"],
  ["brake-disc", "Brake Parts"],
  ["battery-65ah", "Batteries"],
  ["battery-45ah", "Batteries"],
  ["floor-mats", "Accessories"],
  ["dash-cam", "Accessories"],
  ["wiper-set", "Accessories"],
];

for (const [slug, category] of PARTS) {
  const glyph = GLYPHS[CATEGORY_GLYPH[category]];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
    <rect width="800" height="800" fill="#F5F5F5"/>
    <g transform="translate(200 160) scale(1)">${glyph}</g>
    <text x="50%" y="700" font-family="Helvetica, Arial, sans-serif" font-size="28"
      letter-spacing="4" fill="#C4C4C4" text-anchor="middle">${slug.toUpperCase()}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(path.join(dir, `${slug}.webp`));
}
console.log(`${PARTS.length} part images written to public/parts`);
