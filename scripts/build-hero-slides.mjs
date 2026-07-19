// Hero carousel slides from client-provided RAV4 colorway renders.
// Output contract: public/hero/rav4-{color}.webp, 1920×1080.
// Usage: node scripts/build-hero-slides.mjs <white> <blue> <grey> <silver>
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const names = ["white", "blue", "grey", "silver"];
const sources = process.argv.slice(2);
if (sources.length !== 4) {
  console.error("need 4 source images: white blue grey silver");
  process.exit(1);
}

const dir = path.join(import.meta.dirname, "..", "public", "hero");
await mkdir(dir, { recursive: true });

for (let i = 0; i < 4; i++) {
  await sharp(sources[i])
    .flatten({ background: "#ffffff" })
    .resize(1920, 1080)
    .webp({ quality: 82 })
    .toFile(path.join(dir, `rav4-${names[i]}.webp`));
}
console.log("4 hero slides written to public/hero");
