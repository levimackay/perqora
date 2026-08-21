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
    <div className="border-surface-border mt-4 rounded-md border px-6 py-14 text-center">
      <p className="font-mono-data text-text-secondary text-xs tracking-[0.03em] uppercase">
        No device profile yet
      </p>
      <p className="text-text-primary mt-3 text-[19px] leading-[1.6]">Nothing saved yet.</p>
      <p className="text-text-secondary mx-auto mt-2 max-w-md text-sm">
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
      <header className="border-surface-border max-w-2xl border-b pb-6">
        <p className="font-mono-data text-text-secondary text-xs tracking-[0.03em] uppercase">Saved</p>
        <h1 className="text-text-primary mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em]">
          Your saved benefits
        </h1>
        <p className="text-text-secondary mt-3 text-[16px] leading-[1.6]">
          Kept locally to this browser via an anonymous cookie, no account required.
        </p>
      </header>

      {benefits.length > 0 && (
        <div className="border-surface-border mt-4 grid grid-cols-2 gap-4 border-b pb-6 sm:grid-cols-4">
          <div>
            <p className="font-mono-data text-accent text-2xl font-semibold">
              {formatCents(summary.totalAnnualCents)}
            </p>
            <p className="font-mono-data text-text-secondary mt-1 text-[11px] tracking-[0.03em] uppercase">
              Potential annual value
            </p>
          </div>
          <div>
            <p className="font-mono-data text-text-primary text-2xl font-semibold">{summary.totalBenefits}</p>
            <p className="font-mono-data text-text-secondary mt-1 text-[11px] tracking-[0.03em] uppercase">
              Saved benefits
            </p>
          </div>
          <div>
            <p className="font-mono-data text-text-primary text-2xl font-semibold">
              {summary.benefitsWithValue}
            </p>
            <p className="font-mono-data text-text-secondary mt-1 text-[11px] tracking-[0.03em] uppercase">
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
