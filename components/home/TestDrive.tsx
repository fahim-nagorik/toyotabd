import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import TestDriveForm from "@/components/home/TestDriveForm";

export default function TestDrive() {
  return (
    <Section id="test-drive" className="scroll-mt-16 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="text-3xl font-light tracking-tight text-black md:text-5xl">
            Take the wheel.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Book a test drive at your nearest dealer — it takes a minute, and
            there&apos;s no obligation.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.08} className="mx-auto mt-12 max-w-2xl">
        <TestDriveForm />
      </Reveal>
    </Section>
  );
}
