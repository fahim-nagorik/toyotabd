export interface ServiceType {
  id: string;
  name: string;
  description: string;
  duration: string;
  durationHours: number; // for the .ics event
  price: string; // indicative
}

export const SERVICE_TYPES: ServiceType[] = [
  {
    id: "periodic",
    name: "Periodic Maintenance",
    description: "Scheduled service per your maintenance book — oil, filters, inspection.",
    duration: "≈ 3 hours",
    durationHours: 3,
    price: "From ৳ 8,500",
  },
  {
    id: "express",
    name: "Express Maintenance",
    description: "Oil change and multi-point check while you wait.",
    duration: "≈ 1 hour",
    durationHours: 1,
    price: "From ৳ 4,500",
  },
  {
    id: "body-paint",
    name: "Body & Paint",
    description: "Dent repair, panel replacement and genuine paint matching.",
    duration: "1–5 days",
    durationHours: 8,
    price: "On estimate",
  },
  {
    id: "diagnostics",
    name: "Diagnostics",
    description: "Full-system electronic diagnosis with a written report.",
    duration: "≈ 2 hours",
    durationHours: 2,
    price: "From ৳ 3,000",
  },
];

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:30",
  "14:00",
  "15:30",
  "17:00",
];
