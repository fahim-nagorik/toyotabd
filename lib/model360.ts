import {
  RAV4_COLORS,
  RAV4_FRAME_COUNT,
  rav4Frames,
  type Rav4ColorKey,
} from "@/lib/rav4";

// One shared exterior palette across the demo lineup.
export const MODEL_360_COLORS = RAV4_COLORS;
export type Model360ColorKey = Rav4ColorKey;

// The RAV4 keeps its original PLAN.md §4 directory contract; every other
// model follows public/360/{slug}/{color}/001-036.webp (see the gen script).
export const model360Frames = (slug: string, color: Model360ColorKey) =>
  slug === "rav4"
    ? rav4Frames(color)
    : Array.from(
        { length: RAV4_FRAME_COUNT },
        (_, i) =>
          `/360/${slug}/${color}/${String(i + 1).padStart(3, "0")}.webp`,
      );
