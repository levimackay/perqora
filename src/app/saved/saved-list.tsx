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
      <div className="mt-4 rounded-md border border-surface-border px-6 py-10 text-center">
        <p className="text-[16px] text-text-primary">Nothing saved yet.</p>
        <p className="mt-2 text-sm text-text-secondary">
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
            className="grid grid-cols-1 items-center gap-3 border-b border-surface-border py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-6 sm:px-3"
          >
            <Link
              href={`/benefits/${benefit.slug}`}
              className="group min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <div className="flex items-center gap-2">
                <h3 className="truncate text-[17px] font-medium text-text-primary group-hover:text-accent">
                  {benefit.name}
                </h3>
                <span className="font-mono-data hidden shrink-0 text-xs text-text-secondary sm:inline">
                  {benefit.provider}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-text-secondary">{benefit.category.name}</p>
            </Link>

            <div className="flex items-center gap-3 sm:justify-end">
              <TypeBadge type={benefit.benefitType} />
              {priceLabel && <span className="font-mono-data text-sm text-text-secondary">{priceLabel}</span>}
            </div>

            <StatusChip freshness={freshness} />

            <div className="flex flex-col items-start gap-1 sm:items-end">
              <button
                type="button"
                onClick={() => handleUnsave(benefit.id)}
                disabled={isRemoving || isPending}
                className="font-mono-data rounded-sm border border-surface-border px-2.5 py-1 text-[11px] tracking-[0.03em] text-text-secondary uppercase transition-colors duration-150 ease-[var(--ease-standard)] hover:border-status-error/50 hover:text-status-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
              >
                {isRemoving ? "Removing…" : "Unsave"}
              </button>
              {errorId === benefit.id && (
                <span className="text-[11px] text-status-error">Couldn&apos;t remove, try again.</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
