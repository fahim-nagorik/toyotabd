export interface Offer {
  id: string;
  title: string;
  model: string; // matches a Vehicle name for test-drive pre-fill
  validity: string;
  image: string;
}

export const OFFERS: Offer[] = [
  {
    id: "rav4-service",
    title: "Complimentary 3-year service package with every RAV4 Hybrid",
    model: "RAV4 Hybrid",
    validity: "Valid until 30 September 2026",
    image: "/vehicles/rav4.webp",
  },
  {
    id: "cross-exchange",
    title: "৳ 2,00,000 exchange bonus on the Corolla Cross",
    model: "Corolla Cross",
    validity: "Valid until 31 August 2026",
    image: "/vehicles/corolla-cross.webp",
  },
  {
    id: "camry-registration",
    title: "Free registration and first-year insurance on the Camry HEV",
    model: "Camry HEV",
    validity: "Valid until 30 September 2026",
    image: "/vehicles/camry.webp",
  },
  {
    id: "hilux-fleet",
    title: "Fleet financing from 0% down payment on the Hilux",
    model: "Hilux",
    validity: "Valid until 31 October 2026",
    image: "/vehicles/hilux.webp",
  },
];
