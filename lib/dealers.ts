export interface Dealer {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  /** Pin position on the stylized map, 0–1 from top-left. */
  pin: { x: number; y: number };
}

export const DEALERS: Dealer[] = [
  {
    id: "dhaka-tejgaon",
    name: "Toyota Tejgaon",
    city: "Dhaka",
    address: "Plot 189, Tejgaon Industrial Area, Dhaka 1208",
    phone: "+880 2-8891234",
    hours: "Sat–Thu 9:00–19:00",
    pin: { x: 0.52, y: 0.42 },
  },
  {
    id: "dhaka-uttara",
    name: "Toyota Uttara",
    city: "Dhaka",
    address: "House 12, Sonargaon Janapath, Sector 9, Uttara, Dhaka 1230",
    phone: "+880 2-8952211",
    hours: "Sat–Thu 9:00–19:00",
    pin: { x: 0.56, y: 0.32 },
  },
  {
    id: "chattogram",
    name: "Toyota Chattogram",
    city: "Chattogram",
    address: "748 CDA Avenue, GEC Circle, Chattogram 4000",
    phone: "+880 31-655789",
    hours: "Sat–Thu 9:00–18:30",
    pin: { x: 0.74, y: 0.72 },
  },
  {
    id: "sylhet",
    name: "Toyota Sylhet",
    city: "Sylhet",
    address: "Waves 1, Dargah Gate, Sylhet 3100",
    phone: "+880 821-719456",
    hours: "Sat–Thu 9:00–18:30",
    pin: { x: 0.8, y: 0.2 },
  },
  {
    id: "khulna",
    name: "Toyota Khulna",
    city: "Khulna",
    address: "23 KDA Avenue, Khulna 9100",
    phone: "+880 41-731022",
    hours: "Sat–Thu 9:00–18:00",
    pin: { x: 0.3, y: 0.68 },
  },
  {
    id: "rajshahi",
    name: "Toyota Rajshahi",
    city: "Rajshahi",
    address: "Alupatti Circle, Natore Road, Rajshahi 6000",
    phone: "+880 721-812340",
    hours: "Sat–Thu 9:00–18:00",
    pin: { x: 0.22, y: 0.34 },
  },
];
