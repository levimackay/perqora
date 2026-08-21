import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for using Perqora, a free, open-source, community-maintained directory.",
};

export default function TermsPage() {
  return (
    <Container as="section" className="max-w-3xl py-10 sm:py-16">
      <header className="border-b border-surface-border pb-6">
        <p className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">Legal</p>
        <h1 className="mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em] text-text-primary">
          Terms
        </h1>
      </header>

      <div className="mt-8 space-y-10">
        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">What this is</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Perqora is a free, open-source, community-maintained directory of student benefits. It is not a
            company, does not charge for access, and offers no paid tier. Using the site does not create any
            account, subscription, or contract beyond these terms.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Offers can change</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Listings describe offers made by third-party providers. Prices, eligibility, and availability
            belong to those providers and can change at any time, including after a listing was marked
            verified. A verification date tells you when something was last checked, not that it is
            guaranteed to still be accurate today. Always confirm current terms on the provider&apos;s own site
            before relying on an offer.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Not a party to any transaction</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Claiming a benefit means leaving Perqora and dealing directly with the provider. Perqora is not a
            party to that transaction, does not process payments, does not fulfill any offer, and is not
            responsible for a provider&apos;s pricing, availability, customer service, or terms.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">No affiliation implied</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Mentioning a company, product, or university on this site does not imply that they endorse,
            sponsor, or are affiliated with Perqora, unless stated otherwise. All trademarks, product names,
            and school names belong to their respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Submissions</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Anything submitted through the submission form may be reviewed, edited, published, rejected, or
            removed at a maintainer&apos;s discretion. Don&apos;t submit anything you don&apos;t have the right to
            share publicly.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">No warranty</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Perqora is provided as-is, without warranty of any kind, express or implied, including accuracy,
            availability, or fitness for a particular purpose. Use it as a starting point for research, not
            as a final source of truth.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Changes</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            These terms can change as the project changes. Because the codebase is public, any change to
            these terms is visible in the project&apos;s history.
          </p>
        </section>
      </div>
    </Container>
  );
}
