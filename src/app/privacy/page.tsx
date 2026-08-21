import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Perqora collects, what it doesn't, and why.",
};

export default function PrivacyPage() {
  return (
    <Container as="section" className="max-w-3xl py-10 sm:py-16">
      <header className="border-b border-surface-border pb-6">
        <p className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">Legal</p>
        <h1 className="mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em] text-text-primary">
          Privacy
        </h1>
        <p className="mt-3 text-sm text-text-secondary">
          Perqora has no accounts, so there is no login data, password, or profile to describe here. This
          page covers everything that is actually collected.
        </p>
      </header>

      <div className="mt-8 space-y-10">
        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">No accounts, no student identity</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            There is no sign-up and no login anywhere on Perqora. No student email is stored anywhere except
            the two places described below, and neither one ties an email to a persistent identity or a
            login.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Anonymous personalization cookie</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            When you save a benefit or set preferences like your school or interests, Perqora sets an
            httpOnly cookie containing a random device id, not anything about you. That id maps to a device
            profile row (your saved benefits, chosen interests, school) with no name, email, or account
            attached. Clearing your cookies or using a different browser starts a new, empty profile.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Submission email (optional)</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            The{" "}
            <Link
              href="/submit"
              className="rounded-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              submit a benefit
            </Link>{" "}
            form has
            an optional email field. It exists for one reason: so a reviewer can follow up if your
            submission is unclear. It is never required, never shown publicly, and is not linked to your
            device cookie or to any other data on the site.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Admin area</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            The admin area used to review submissions and manage benefits is gated by a single shared access
            token, not a personal account, and stores no personal information about maintainers.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Analytics</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Perqora records anonymous product usage counters: what was searched, which benefits and
            categories were viewed, which claim links were clicked, and which benefits were saved. These
            events store none of the following: an IP address, a device or browser fingerprint, or any
            identifier that could tie an event back to a specific visitor. There are no third-party trackers,
            ad pixels, or analytics scripts on this site.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Changes to this page</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Perqora is open source, so any change to what data is collected shows up as a change to the
            public codebase, not a silent update to this page.
          </p>
        </section>
      </div>
    </Container>
  );
}
