"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  Shield,
  Route,
  Gauge,
  Zap,
  Eye,
  Camera,
} from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

const STATS = [
  { value: 5, suffix: "★", label: "ASEAN NCAP rating" },
  { value: 7, suffix: "", label: "SRS airbags as standard" },
  { value: 360, suffix: "°", label: "Panoramic view monitor" },
];

const FEATURES = [
  { Icon: Shield, title: "Pre-Collision System" },
  { Icon: Route, title: "Lane Tracing Assist" },
  { Icon: Gauge, title: "Dynamic Radar Cruise Control" },
  { Icon: Zap, title: "Automatic High Beam" },
  { Icon: Eye, title: "Blind Spot Monitor" },
  { Icon: Camera, title: "Panoramic View Monitor" },
];

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Vertical-only margin: an all-sides "-10%" would exclude narrow elements
  // near the left edge (the 5★ span) from ever intersecting.
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: reduced ? 0 : 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function Safety() {
  return (
    <Section id="safety" bleed className="scroll-mt-16 bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-24">
        <Reveal>
          <Image
            src="/brand/ToyotaProductLogo_Secondary_White_RGB.png"
            alt="Toyota"
            width={124}
            height={41}
          />
          <h2 className="mt-8 text-3xl font-light tracking-tight md:text-5xl">
            Engineered to protect.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-dark-grey pt-12 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <p className="text-5xl font-light md:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-sm text-mid-grey">{s.label}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <f.Icon className="size-7 text-grey" strokeWidth={1.25} />
              <p className="mt-4 text-sm text-light-grey">{f.title}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
