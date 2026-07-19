"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useCart } from "@/components/service/CartContext";
import { PART_CATEGORIES, PARTS, type Part, type PartCategory } from "@/lib/parts";
import { taka } from "@/lib/format";

export default function PartsShop() {
  const [category, setCategory] = useState<PartCategory>("All");
  const [detail, setDetail] = useState<Part | null>(null);
  const [detailQty, setDetailQty] = useState(1);
  const { add, count, openDrawer } = useCart();

  const visible = PARTS.filter(
    (p) => category === "All" || p.category === category,
  );

  const openDetail = (part: Part) => {
    setDetail(part);
    setDetailQty(1);
  };

  return (
    <Section id="parts" className="scroll-mt-16 py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          kicker="Genuine Parts"
          title="Parts &amp; Oil Shop."
          sub="Genuine Toyota parts, delivered anywhere in Bangladesh."
        />
        <Reveal delay={0.08}>
          <button
            type="button"
            onClick={openDrawer}
            className="inline-flex items-center gap-2 rounded-full border border-grey px-5 py-2.5 text-sm text-black transition-colors duration-200 hover:border-black"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag className="size-4" />
            Cart
            {count > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-toyota-red text-xs text-white">
                {count}
              </span>
            )}
          </button>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <div
          role="radiogroup"
          aria-label="Filter parts"
          className="mt-8 flex flex-wrap gap-2"
        >
          {PART_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={category === c}
              onClick={() => setCategory(c)}
              className={clsx(
                "rounded-full border px-5 py-2 text-sm transition-colors duration-200 active:scale-[0.98]",
                category === c
                  ? "border-black bg-black text-white"
                  : "border-grey text-dark-grey hover:border-black",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 4) * 0.08}>
            <article className="group flex h-full flex-col rounded-2xl border border-light-grey bg-white p-4 transition-[box-shadow,transform] duration-500 ease-premium hover:-translate-y-1 hover:shadow-premium-lg">
              <button
                type="button"
                onClick={() => openDetail(p)}
                aria-label={`View ${p.name}`}
                className="overflow-hidden rounded-xl bg-off-white"
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  width={800}
                  height={800}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading={i < 4 ? "eager" : "lazy"}
                  className="h-auto w-full transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                />
              </button>
              <div className="flex flex-1 flex-col px-1 pt-4">
                <p className="text-xs uppercase tracking-[0.15em] text-muted">
                  {p.partNumber}
                </p>
                <h3 className="mt-1 text-sm font-medium leading-snug text-black">
                  {p.name}
                </h3>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <p className="text-sm font-medium text-black">
                    {taka(p.price)}
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => add(p.slug)}
                    className="!px-4 !py-2 text-xs"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail?.name ?? ""}
      >
        {detail && (
          <div>
            <div className="overflow-hidden rounded-xl bg-off-white">
              <Image
                src={detail.image}
                alt={detail.name}
                width={800}
                height={800}
                className="h-auto w-full"
              />
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Part number</dt>
                <dd className="font-medium text-black">{detail.partNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Price</dt>
                <dd className="font-medium text-black">{taka(detail.price)}</dd>
              </div>
              <div>
                <dt className="text-muted">Compatible with</dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {detail.compatibility.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-off-white px-3 py-1 text-xs text-dark-grey"
                    >
                      {m}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-grey">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setDetailQty((q) => Math.max(1, q - 1))}
                  className="hit-44 flex size-10 items-center justify-center text-dark-grey hover:text-black"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm" aria-live="polite">
                  {detailQty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setDetailQty((q) => q + 1)}
                  className="hit-44 flex size-10 items-center justify-center text-dark-grey hover:text-black"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <Button
                onClick={() => {
                  add(detail.slug, detailQty);
                  setDetail(null);
                }}
                className="flex-1"
              >
                Add to Cart — {taka(detail.price * detailQty)}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
}
