import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/utils";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md text-[15px] font-medium transition-colors duration-150 ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:pointer-events-none";

const VARIANTS = {
  primary: "bg-accent text-text-on-accent hover:bg-accent-600 px-4 py-2.5",
  secondary:
    "border border-surface-border text-text-primary hover:border-accent/50 hover:text-accent px-4 py-2.5",
  ghost: "text-text-secondary hover:text-text-primary px-3 py-2",
};

type Variant = keyof typeof VARIANTS;

type ButtonProps = ComponentPropsWithoutRef<"button"> & { variant?: Variant };
type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & { variant?: Variant };

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={cx(BASE, VARIANTS[variant], className)} {...props} />;
}

export function LinkButton({ variant = "primary", className, ...props }: LinkButtonProps) {
  return <Link className={cx(BASE, VARIANTS[variant], className)} {...props} />;
}
