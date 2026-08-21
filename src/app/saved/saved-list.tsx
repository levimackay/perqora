"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { StatusChip } from "@/components/ui/status-chip";
import { TypeBadge } from "@/components/ui/badge";
import { describeFreshness } from "@/lib/freshness";
import { formatCents, formatPeriod } from "@/lib/money";
import type { BenefitCard } from "@/lib/benefits";

/**
 * Client island: the server component that renders /saved does the initial
 * data fetch (see page.tsx), this just owns the unsave interaction so the
 * rest of the page stays a plain server render.
 */
export function SavedList({ initialBenefits }: { initialBenefits: BenefitCard[] }) {
  const [benefits, setBenefits] = useState(initialBenefits);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleUnsave(benefitId: string) {
    setPendingId(benefitId);
    setErrorId(null);

    try {
      const res = await fetch(`/api/saved-benefits/${benefitId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Request failed");
      startTransition(() => {
        setBenefits((current) => current.filter((b) => b.id !== benefitId));
      });
    } catch {
      setErrorId(benefitId);
    } finally {
      setPendingId(null);
    }
  }

  if (benefits.length === 0) {
    return (
      <div className="border-surface-border mt-4 rounded-md border px-6 py-10 text-center">
        <p className="text-text-primary text-[16px]">Nothing saved yet.</p>
        <p className="text-text-secondary mt-2 text-sm">
          Removed benefits stop showing here immediately, this list is empty because you cleared it.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-2">
      {benefits.map((benefit) => {
        const freshness = describeFreshness(benefit.verificationStatus, benefit.lastVerifiedAt);
        const priceLabel =
          benefit.estimatedSavingsCents && benefit.estimatedSavingsCents > 0
            ? `${formatCents(benefit.estimatedSavingsCents)}${formatPeriod(benefit.pricePeriod)} value`
            : null;
        const isRemoving = pendingId === benefit.id;

        return (
          <li
            key={benefit.id}
            className="border-surface-border grid grid-cols-1 items-center gap-3 border-b py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-6 sm:px-3"
          >
            <Link
              href={`/benefits/${benefit.slug}`}
              className="group focus-visible:outline-accent min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-text-primary group-hover:text-accent truncate text-[17px] font-medium">
                  {benefit.name}
                </h3>
                <span className="font-mono-data text-text-secondary hidden shrink-0 text-xs sm:inline">
                  {benefit.provider}
                </span>
              </div>
              <p className="text-text-secondary mt-1 line-clamp-1 text-sm">{benefit.category.name}</p>
            </Link>

            <div className="flex items-center gap-3 sm:justify-end">
              <TypeBadge type={benefit.benefitType} />
              {priceLabel && <span className="font-mono-data text-text-secondary text-sm">{priceLabel}</span>}
            </div>

            <StatusChip freshness={freshness} />

            <div className="flex flex-col items-start gap-1 sm:items-end">
              <button
                type="button"
                onClick={() => handleUnsave(benefit.id)}
                disabled={isRemoving || isPending}
                className="font-mono-data border-surface-border text-text-secondary hover:border-status-error/50 hover:text-status-error focus-visible:outline-accent rounded-sm border px-2.5 py-1 text-[11px] tracking-[0.03em] uppercase transition-colors duration-150 ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40"
              >
                {isRemoving ? "Removing…" : "Unsave"}
              </button>
              {errorId === benefit.id && (
                <span className="text-status-error text-[11px]">Couldn&apos;t remove, try again.</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
