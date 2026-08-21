import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { TypeBadge } from "@/components/ui/badge";
import { StatusChip } from "@/components/ui/status-chip";
import { BenefitIndex } from "@/components/benefit-index";
import { ClaimButton } from "@/app/benefits/[slug]/claim-button";
import { SaveButton } from "@/app/benefits/[slug]/save-button";
import { describeFreshness } from "@/lib/freshness";
import { formatCents, formatPeriod } from "@/lib/money";
import { getBenefitBySlug, getRelatedBenefits, recordAnalyticsEvent } from "@/lib/benefits";

export async function generateMetadata({ params }: PageProps<"/benefits/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const benefit = await getBenefitBySlug(slug);
  if (!benefit) return { title: "Benefit not found" };

  const description =
    benefit.description.length > 155 ? `${benefit.description.slice(0, 152)}...` : benefit.description;

  return {
    title: `${benefit.name} (${benefit.provider})`,
    description,
    openGraph: {
      title: benefit.name,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: benefit.name,
      description,
    },
  };
}

export default async function BenefitPage({ params }: PageProps<"/benefits/[slug]">) {
  const { slug } = await params;
  const benefit = await getBenefitBySlug(slug);
  if (!benefit) notFound();

  await recordAnalyticsEvent("BENEFIT_VIEW", { benefitId: benefit.id });

  const freshness = describeFreshness(benefit.verificationStatus, benefit.lastVerifiedAt);
  const related = await getRelatedBenefits(benefit, 4);

  const hasPrice = benefit.estimatedSavingsCents !== null && benefit.estimatedSavingsCents > 0;
  const needsReconfirmation =
    benefit.verificationStatus === "NEEDS_REVIEW" || benefit.verificationStatus === "UNVERIFIED";

  return (
    <section>
      <Container className="py-10 sm:py-16">
        <Link
          href="/benefits"
          className="font-mono-data text-text-secondary hover:text-text-primary focus-visible:outline-accent rounded-sm text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          &larr; All benefits
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <TypeBadge type={benefit.benefitType} />
          <StatusChip freshness={freshness} />
        </div>

        <h1 className="text-text-primary mt-4 max-w-3xl text-[40px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[64px]">
          {benefit.name}
        </h1>
        <p className="font-mono-data text-text-secondary mt-2 text-sm">
          {benefit.provider} &middot;{" "}
          <Link
            href={`/categories/${benefit.category.slug}`}
            className="hover:text-accent focus-visible:outline-accent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {benefit.category.name}
          </Link>
        </p>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="min-w-0">
            <p className="text-text-secondary max-w-[65ch] text-[19px] leading-[1.6]">
              {benefit.description}
            </p>

            <div className="border-surface-border mt-8 border-t pt-6">
              <h2 className="text-text-primary text-[17px] font-semibold">Eligibility</h2>
              <p className="text-text-secondary mt-2 max-w-[65ch]">{benefit.eligibilitySummary}</p>
              {benefit.requiredEmailDomainHint && (
                <p className="font-mono-data text-text-secondary mt-2 text-xs">
                  Typically requires an email ending in {benefit.requiredEmailDomainHint}
                </p>
              )}
            </div>

            {benefit.whatsIncluded && (
              <div className="border-surface-border mt-8 border-t pt-6">
                <h2 className="text-text-primary text-[17px] font-semibold">What&apos;s included</h2>
                <p className="text-text-secondary mt-2 max-w-[65ch] whitespace-pre-line">
                  {benefit.whatsIncluded}
                </p>
              </div>
            )}

            {benefit.whyClaim && (
              <div className="border-surface-border mt-8 border-t pt-6">
                <h2 className="text-text-primary text-[17px] font-semibold">Why you should claim it</h2>
                <p className="text-text-secondary mt-2 max-w-[65ch] whitespace-pre-line">
                  {benefit.whyClaim}
                </p>
              </div>
            )}

            {benefit.howToClaim && (
              <div className="border-surface-border mt-8 border-t pt-6">
                <h2 className="text-text-primary text-[17px] font-semibold">How to get it</h2>
                <p className="text-text-secondary mt-2 max-w-[65ch] whitespace-pre-line">
                  {benefit.howToClaim}
                </p>
              </div>
            )}

            <div className="border-surface-border mt-8 border-t pt-6">
              <h2 className="text-text-primary text-[17px] font-semibold">Verification</h2>
              <p className="text-text-secondary mt-2 max-w-[65ch]">
                {needsReconfirmation
                  ? "This listing is community/engineer-authored seed data pending reconfirmation. Details may be out of date."
                  : `Confirmed against ${benefit.source}.`}
              </p>
              <dl className="font-mono-data text-text-secondary mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
                <dt>Source</dt>
                <dd className="text-text-primary truncate">{benefit.source}</dd>
                <dt>Official page</dt>
                <dd className="truncate">
                  <a
                    href={benefit.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent focus-visible:outline-accent rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {benefit.officialUrl}
                  </a>
                </dd>
              </dl>
            </div>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="border-surface-border rounded-md border p-6">
              <p className="font-mono-data text-text-secondary text-[11px] tracking-[0.03em] uppercase">
                Potential value
              </p>
              <p className="font-mono-data text-text-primary mt-2 text-[30px] leading-[1.05] font-bold tracking-[-0.02em]">
                {hasPrice ? formatCents(benefit.estimatedSavingsCents, benefit.currency) : "Varies"}
                {hasPrice && (
                  <span className="text-text-secondary text-base font-medium">
                    {formatPeriod(benefit.pricePeriod)}
                  </span>
                )}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <ClaimButton benefitId={benefit.id} claimUrl={benefit.claimUrl} />
                <SaveButton benefitId={benefit.id} />
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="border-surface-border mt-16 border-t pt-10">
            <h2 className="text-text-primary text-[28px] leading-[1.15] font-semibold tracking-[-0.01em]">
              Related benefits
            </h2>
            <div className="mt-6">
              <BenefitIndex benefits={related} />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
