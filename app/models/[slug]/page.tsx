import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShieldCheck, Wrench, BadgeCheck } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Model360 from "@/components/models/Model360";
import TestDriveForm from "@/components/home/TestDriveForm";
import { VEHICLES } from "@/lib/vehicles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return VEHICLES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = VEHICLES.find((v) => v.slug === slug);
  if (!vehicle) return {};
  return {
    title: `${vehicle.name} — Toyota Bangladesh`,
    description: `Explore the Toyota ${vehicle.name} in 360°, view specifications and book a test drive. Demo site.`,
  };
}

const OWNERSHIP = [
  {
    Icon: ShieldCheck,
    title: "Toyota Safety Sense",
    copy: "Camera and radar working together — collision warning, lane assist and adaptive cruise as standard.",
  },
  {
    Icon: BadgeCheck,
    title: "3-Year Warranty",
    copy: "Factory warranty up to 100,000 km, honoured at every authorised dealer in Bangladesh.",
  },
  {
    Icon: Wrench,
    title: "Genuine Parts Nationwide",
    copy: "Genuine parts and trained technicians in Dhaka, Chattogram, Sylhet, Khulna and Rajshahi.",
  },
];

export default async function ModelPage({ params }: PageProps) {
  const { slug } = await params;
  const vehicle = VEHICLES.find((v) => v.slug === slug);
  if (!vehicle) notFound();

  const others = VEHICLES.filter((v) => v.slug !== slug).slice(0, 3);

  return (
    <main className="pb-20 pt-16 lg:pb-0">
      {/* Hero band */}
      <section className="bg-off-white">
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 pt-16">
          <Link
            href="/#vehicles"
            className="text-sm text-muted transition-colors duration-200 hover:text-black"
          >
            ← All vehicles
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-toyota-red-text">
            {vehicle.bodyType}
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <h1 className="text-4xl font-light tracking-tight text-black md:text-6xl">
              {vehicle.name}
            </h1>
            <p className="text-base text-dark-grey">
              From{" "}
              <span className="text-xl font-medium text-black">
                {vehicle.priceFrom}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* 360 viewer */}
      <Section className="py-16">
        <Reveal>
          <h2 className="text-2xl font-light tracking-tight text-black md:text-4xl">
            See it from every angle.
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted">
            Drag to walk around the {vehicle.name}, or use the arrow keys.
            Pick a finish below the viewer.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="mt-8">
          <Model360 slug={vehicle.slug} name={vehicle.name} />
        </Reveal>
      </Section>

      {/* Specifications */}
      <Section bleed className="bg-off-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-16">
          <Reveal>
            <h2 className="text-2xl font-light tracking-tight text-black md:text-4xl">
              Specifications.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {vehicle.specs.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white p-6"
                >
                  <dt className="text-xs uppercase tracking-[0.15em] text-muted">
                    {s.label}
                  </dt>
                  <dd className="mt-2 text-lg font-medium leading-snug text-black">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* Ownership highlights */}
      <Section className="py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {OWNERSHIP.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.08}>
              <o.Icon className="size-7 text-toyota-red" strokeWidth={1.25} />
              <h3 className="mt-4 text-lg text-black">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {o.copy}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Test drive, pre-filled */}
      <Section id="book-test-drive" bleed className="scroll-mt-16 bg-off-white">
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <Reveal>
            <h2 className="text-center text-2xl font-light tracking-tight text-black md:text-4xl">
              Drive the {vehicle.name}.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <TestDriveForm defaultModel={vehicle.name} />
          </Reveal>
        </div>
      </Section>

      {/* More models */}
      <Section className="py-16">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-light tracking-tight text-black md:text-4xl">
              Explore more.
            </h2>
            <Button href="/#vehicles" variant="ghost">
              Full lineup
            </Button>
          </div>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {others.map((v, i) => (
            <Reveal key={v.slug} delay={i * 0.08}>
              <Link
                href={`/models/${v.slug}`}
                className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-toyota-red"
              >
                <div className="overflow-hidden rounded-2xl bg-off-white transition-[box-shadow,transform] duration-500 ease-premium group-hover:-translate-y-1 group-hover:shadow-premium-lg">
                  <Image
                    src={v.image}
                    alt={v.name}
                    width={1200}
                    height={675}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-auto w-full transition-transform duration-500 ease-premium group-hover:scale-[1.03]"
                  />
                </div>
                <div className="px-1 pt-4">
                  <h3 className="text-lg text-black">{v.name}</h3>
                  <p className="mt-0.5 text-sm text-dark-grey">
                    From <span className="font-medium">{v.priceFrom}</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Sticky conversion bar on mobile (primary CTA always reachable) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-light-grey bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-black">
            {vehicle.name}
          </p>
          <p className="text-xs text-muted">From {vehicle.priceFrom}</p>
        </div>
        <Button href="#book-test-drive" className="shrink-0 !px-5 !py-2.5">
          Book a Test Drive
        </Button>
      </div>
    </main>
  );
}
