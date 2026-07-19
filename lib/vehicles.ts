// Model list sourced from demo.toyota.nagorik.tech (PLAN.md §3.3).
// Image paths are a fixed contract — real hero shots drop into
// public/vehicles/{slug}.webp later with no code changes.

export type VehicleCategory = "SUV" | "Sedan" | "Hybrid" | "Commercial";

export interface Vehicle {
  slug: string;
  name: string;
  bodyType: string;
  priceFrom: string; // formatted ৳ lakh notation, per source
  categories: VehicleCategory[];
  image: string;
  specs: { label: string; value: string }[];
}

export const VEHICLE_FILTERS = [
  "All",
  "SUV",
  "Sedan",
  "Hybrid",
  "Commercial",
] as const;

export const VEHICLES: Vehicle[] = [
  {
    slug: "rav4",
    name: "RAV4 Hybrid",
    bodyType: "HEV · SUV",
    priceFrom: "৳ 95,00,000",
    categories: ["SUV", "Hybrid"],
    image: "/vehicles/rav4.webp",
    specs: [
      { label: "Engine", value: "2.5L Dynamic Force Hybrid" },
      { label: "Drivetrain", value: "E-Four Electric AWD" },
      { label: "Seats", value: "5" },
    ],
  },
  {
    slug: "land-cruiser",
    name: "Land Cruiser 300",
    bodyType: "Flagship SUV",
    priceFrom: "৳ 3,20,00,000",
    categories: ["SUV"],
    image: "/vehicles/land-cruiser.webp",
    specs: [
      { label: "Engine", value: "3.3L Twin-Turbo Diesel" },
      { label: "Drivetrain", value: "Full-Time 4WD" },
      { label: "Seats", value: "7" },
    ],
  },
  {
    slug: "corolla-cross",
    name: "Corolla Cross",
    bodyType: "HEV · SUV",
    priceFrom: "৳ 60,00,000",
    categories: ["SUV", "Hybrid"],
    image: "/vehicles/corolla-cross.webp",
    specs: [
      { label: "Engine", value: "1.8L Hybrid" },
      { label: "Drivetrain", value: "FWD" },
      { label: "Seats", value: "5" },
    ],
  },
  {
    slug: "camry",
    name: "Camry HEV",
    bodyType: "Sedan",
    priceFrom: "৳ 90,00,000",
    categories: ["Sedan", "Hybrid"],
    image: "/vehicles/camry.webp",
    specs: [
      { label: "Engine", value: "2.5L Dynamic Force Hybrid" },
      { label: "Drivetrain", value: "FWD" },
      { label: "Seats", value: "5" },
    ],
  },
  {
    slug: "fortuner",
    name: "Fortuner",
    bodyType: "SUV",
    priceFrom: "৳ 1,55,00,000",
    categories: ["SUV"],
    image: "/vehicles/fortuner.webp",
    specs: [
      { label: "Engine", value: "2.8L Turbo Diesel" },
      { label: "Drivetrain", value: "Part-Time 4WD" },
      { label: "Seats", value: "7" },
    ],
  },
  {
    slug: "hilux",
    name: "Hilux",
    bodyType: "Pick Up",
    priceFrom: "৳ 75,00,000",
    categories: ["Commercial"],
    image: "/vehicles/hilux.webp",
    specs: [
      { label: "Engine", value: "2.8L Turbo Diesel" },
      { label: "Drivetrain", value: "4WD" },
      { label: "Seats", value: "5" },
    ],
  },
  {
    slug: "corolla-altis",
    name: "Corolla Altis",
    bodyType: "Sedan",
    priceFrom: "৳ 52,00,000",
    categories: ["Sedan"],
    image: "/vehicles/corolla-altis.webp",
    specs: [
      { label: "Engine", value: "1.8L Petrol" },
      { label: "Drivetrain", value: "CVT · FWD" },
      { label: "Seats", value: "5" },
    ],
  },
  {
    slug: "rush",
    name: "Rush",
    bodyType: "MPV · SUV",
    priceFrom: "৳ 55,00,000",
    categories: ["SUV"],
    image: "/vehicles/rush.webp",
    specs: [
      { label: "Engine", value: "1.5L Petrol" },
      { label: "Drivetrain", value: "RWD" },
      { label: "Seats", value: "7" },
    ],
  },
];
