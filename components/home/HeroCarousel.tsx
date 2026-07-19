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
  slug: string;
  name: string;
  headline: string;
  sub: string;
  image: string;
}

// Hero images follow the public/vehicles/{slug}-hero.webp contract.
const SLIDES: Slide[] = [
  {
    slug: "rav4",
    name: "RAV4 Hybrid",
    headline: "RAV4 Hybrid.",
    sub: "Electrified capability, engineered for every road in Bangladesh.",
    image: "/vehicles/rav4-hero.webp",
  },
  {
    slug: "land-cruiser",
    name: "Land Cruiser 300",
    headline: "Land Cruiser 300.",
    sub: "The legend, engineered beyond limits.",
    image: "/vehicles/land-cruiser-hero.webp",
  },
  {
    slug: "corolla-cross",
    name: "Corolla Cross",
    headline: "Corolla Cross.",
    sub: "The self-charging hybrid SUV, built for the city.",
    image: "/vehicles/corolla-cross-hero.webp",
  },
  {
    slug: "camry",
    name: "Camry HEV",
    headline: "Camry HEV.",
    sub: "Executive comfort with hybrid efficiency.",
    image: "/vehicles/camry-hero.webp",
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
          key={slide.slug}
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
          <Image
            src={slide.image}
            alt={slide.name}
            fill
            priority={index === 0}
            sizes="100vw"
            className="pointer-events-none select-none object-cover"
          />
          {/* Caption, container-aligned like the toyota-bd.com banner */}
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto w-full max-w-7xl px-6 pb-28">
              <p className="text-xs uppercase tracking-[0.2em] text-toyota-red-text">
                {slide.name}
              </p>
              <h1
                className="mt-3 font-light leading-[1.05] tracking-tight text-black"
                style={{ fontSize: "clamp(40px, 6vw, 84px)" }}
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

      {/* Dots */}
      <div
        role="tablist"
        aria-label="Slides"
        className="absolute inset-x-0 bottom-10 z-10 flex justify-center gap-2"
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}: ${s.name}`}
            onClick={() => goTo(i)}
            className={clsx(
              "h-2 rounded-full transition-all duration-300",
              i === index
                ? "w-8 bg-toyota-red"
                : "w-2 bg-grey hover:bg-dark-grey",
            )}
          />
        ))}
      </div>
    </section>
  );
}
