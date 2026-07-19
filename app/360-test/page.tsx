"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import Viewer360 from "@/components/ui/Viewer360";
import {
  RAV4_COLORS,
  RAV4_HOTSPOTS,
  RAV4_VIEWER_SENSITIVITY,
  rav4Frames,
  type Rav4ColorKey,
} from "@/lib/rav4";

export default function ViewerTestPage() {
  const [color, setColor] = useState<Rav4ColorKey>("white");
  const frames = useMemo(() => rav4Frames(color), [color]);
  const selected = RAV4_COLORS.find((c) => c.key === color)!;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-16 pt-28">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">
        Scratch route — Viewer360 test bench
      </p>
      <h1 className="mt-2 text-4xl font-light text-black">RAV4 360°</h1>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
        Drag to rotate — release with momentum for inertia. Idles into a
        gentle autospin after 3 seconds. Focus the viewer and use ← → to
        step frames. Placeholder frames show color, frame number and a
        rotation tick.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl bg-off-white">
        <Viewer360
          frames={frames}
          hotspots={RAV4_HOTSPOTS}
          sensitivity={RAV4_VIEWER_SENSITIVITY}
          ariaLabel={`360 degree view of the Toyota RAV4 in ${selected.label}. Drag, or press the left and right arrow keys, to rotate.`}
        />
      </div>

      <div className="mt-6 flex items-center gap-6">
        <div className="flex gap-3" role="radiogroup" aria-label="Exterior color">
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
                "hit-44 size-9 rounded-full border border-grey transition-shadow duration-200",
                color === c.key &&
                  "ring-2 ring-black ring-offset-2 ring-offset-white",
              )}
              style={{ backgroundColor: c.swatch }}
            />
          ))}
        </div>
        <p className="text-sm text-dark-grey">{selected.label}</p>
      </div>
    </main>
  );
}
