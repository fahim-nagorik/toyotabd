"use client";

import { useState } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TestDriveForm from "@/components/home/TestDriveForm";
import { OFFERS, type Offer } from "@/lib/offers";

export default function Offers() {
  const [enquiry, setEnquiry] = useState<Offer | null>(null);

  return (
    <Section id="offers" bleed className="scroll-mt-16 bg-off-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:pt-32">
        <SectionHeader
          kicker="Offers"
          title="Current offers."
          sub="Limited-time offers across the range — enquire in one tap."
        />
      </div>

      <Reveal>
        <div className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-6 px-6 pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Lead spacer centers the rail with the container on wide screens */}
          <div className="shrink-0 snap-none lg:w-[calc((100vw-80rem)/2-1.5rem)]" />
          {OFFERS.map((o) => (
            <article
              key={o.id}
              className="w-[85vw] max-w-sm shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-premium"
            >
              <div className="bg-off-white">
                <Image
                  src={o.image}
                  alt={o.model}
                  width={1200}
                  height={675}
                  sizes="(max-width: 640px) 85vw, 384px"
                  className="h-auto w-full"
                />
              </div>
              <div className="flex flex-col gap-4 p-6">
                <h3 className="min-h-16 text-lg leading-snug text-black">
                  {o.title}
                </h3>
                <p className="text-xs uppercase tracking-[0.15em] text-muted">
                  {o.validity}
                </p>
                <div>
                  <Button variant="ghost" onClick={() => setEnquiry(o)}>
                    Enquire
                  </Button>
                </div>
              </div>
            </article>
          ))}
          <div className="w-px shrink-0 snap-none" />
        </div>
      </Reveal>

      <Modal
        open={enquiry !== null}
        onClose={() => setEnquiry(null)}
        title={enquiry ? `Enquire — ${enquiry.model}` : ""}
      >
        {enquiry && <TestDriveForm defaultModel={enquiry.model} compact />}
      </Modal>
    </Section>
  );
}
