"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Scroll-in wrapper (PLAN.md §6): fade + 24px rise, once, -10% margin.
// Reduced motion → content appears instantly.

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  /** Seconds — use multiples of 0.08 to stagger grid children. */
  delay?: number;
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
