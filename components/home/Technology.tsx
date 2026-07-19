import Image from "next/image";
import clsx from "clsx";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

const PANELS = [
  {
    slug: "hybrid",
    kicker: "Hybrid Electric",
    title: "Charges itself. Never plugs in.",
    copy: "Toyota's self-charging hybrid system switches seamlessly between petrol and electric power, recovering energy every time you brake — built for Dhaka traffic as much as the open highway.",
    image: "/tech/hybrid.webp",
  },
  {
    slug: "safety-sense",
    kicker: "Toyota Safety Sense",
    title: "A second pair of eyes, always on.",
    copy: "Camera and radar work together to watch the road ahead — warning you of collisions, keeping you centered in your lane, and adjusting your speed to the traffic around you.",
    image: "/tech/safety-sense.webp",
  },
  {
    slug: "connected",
    kicker: "Connected Services",
    title: "Your Toyota, in your pocket.",
    copy: "Check fuel level, find your parked car, review trip history and get service reminders from the myToyota app — your vehicle stays connected wherever you are.",
    image: "/tech/connected.webp",
  },
];

export default function Technology() {
  return (
    <Section id="technology" className="scroll-mt-16 py-24">
      <Reveal>
        <h2 className="text-3xl font-light tracking-tight text-black md:text-5xl">
          Technology that works for you.
        </h2>
      </Reveal>

      <div className="mt-16 flex flex-col gap-24">
        {PANELS.map((p, i) => (
          <Reveal key={p.slug}>
            <div
              className={clsx(
                "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
              )}
            >
              <div
                className={clsx(
                  "overflow-hidden rounded-2xl",
                  i % 2 === 1 && "lg:order-2",
                )}
              >
                <Image
                  src={p.image}
                  alt={p.kicker}
                  width={1200}
                  height={800}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full"
                />
              </div>
              <div className={clsx(i % 2 === 1 && "lg:order-1")}>
                <p className="text-xs uppercase tracking-[0.2em] text-toyota-red-text">
                  {p.kicker}
                </p>
                <h3 className="mt-3 text-2xl font-light tracking-tight text-black md:text-4xl">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                  {p.copy}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
