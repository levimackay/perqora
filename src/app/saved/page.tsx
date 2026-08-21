import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { getDeviceProfile } from "@/lib/device";
import { prisma } from "@/lib/prisma";
import { benefitCardInclude, summarizeSavings, type BenefitCard } from "@/lib/benefits";
import { formatCents } from "@/lib/money";
import { SavedList } from "./saved-list";

export const metadata: Metadata = {
  title: "Saved benefits",
  description: "The student benefits you've saved to check out later.",
};

function EmptyState() {
  return (
    <div className="mt-4 rounded-md border border-surface-border px-6 py-14 text-center">
      <p className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">
        No device profile yet
      </p>
      <p className="mt-3 text-[19px] leading-[1.6] text-text-primary">Nothing saved yet.</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
        Save a benefit from its listing page and it shows up here. Saves are tied to this browser, not an
        account, so there&apos;s nothing to sign in to.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <LinkButton href="/discover" variant="primary">
          Find my benefits
        </LinkButton>
        <LinkButton href="/benefits" variant="secondary">
          Browse all benefits
        </LinkButton>
      </div>
    </div>
  );
}

export default async function SavedPage() {
  const profile = await getDeviceProfile();

  let benefits: BenefitCard[] = [];
  if (profile) {
    const saved = await prisma.savedBenefit.findMany({
      where: { deviceProfileId: profile.id },
      orderBy: { createdAt: "desc" },
      include: { benefit: { include: benefitCardInclude } },
    });
    benefits = saved.map((s) => s.benefit).filter((b): b is BenefitCard => b.isActive);
  }

  const summary = summarizeSavings(benefits);

  return (
    <Container as="section" className="py-10 sm:py-16">
      <header className="max-w-2xl border-b border-surface-border pb-6">
        <p className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">Saved</p>
        <h1 className="mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em] text-text-primary">
          Your saved benefits
        </h1>
        <p className="mt-3 text-[16px] leading-[1.6] text-text-secondary">
          Kept locally to this browser via an anonymous cookie, no account required.
        </p>
      </header>

      {benefits.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 border-b border-surface-border pb-6 sm:grid-cols-4">
          <div>
            <p className="font-mono-data text-2xl font-semibold text-accent">
              {formatCents(summary.totalAnnualCents)}
            </p>
            <p className="font-mono-data mt-1 text-[11px] tracking-[0.03em] text-text-secondary uppercase">
              Potential annual value
            </p>
          </div>
          <div>
            <p className="font-mono-data text-2xl font-semibold text-text-primary">{summary.totalBenefits}</p>
            <p className="font-mono-data mt-1 text-[11px] tracking-[0.03em] text-text-secondary uppercase">
              Saved benefits
            </p>
          </div>
          <div>
            <p className="font-mono-data text-2xl font-semibold text-text-primary">
              {summary.benefitsWithValue}
            </p>
            <p className="font-mono-data mt-1 text-[11px] tracking-[0.03em] text-text-secondary uppercase">
              With a priced value
            </p>
          </div>
        </div>
      )}

      {benefits.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <h2 className="sr-only">Your saved benefits list</h2>
          <SavedList initialBenefits={benefits} />
        </>
      )}
    </Container>
  );
}
