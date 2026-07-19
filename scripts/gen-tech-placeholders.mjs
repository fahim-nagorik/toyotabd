// Placeholder imagery for the Technology panels (PLAN.md §3.5).
// Real photography replaces public/tech/{slug}.webp with no code changes.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const dir = path.join(import.meta.dirname, "..", "public", "tech");
await mkdir(dir, { recursive: true });

const PANELS = [
  ["hybrid", "HYBRID ELECTRIC"],
  ["safety-sense", "TOYOTA SAFETY SENSE"],
  ["connected", "CONNECTED SERVICES"],
];

const svg = (label) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <rect width="1200" height="800" fill="#F5F5F5"/>
  <circle cx="600" cy="380" r="150" fill="none" stroke="#E0E0E0" stroke-width="3"/>
  <circle cx="600" cy="380" r="100" fill="none" stroke="#E0E0E0" stroke-width="3"/>
  <circle cx="600" cy="380" r="50" fill="#E8E8E8"/>
  <text x="50%" y="640" font-family="Helvetica, Arial, sans-serif" font-size="32"
    letter-spacing="6" fill="#C4C4C4" text-anchor="middle">${label}</text>
</svg>`;

for (const [slug, label] of PANELS) {
  await sharp(Buffer.from(svg(label)))
    .webp({ quality: 82 })
    .toFile(path.join(dir, `${slug}.webp`));
}
console.log(`${PANELS.length} tech panels written to public/tech`);
