import { MapPin, ShieldCheck, Wrench, Star } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

// Proof band after the hero ("Trust & Authority" landing pattern):
// credibility stats before any ask.
const ITEMS = [
  { Icon: MapPin, label: "6 authorised dealers", sub: "across Bangladesh" },
  { Icon: ShieldCheck, label: "3-year warranty", sub: "up to 100,000 km" },
  { Icon: Wrench, label: "Genuine parts", sub: "delivered nationwide" },
  { Icon: Star, label: "5★ ASEAN NCAP", sub: "safety rating" },
];

export default function TrustBand() {
  return (
    <Section bleed className="border-y border-light-grey bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-6 py-10 md:grid-cols-4">
        {ITEMS.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08}>
            <div className="flex items-start gap-3">
              <item.Icon
                className="mt-0.5 size-5 shrink-0 text-toyota-red"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-sm font-medium text-black">{item.label}</p>
                <p className="mt-0.5 text-xs text-muted">{item.sub}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
