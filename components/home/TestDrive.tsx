import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import TestDriveForm from "@/components/home/TestDriveForm";

export default function TestDrive() {
  return (
    <Section id="test-drive" className="scroll-mt-16 py-24 md:py-32">
      <SectionHeader
        align="center"
        kicker="Test Drive"
        title="Take the wheel."
        sub="Book a test drive at your nearest dealer — it takes a minute, and there's no obligation."
      />
      <Reveal delay={0.08} className="mx-auto mt-12 max-w-2xl">
        <TestDriveForm />
      </Reveal>
    </Section>
  );
}
