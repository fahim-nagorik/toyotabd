// Interim RAV4 360 set from 4 real photos at ~90° intervals.
// Each view fills 9 consecutive slots of the 36-frame contract, so
// public/rav4-360/{color}/001-036.webp keeps its exact shape — the full
// 36-frame shoot later overwrites these files with no code changes.
//
// Usage: node scripts/build-rav4-coarse-360.mjs <front34> <frontSide> <side> <rear34>
import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const [front34, frontSide, side, rear34] = process.argv.slice(2);
if (!rear34) {
  console.error("need 4 source images: front34 frontSide side rear34");
  process.exit(1);
}

const W = 1920;
const H = 1080;
const CAR_WIDTH = 1500; // car rendered at ~78% of canvas width, centered

const root = path.join(import.meta.dirname, "..", "public", "rav4-360");
const whiteDir = path.join(root, "white");
await mkdir(whiteDir, { recursive: true });

// Rotation order: front 3/4 → front-side → profile → rear 3/4.
const VIEWS = [front34, frontSide, side, rear34];

const processed = [];
for (const src of VIEWS) {
  const car = await sharp(src)
    .flatten({ background: "#ffffff" })
    .resize({ width: CAR_WIDTH })
    .toBuffer();
  const buf = await sharp({
    create: { width: W, height: H, channels: 3, background: "#ffffff" },
  })
    .composite([{ input: car, gravity: "center" }])
    .webp({ quality: 82 })
    .toBuffer();
  processed.push(buf);
}

for (let i = 1; i <= 36; i++) {
  const quadrant = Math.min(3, Math.floor((i - 1) / 9));
  const n = String(i).padStart(3, "0");
  await sharp(processed[quadrant]).toFile(path.join(whiteDir, `${n}.webp`));
}
console.log("white: 36 frames from 4 views");

// No per-color photography yet — point the other swatches at the white set
// (PLAN.md §4: "the swatch still works, it just won't change").
for (const color of ["silver", "red", "black"]) {
  const dir = path.join(root, color);
  await mkdir(dir, { recursive: true });
  for (let i = 1; i <= 36; i++) {
    const n = `${String(i).padStart(3, "0")}.webp`;
    await copyFile(path.join(whiteDir, n), path.join(dir, n));
  }
  console.log(`${color}: copied from white`);
}
