import Link from "next/link";
import { StatusChip } from "@/components/ui/status-chip";
import { TypeBadge } from "@/components/ui/badge";
import { describeFreshness } from "@/lib/freshness";
import { formatCents, formatPeriod } from "@/lib/money";
import type { BenefitCard } from "@/lib/benefits";

/**
 * The core visual unit of the product: a dense index row, not a marketing
 * card. Status chip first, because verification is the thing being sold.
 * See DESIGN.md section 5.
 */
export function BenefitRow({ benefit }: { benefit: BenefitCard }) {
  const freshness = describeFreshness(benefit.verificationStatus, benefit.lastVerifiedAt);
  const priceLabel =
    benefit.estimatedSavingsCents && benefit.estimatedSavingsCents > 0
      ? `${formatCents(benefit.estimatedSavingsCents)}${formatPeriod(benefit.pricePeriod)} value`
      : null;

  return (
    <Link
      href={`/benefits/${benefit.slug}`}
      className="group grid grid-cols-1 items-center gap-3 border-b border-surface-border py-4 transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-surface-raised/60 sm:grid-cols-[1fr_auto_auto] sm:gap-6 sm:px-3"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[17px] font-medium text-text-primary group-hover:text-accent">
            {benefit.name}
          </h3>
          <span className="font-mono-data hidden shrink-0 text-xs text-text-secondary sm:inline">
            {benefit.provider}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-text-secondary">{benefit.category.name}</p>
      </div>

      <div className="flex items-center gap-3 sm:justify-end">
        <TypeBadge type={benefit.benefitType} />
        {priceLabel && <span className="font-mono-data text-sm text-text-secondary">{priceLabel}</span>}
      </div>

      <StatusChip freshness={freshness} />
    </Link>
  );
}
