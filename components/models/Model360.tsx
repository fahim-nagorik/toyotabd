"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import Viewer360 from "@/components/ui/Viewer360";
import {
  MODEL_360_COLORS,
  model360Frames,
  type Model360ColorKey,
} from "@/lib/model360";
import { RAV4_HOTSPOTS } from "@/lib/rav4";

interface Model360Props {
  slug: string;
  name: string;
}

export default function Model360({ slug, name }: Model360Props) {
  const [color, setColor] = useState<Model360ColorKey>("white");
  const frames = useMemo(() => model360Frames(slug, color), [slug, color]);
  const selected = MODEL_360_COLORS.find((c) => c.key === color)!;

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-off-white">
        <Viewer360
          frames={frames}
          hotspots={slug === "rav4" ? RAV4_HOTSPOTS : []}
          ariaLabel={`360 degree view of the Toyota ${name} in ${selected.label}. Drag, or press the left and right arrow keys, to rotate.`}
        />
      </div>
      <div className="mt-6 flex items-center gap-5">
        <div
          className="flex gap-3"
          role="radiogroup"
          aria-label="Exterior color"
        >
          {MODEL_360_COLORS.map((c) => (
            <button
              key={c.key}
              type="button"
              role="radio"
              aria-checked={color === c.key}
              aria-label={c.label}
              title={c.label}
              onClick={() => setColor(c.key)}
              className={clsx(
                "size-8 rounded-full border border-grey transition-shadow duration-200",
                color === c.key &&
                  "ring-2 ring-black ring-offset-2 ring-offset-white",
              )}
              style={{ backgroundColor: c.swatch }}
            />
          ))}
        </div>
        <p className="text-sm text-dark-grey">{selected.label}</p>
      </div>
    </div>
  );
}
