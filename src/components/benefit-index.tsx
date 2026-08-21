import type { ReactNode } from "react";
import { BenefitRow } from "@/components/benefit-row";
import type { BenefitCard } from "@/lib/benefits";

/**
 * Dense index rendering of a benefit list, per DESIGN.md section 5: rows,
 * not cards. Shared by /benefits, /categories/[category], /cs-stack and the
 * /discover results view so the "monitored log" feeling stays identical
 * everywhere benefits are listed.
 */
export function BenefitIndex({
  benefits,
  emptyState,
}: {
  benefits: BenefitCard[];
  emptyState?: ReactNode;
}) {
  if (benefits.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-surface-border px-6 py-10 text-center text-text-secondary">
        {emptyState ?? "No benefits match right now."}
      </div>
    );
  }

  return (
    <div className="border-t border-surface-border">
      {benefits.map((benefit) => (
        <BenefitRow key={benefit.id} benefit={benefit} />
      ))}
    </div>
  );
}
