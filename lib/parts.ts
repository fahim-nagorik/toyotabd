export const PART_CATEGORIES = [
  "All",
  "Genuine Engine Oil",
  "Filters",
  "Brake Parts",
  "Batteries",
  "Accessories",
] as const;

export type PartCategory = (typeof PART_CATEGORIES)[number];

export interface Part {
  slug: string;
  name: string;
  partNumber: string;
  category: Exclude<PartCategory, "All">;
  price: number; // ৳
  compatibility: string[];
  image: string;
}

export const PARTS: Part[] = [
  {
    slug: "oil-0w20",
    name: "Toyota Genuine Motor Oil 0W-20 Synthetic (4L)",
    partNumber: "08880-83885",
    category: "Genuine Engine Oil",
    price: 5200,
    compatibility: ["RAV4 Hybrid", "Corolla Cross", "Camry HEV", "Corolla Altis"],
    image: "/parts/oil-0w20.webp",
  },
  {
    slug: "oil-5w30",
    name: "Toyota Genuine Motor Oil 5W-30 (4L)",
    partNumber: "08880-83717",
    category: "Genuine Engine Oil",
    price: 4300,
    compatibility: ["Hilux", "Fortuner", "Rush", "Land Cruiser 300"],
    image: "/parts/oil-5w30.webp",
  },
  {
    slug: "oil-filter",
    name: "Genuine Oil Filter",
    partNumber: "90915-YZZE1",
    category: "Filters",
    price: 850,
    compatibility: ["Corolla Altis", "Corolla Cross", "Rush"],
    image: "/parts/oil-filter.webp",
  },
  {
    slug: "air-filter",
    name: "Genuine Engine Air Filter",
    partNumber: "17801-0Y040",
    category: "Filters",
    price: 1450,
    compatibility: ["RAV4 Hybrid", "Corolla Cross", "Camry HEV"],
    image: "/parts/air-filter.webp",
  },
  {
    slug: "cabin-filter",
    name: "Cabin AC Filter",
    partNumber: "87139-58010",
    category: "Filters",
    price: 1200,
    compatibility: ["All models"],
    image: "/parts/cabin-filter.webp",
  },
  {
    slug: "brake-pads-front",
    name: "Front Brake Pad Set",
    partNumber: "04465-42230",
    category: "Brake Parts",
    price: 6800,
    compatibility: ["RAV4 Hybrid", "Corolla Cross"],
    image: "/parts/brake-pads-front.webp",
  },
  {
    slug: "brake-disc",
    name: "Front Brake Disc",
    partNumber: "43512-42050",
    category: "Brake Parts",
    price: 9500,
    compatibility: ["RAV4 Hybrid", "Fortuner"],
    image: "/parts/brake-disc.webp",
  },
  {
    slug: "battery-65ah",
    name: "Toyota Genuine Battery 65Ah",
    partNumber: "28800-0Y120",
    category: "Batteries",
    price: 18500,
    compatibility: ["Hilux", "Fortuner", "Land Cruiser 300"],
    image: "/parts/battery-65ah.webp",
  },
  {
    slug: "battery-45ah",
    name: "Toyota Genuine Battery 45Ah",
    partNumber: "28800-21170",
    category: "Batteries",
    price: 12500,
    compatibility: ["Corolla Altis", "Rush", "Corolla Cross"],
    image: "/parts/battery-45ah.webp",
  },
  {
    slug: "floor-mats",
    name: "All-Weather Floor Mat Set",
    partNumber: "PT908-42200",
    category: "Accessories",
    price: 5500,
    compatibility: ["RAV4 Hybrid", "Corolla Cross", "Fortuner"],
    image: "/parts/floor-mats.webp",
  },
  {
    slug: "dash-cam",
    name: "Genuine Dash Camera Kit",
    partNumber: "PT949-00230",
    category: "Accessories",
    price: 16800,
    compatibility: ["All models"],
    image: "/parts/dash-cam.webp",
  },
  {
    slug: "wiper-set",
    name: "Windshield Wiper Blade Set",
    partNumber: "85212-YZZ05",
    category: "Accessories",
    price: 1900,
    compatibility: ["All models"],
    image: "/parts/wiper-set.webp",
  },
];

export const VAT_RATE = 0.15;
export const DELIVERY_FEE = 500;

export const partBySlug = (slug: string) =>
  PARTS.find((p) => p.slug === slug);
