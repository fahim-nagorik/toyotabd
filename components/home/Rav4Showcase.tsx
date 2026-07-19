"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import Viewer360 from "@/components/ui/Viewer360";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import {
  RAV4_COLORS,
  RAV4_HOTSPOTS,
  RAV4_VIEWER_SENSITIVITY,
  RAV4_SPECS,
  rav4Frames,
  type Rav4ColorKey,
} from "@/lib/rav4";

export default function Rav4Showcase() {
  const [color, setColor] = useState<Rav4ColorKey>("white");
  const frames = useMemo(() => rav4Frames(color), [color]);
  const selected = RAV4_COLORS.find((c) => c.key === color)!;

  return (
    <Section id="rav4" bleed className="scroll-mt-16 bg-off-white">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-24 md:py-32 lg:grid-cols-[2fr_3fr]">
        <div>
          <SectionHeader
            kicker="RAV4 Hybrid"
            title="See it from every angle."
            sub="Drag to walk around the RAV4 Hybrid. Pick a finish below the viewer — hotspots reveal the details worth a closer look."
          />

          <Reveal delay={0.08}>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-grey/60 pt-8">
              {RAV4_SPECS.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-[0.15em] text-muted">
                    {s.label}
                  </dt>
                  <dd className="mt-2 text-sm font-medium leading-snug text-black">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-10">
              <Button href="/#test-drive">Book a Test Drive</Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-2xl">
            <Viewer360
              frames={frames}
              hotspots={RAV4_HOTSPOTS}
          sensitivity={RAV4_VIEWER_SENSITIVITY}
              ariaLabel={`360 degree view of the Toyota RAV4 in ${selected.label}. Drag, or press the left and right arrow keys, to rotate.`}
            />
          </div>
          <div className="mt-6 flex items-center gap-5">
            <div
              className="flex gap-3"
              role="radiogroup"
              aria-label="Exterior color"
            >
              {RAV4_COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  role="radio"
                  aria-checked={color === c.key}
                  aria-label={c.label}
                  title={c.label}
                  onClick={() => setColor(c.key)}
                  className={clsx(
                    "hit-44 size-8 rounded-full border border-grey transition-shadow duration-200",
                    color === c.key &&
                      "ring-2 ring-black ring-offset-2 ring-offset-off-white",
                  )}
                  style={{ backgroundColor: c.swatch }}
                />
              ))}
            </div>
            <p className="text-sm text-dark-grey">{selected.label}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
