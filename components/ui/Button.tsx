import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "filled" | "ghost";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function Button({
  href,
  onClick,
  variant = "filled",
  children,
  className,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium",
    "transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-premium active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-60",
    variant === "filled"
      ? "bg-toyota-red text-white hover:bg-[#c90819] hover:shadow-premium"
      : "border border-grey text-black hover:border-black",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
