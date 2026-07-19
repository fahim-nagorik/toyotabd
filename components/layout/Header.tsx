"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";

const NAV = [
  { label: "Vehicles", href: "/#vehicles" },
  { label: "Technology", href: "/#technology" },
  { label: "Safety", href: "/#safety" },
  { label: "Offers", href: "/#offers" },
  { label: "Dealers", href: "/#dealers" },
  { label: "Service", href: "/service" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  // Active State (nav): highlight the section the visitor is in.
  const isActive = (item: (typeof NAV)[number]) =>
    item.href === "/service"
      ? pathname.startsWith("/service")
      : item.label === "Vehicles" && pathname.startsWith("/models");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open; Esc closes it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-light-grey bg-white/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" aria-label="Toyota Bangladesh home" onClick={() => setOpen(false)}>
          <Image
            src="/brand/ToyotaProductLogo_Secondary_Black_RGB.png"
            alt="Toyota"
            width={124}
            height={41}
            priority
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive(item) ? "page" : undefined}
              className={clsx(
                "relative text-sm transition-colors duration-200 hover:text-black",
                "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-toyota-red after:transition-transform after:duration-300 after:ease-premium",
                isActive(item)
                  ? "font-medium text-black after:scale-x-100"
                  : "text-dark-grey after:scale-x-0 hover:after:scale-x-100",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/#test-drive">Book a Test Drive</Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-11 items-center justify-center text-black lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-16 flex flex-col bg-white px-6 pb-10 pt-6 lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-light-grey py-4 text-2xl font-light text-black"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8">
              <Button href="/#test-drive" onClick={() => setOpen(false)}>
                Book a Test Drive
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
