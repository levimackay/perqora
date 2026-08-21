import { cx } from "@/lib/utils";
import { BENEFIT_TYPE_LABELS } from "@/lib/constants";
import type { BenefitType } from "@/generated/prisma/client";

export function TypeBadge({ type, className }: { type: BenefitType; className?: string }) {
  return (
    <span
      className={cx(
        "font-mono-data inline-flex items-center rounded-sm border border-surface-border px-2 py-0.5 text-[11px] tracking-[0.03em] text-text-secondary uppercase",
        className,
      )}
    >
      {BENEFIT_TYPE_LABELS[type] ?? type}
    </span>
  );
}
