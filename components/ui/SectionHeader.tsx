import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  /** Dark sections (e.g. Safety) invert the text colors. */
  tone?: "light" | "dark";
  className?: string;
}

// One header system for every section: red kicker, oversized light title,
// muted subline — consistent hierarchy across the whole site.
export default function SectionHeader({
  kicker,
  title,
  sub,
  align = "left",
  tone = "light",
  className,
}: SectionHeaderProps) {
  return (
    <Reveal
      className={clsx(align === "center" && "mx-auto max-w-2xl text-center", className)}
    >
      {kicker && (
        <p
          className={clsx(
            "text-xs uppercase tracking-[0.2em]",
            tone === "dark" ? "text-toyota-red" : "text-toyota-red-text",
          )}
        >
          {kicker}
        </p>
      )}
      <h2
        className={clsx(
          "text-4xl font-light tracking-tight md:text-6xl",
          kicker && "mt-3",
          tone === "dark" ? "text-white" : "text-black",
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={clsx(
            "mt-4 max-w-xl text-base leading-relaxed md:text-lg",
            align === "center" && "mx-auto",
            tone === "dark" ? "text-grey" : "text-muted",
          )}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}
