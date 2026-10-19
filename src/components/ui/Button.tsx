import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-display font-semibold tracking-wide uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-gold-500 text-navy-900 hover:bg-gold-400 hover:shadow-[0_10px_30px_-10px_rgba(200,166,90,0.6)] hover:-translate-y-0.5",
  outline: "border border-gold-500/70 text-gold-400 hover:bg-gold-500 hover:text-navy-900",
  ghost: "text-white/80 hover:text-gold-400",
  light: "bg-white text-navy-900 hover:bg-cream",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[11px]",
  md: "px-6 py-3 text-xs",
  lg: "px-8 py-4 text-sm",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({ variant = "primary", size = "md", href, className, children, ...rest }: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
