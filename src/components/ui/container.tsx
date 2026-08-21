import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cx } from "@/lib/utils";

export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: { as?: T } & ComponentPropsWithoutRef<T>) {
  const Component = as ?? "div";
  return <Component className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}
