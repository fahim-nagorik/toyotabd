import clsx from "clsx";
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Full-bleed sections handle their own inner container. */
  bleed?: boolean;
}

export default function Section({
  id,
  children,
  className,
  bleed = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(!bleed && "mx-auto w-full max-w-7xl px-6", className)}
    >
      {children}
    </section>
  );
}
