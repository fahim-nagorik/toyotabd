"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY_MS = 6000;

interface Slide {
  id: string;
  slug: string;
  name: string;
  kicker: string;
  headline: string;
  sub: string;
  image: string;
}

// Interim slide set: four RAV4 colorways (client renders) at
// public/hero/rav4-{color}.webp. When per-model banner photography arrives,
// switch back to one slide per model via public/vehicles/{slug}-hero.webp.
const SLIDES: Slide[] = [
  {
    id: "rav4-white",
    slug: "rav4",
    name: "RAV4 Hybrid",
    kicker: "RAV4 Hybrid · Platinum White Pearl",
    headline: "RAV4 Hybrid.",
    sub: "Electrified capability, engineered for every road in Bangladesh.",
    image: "/hero/rav4-white.webp",
  },
  {
    id: "rav4-blue",
    slug: "rav4",
    name: "RAV4 Hybrid",
    kicker: "RAV4 Hybrid · Dark Blue Mica",
    headline: "Command every road.",
    sub: "E-Four electric AWD with self-charging hybrid power.",
    image: "/hero/rav4-blue.webp",
  },
  {
    id: "rav4-grey",
    slug: "rav4",
    name: "RAV4 Hybrid",
    kicker: "RAV4 Hybrid · Grey Metallic",
    headline: "Safety that never blinks.",
    sub: "Toyota Safety Sense camera and radar, standard on every grade.",
    image: "/hero/rav4-grey.webp",
  },
  {
    id: "rav4-silver",
    slug: "rav4",
    name: "RAV4 Hybrid",
    kicker: "RAV4 Hybrid · Silver Metallic",
    headline: "Take the wheel.",
    sub: "Book a test drive at your nearest dealer in minutes.",
    image: "/hero/rav4-silver.webp",
  },
];

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function HeroCarousel() {
  const reduced = useReducedMotion();
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((dir: number) => {
    setState(([i]) => [mod(i + dir, SLIDES.length), dir]);
  }, []);

  const goTo = (target: number) => {
    setState(([i]) => [target, target > i ? 1 : -1]);
  };

  // Autoplay — off under reduced motion, paused on hover/focus. Re-arms on
  // every index change so manual navigation gets a full interval.
  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduced, paused, index, paginate]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      paginate(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      paginate(1);
    }
  };

  const slide = SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured vehicles"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-toyota-red"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${SLIDES.length}: ${slide.name}`}
          custom={direction}
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: direction * 120 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: direction * -120 }}
          transition={{ duration: 0.7, ease: EASE }}
          drag={reduced ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80 || info.velocity.x < -400) paginate(1);
            else if (info.offset.x > 80 || info.velocity.x > 400) paginate(-1);
          }}
          className="absolute inset-0"
        >
          {/* Split composition: caption left, contained render right — the
              client renders center the car, so a full-bleed overlay would
              put text on the bodywork. */}
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-6 pt-20 lg:flex-row lg:items-center lg:gap-10 lg:pt-16">
            <div className="relative min-h-0 flex-1 lg:order-2 lg:self-stretch">
              <Image
                src={slide.image}
                alt={slide.name}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="pointer-events-none select-none object-contain"
              />
            </div>
            <div className="shrink-0 pb-24 pt-4 lg:order-1 lg:w-[40%] lg:py-0">
              <p className="text-xs uppercase tracking-[0.2em] text-toyota-red-text">
                {slide.kicker}
              </p>
              <h1
                className="mt-3 font-light leading-[1.05] tracking-tight text-black"
                style={{ fontSize: "clamp(36px, 4.5vw, 72px)" }}
              >
                {slide.headline}
              </h1>
              <p className="mt-3 max-w-xl text-lg text-muted">{slide.sub}</p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Button href={`/models/${slide.slug}`}>
                  Explore the {slide.name}
                </Button>
                <Button href="/#test-drive" variant="ghost">
                  Book a Test Drive
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-grey/70 bg-white/80 text-black backdrop-blur-sm transition-colors duration-200 hover:border-black md:left-8"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-grey/70 bg-white/80 text-black backdrop-blur-sm transition-colors duration-200 hover:border-black md:right-8"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Dots — 44px-tall touch targets with the dot as an inner visual.
          Autoplay always on (client request); hover/focus still pause it and
          reduced-motion disables it entirely. */}
      <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center">
        <div role="tablist" aria-label="Slides" className="flex items-center gap-1">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}: ${s.name}`}
              onClick={() => goTo(i)}
              className="group flex h-11 items-center px-1.5"
            >
              <span
                className={clsx(
                  "block h-2 rounded-full transition-all duration-300",
                  i === index
                    ? "w-8 bg-toyota-red"
                    : "w-2 bg-grey group-hover:bg-dark-grey",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
