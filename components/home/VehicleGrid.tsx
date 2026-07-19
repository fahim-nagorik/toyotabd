"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { VEHICLES, VEHICLE_FILTERS } from "@/lib/vehicles";

type Filter = (typeof VEHICLE_FILTERS)[number];

export default function VehicleGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = VEHICLES.filter(
    (v) => filter === "All" || v.categories.includes(filter),
  );

  return (
    <Section id="vehicles" className="scroll-mt-16 py-24">
      <Reveal>
        <h2 className="text-3xl font-light tracking-tight text-black md:text-5xl">
          The Lineup
        </h2>
      </Reveal>

      <Reveal delay={0.08}>
        <div
          role="radiogroup"
          aria-label="Filter vehicles"
          className="mt-8 flex flex-wrap gap-2"
        >
          {VEHICLE_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={filter === f}
              onClick={() => setFilter(f)}
              className={clsx(
                "rounded-full border px-5 py-2 text-sm transition-colors duration-200 active:scale-[0.98]",
                filter === f
                  ? "border-black bg-black text-white"
                  : "border-grey text-dark-grey hover:border-black",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((v, i) => (
          <Reveal key={v.slug} delay={(i % 3) * 0.08}>
            <article className="group rounded-2xl bg-white">
              <Link
                href={`/models/${v.slug}`}
                aria-label={`View ${v.name} details`}
                className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-toyota-red"
              >
                <div className="overflow-hidden rounded-2xl bg-off-white shadow-transparent transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-black/10">
                  <Image
                    src={v.image}
                    alt={v.name}
                    width={1200}
                    height={675}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="px-1 pb-2 pt-5">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted">
                    {v.bodyType}
                  </p>
                  <h3 className="mt-1 text-xl text-black">{v.name}</h3>
                  <p className="mt-1 text-sm text-dark-grey">
                    From <span className="font-medium">{v.priceFrom}</span>
                  </p>
                </div>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
