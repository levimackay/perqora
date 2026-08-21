import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { StatusChip } from "@/components/ui/status-chip";
import { BENEFIT_TYPE_LABELS } from "@/lib/constants";
import type { FreshnessLabel } from "@/lib/freshness";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How eligibility detection, benefit types, and verification statuses work on Perqora, and how community submissions get reviewed.",
};

const BENEFIT_TYPE_DESCRIPTIONS: Record<string, string> = {
  FREE: "No cost to you, no student pricing tier involved, just free.",
  DISCOUNT: "A percentage or flat amount off the regular price, applied at checkout or sign-up.",
  CREDIT: "Account credit toward usage, most common with cloud and infrastructure providers.",
  FREE_TRIAL: "A time-limited free period on a product that is normally paid, converts to paid after.",
  EDUCATION_PRICING: "A standing lower price tier for students and educators, not a temporary promotion.",
  STUDENT_PRICING: "A student-specific price, usually verified against a .edu email or student ID.",
  UNIVERSITY_PROVIDED: "Provided through your school directly (a site license, a lab account), not the vendor.",
  CONDITIONAL: "Depends on something beyond just being a student, a major, a course, a region, a cohort.",
  REGION_SPECIFIC: "Only available in specific countries or regions, check the listing before counting on it.",
};

const STATUS_ROWS: Array<{ freshness: FreshnessLabel; description: string }> = [
  {
    freshness: { text: "Verified", tone: "verified" },
    description:
      "Someone confirmed the offer against the provider's live page recently, and it still matches what's listed.",
  },
  {
    freshness: { text: "Verification needed", tone: "review" },
    description:
      "Seeded from a real, known program but not yet independently reconfirmed, or it's been long enough since the last check that it needs a fresh look.",
  },
  {
    freshness: { text: "Offer may have changed", tone: "stale" },
    description:
      "It was verified once, but enough time has passed (or a signal came in) that the terms may no longer be accurate. Check the provider's page before relying on it.",
  },
];

export default function HowItWorksPage() {
  return (
    <Container as="section" className="max-w-3xl py-10 sm:py-16">
      <header className="border-b border-surface-border pb-6">
        <p className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">How it works</p>
        <h1 className="mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em] text-text-primary">
          The mechanics, not the pitch
        </h1>
      </header>

      <div className="mt-8 space-y-12">
        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Eligibility detection</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Perqora doesn&apos;t verify enrollment through a third-party service. Instead, when you enter your
            school or email domain, it matches your domain against a directory of known school email domains
            (for example a .edu suffix, or a school&apos;s specific domain) and shows benefits whose eligibility
            hints line up. This is a hint for you, not a gate: it narrows the list to what&apos;s likely relevant,
            it doesn&apos;t verify your enrollment with the provider. Every benefit still requires you to
            confirm eligibility on the provider&apos;s own site when you claim it.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Benefit types</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Every listing carries one of nine benefit types, shown as a small label on the row instead of
            buried in the description.
          </p>
          <dl className="mt-5 divide-y divide-surface-border border-y border-surface-border">
            {Object.entries(BENEFIT_TYPE_LABELS).map(([key, label]) => (
              <div key={key} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="font-mono-data text-[11px] tracking-[0.03em] text-text-primary uppercase">
                  {label}
                </dt>
                <dd className="text-sm leading-[1.6] text-text-secondary">
                  {BENEFIT_TYPE_DESCRIPTIONS[key] ?? ""}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Verification statuses</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            A benefit moves through these states over time. Nothing stays &quot;verified&quot; forever by default,
            confidence decays until someone rechecks it.
          </p>
          <div className="mt-5 space-y-4">
            {STATUS_ROWS.map((row) => (
              <div key={row.freshness.text} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
                <div className="shrink-0 sm:w-44">
                  <StatusChip freshness={row.freshness} />
                </div>
                <p className="text-sm leading-[1.6] text-text-secondary">{row.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Community submissions</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Anyone can submit a benefit they know about. A submission never publishes automatically. It lands
            in a review queue as &quot;pending,&quot; a maintainer checks the provider&apos;s page directly, and only
            then does it either become a listing (starting at &quot;needs review&quot; the same as any seeded
            benefit) or get rejected or sent back for more information. This is the same gate every benefit in
            the catalog went through, community-sourced or not.
          </p>
        </section>
      </div>
    </Container>
  );
}
