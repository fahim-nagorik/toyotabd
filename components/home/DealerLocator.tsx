"use client";

import { useState } from "react";
import clsx from "clsx";
import { MapPin, Phone, Clock, Search } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { DEALERS } from "@/lib/dealers";

export default function DealerLocator() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>(DEALERS[0].id);

  const q = query.trim().toLowerCase();
  const visible = DEALERS.filter(
    (d) =>
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.address.toLowerCase().includes(q),
  );

  return (
    <Section id="dealers" className="scroll-mt-16 py-24">
      <Reveal>
        <h2 className="text-3xl font-light tracking-tight text-black md:text-5xl">
          Find your dealer.
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_3fr]">
        <Reveal>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city or dealer name"
              aria-label="Search dealers"
              className="w-full rounded-lg border border-grey bg-white py-3 pl-11 pr-4 text-sm text-black outline-none transition-colors duration-200 placeholder:text-muted focus:border-black"
            />
          </div>

          <ul className="mt-4 flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1">
            {visible.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setSelected(d.id)}
                  aria-pressed={selected === d.id}
                  className={clsx(
                    "w-full rounded-xl border p-4 text-left transition-colors duration-200",
                    selected === d.id
                      ? "border-black bg-off-white"
                      : "border-light-grey hover:border-grey",
                  )}
                >
                  <p className="text-sm font-medium text-black">{d.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {d.address}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dark-grey">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3" /> {d.phone}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" /> {d.hours}
                    </span>
                  </div>
                </button>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="rounded-xl border border-light-grey p-4 text-sm text-muted">
                No dealers match “{query}”.
              </li>
            )}
          </ul>
        </Reveal>

        {/* Stylized static map (no maps API, §3.8) — pins are DOM overlays. */}
        <Reveal delay={0.08}>
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-off-white lg:aspect-auto lg:h-full lg:min-h-[480px]">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 800 600"
              preserveAspectRatio="none"
              aria-hidden
            >
              {/* abstract street grid */}
              {Array.from({ length: 11 }, (_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 80}
                  y1="0"
                  x2={i * 80 + 40}
                  y2="600"
                  stroke="#E6E6E6"
                  strokeWidth="1.5"
                />
              ))}
              {Array.from({ length: 8 }, (_, i) => (
                <line
                  key={`h${i}`}
                  x1="0"
                  y1={i * 80}
                  x2="800"
                  y2={i * 80 + 30}
                  stroke="#E6E6E6"
                  strokeWidth="1.5"
                />
              ))}
              {/* river */}
              <path
                d="M420,0 C380,120 480,200 430,320 C390,420 480,500 440,600"
                fill="none"
                stroke="#DDE4E8"
                strokeWidth="26"
                strokeLinecap="round"
              />
            </svg>

            {DEALERS.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-label={`${d.name}, ${d.city}`}
                onClick={() => setSelected(d.id)}
                className="group absolute -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${d.pin.x * 100}%`,
                  top: `${d.pin.y * 100}%`,
                }}
              >
                <MapPin
                  className={clsx(
                    "transition-all duration-200",
                    selected === d.id
                      ? "size-9 fill-toyota-red stroke-white"
                      : "size-6 fill-dark-grey stroke-white group-hover:fill-black",
                  )}
                />
                <span
                  className={clsx(
                    "absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-xs shadow-sm transition-opacity duration-200",
                    selected === d.id ? "opacity-100" : "opacity-0",
                  )}
                >
                  {d.city}
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
