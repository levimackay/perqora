import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { BenefitIndex } from "@/components/benefit-index";
import { FilterBar, FilterBarSkeleton } from "@/app/benefits/filter-bar";
import { listBenefits, listCategories, recordAnalyticsEvent, type BenefitFilters } from "@/lib/benefits";
import { BENEFIT_TYPE_LABELS } from "@/lib/constants";
import type { BenefitType } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "All benefits",
  description: "The full, browsable index of every verified student benefit Perqora tracks.",
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function many(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function BenefitsPage({ searchParams }: PageProps<"/benefits">) {
  const sp = await searchParams;

  const q = first(sp.q)?.trim() || undefined;
  const category = first(sp.category) || undefined;
  const type = (first(sp.type) as BenefitType | undefined) || undefined;
  const interests = many(sp.interest);
  const freeOnly = first(sp.freeOnly) === "true";

  const filters: BenefitFilters = {
    q,
    categorySlug: category,
    benefitType: type,
    interests: interests.length > 0 ? interests : undefined,
    freeOnly: freeOnly || undefined,
  };

  const [benefits, categories] = await Promise.all([listBenefits(filters, 100), listCategories()]);

  if (q) {
    await recordAnalyticsEvent("SEARCH", { metadata: { q, category, type } });
  }

  const hasFilters = Boolean(q || category || type || freeOnly || interests.length > 0);

  return (
    <section>
      <Container className="py-10 sm:py-16">
        <p className="font-mono-data text-[11px] tracking-[0.03em] text-text-secondary uppercase">Index</p>
        <h1 className="mt-2 text-[40px] leading-[1.05] font-bold tracking-[-0.02em] text-text-primary sm:text-[64px]">
          All benefits
        </h1>
        <p className="mt-3 max-w-[65ch] text-text-secondary">
          Every benefit Perqora tracks, filterable and linkable. {benefits.length} shown
          {hasFilters ? " for this filter." : "."}
        </p>

        <div className="mt-8">
          <Suspense fallback={<FilterBarSkeleton />}>
            <FilterBar
              categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
              types={Object.entries(BENEFIT_TYPE_LABELS) as [BenefitType, string][]}
            />
          </Suspense>
        </div>

        <div className="mt-8">
          <h2 className="sr-only">All benefits</h2>
          <BenefitIndex
            benefits={benefits}
            emptyState={
              hasFilters ? (
                <span>
                  No benefits match that combination of filters.{" "}
                  <Link href="/benefits" className="text-accent underline-offset-4 hover:underline">
                    Clear filters
                  </Link>
                  .
                </span>
              ) : (
                "No benefits are indexed yet."
              )
            }
          />
        </div>
      </Container>
    </section>
  );
}
