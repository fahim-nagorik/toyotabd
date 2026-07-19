import type { ViewerHotspot } from "@/components/ui/Viewer360";

// Fixed asset contract (PLAN.md §4): real photography drops into these exact
// directories later — only the color key changes, never the shape.
export const RAV4_FRAME_COUNT = 36;

export type Rav4ColorKey = "white" | "silver" | "red" | "black";

export const rav4Frames = (color: Rav4ColorKey) =>
  Array.from(
    { length: RAV4_FRAME_COUNT },
    (_, i) => `/rav4-360/${color}/${String(i + 1).padStart(3, "0")}.webp`,
  );

export const RAV4_COLORS: {
  key: Rav4ColorKey;
  label: string;
  swatch: string;
}[] = [
  { key: "white", label: "Platinum White Pearl", swatch: "#FAFAFA" },
  { key: "silver", label: "Silver Metallic", swatch: "#C4C6C8" },
  { key: "red", label: "Emotional Red", swatch: "#EB0A1E" },
  { key: "black", label: "Attitude Black", swatch: "#101010" },
];

// Ranges/positions match the interim 4-view set (front 3/4 = frames 1-9,
// rear 3/4 = 28-36). Retune both when the full 36-frame sequence lands
// (canonical spec: frame 001 = straight-on front, clockwise from above).
export const RAV4_HOTSPOTS: ViewerHotspot[] = [
  {
    id: "headlight",
    title: "LED Projector Headlamps",
    body: "Adaptive LED units with integrated daytime running lights and auto high beam.",
    x: 0.37,
    y: 0.47,
    frames: [1, 9],
  },
  {
    id: "tailgate",
    title: "Power Back Door",
    body: "Hands-free power tailgate with kick sensor and adjustable opening height.",
    x: 0.58,
    y: 0.42,
    frames: [28, 36],
  },
];

export const RAV4_SPECS = [
  { label: "Engine", value: "2.5L Dynamic Force Hybrid" },
  { label: "Drivetrain", value: "E-Four Electric AWD" },
  { label: "Seats", value: "5" },
];
