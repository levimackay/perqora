import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "About",
  description: "What Perqora is, who maintains it, and how it decides what counts as verified.",
};

export default function AboutPage() {
  return (
    <Container as="section" className="max-w-3xl py-10 sm:py-16">
      <header className="border-b border-surface-border pb-6">
        <p className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">About</p>
        <h1 className="mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em] text-text-primary">
          A directory that shows its work
        </h1>
      </header>

      <div className="mt-8 space-y-10">
        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">The problem</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Student discount sites are usually a wall of cards with no date on them. A deal that expired two
            years ago sits next to one that&apos;s still live, presented with the exact same confidence. Nothing
            on the page tells you which is which, so you have to click through and find out yourself, every
            time.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">The approach</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Perqora treats verification as the product, not a footnote. Every benefit carries a status
            (verified, needs review, stale, or unverified) and a last-checked date, rendered the way a build
            status shows up in a CI dashboard, because that&apos;s the honest register for this kind of claim.
            See{" "}
            <Link href="/how-it-works" className="rounded-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              how it works
            </Link>{" "}
            for exactly what each status means and how a benefit moves between them.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">What &quot;verified&quot; actually means here</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            The catalog is seeded from real, publicly documented student programs (the GitHub Student
            Developer Pack, JetBrains, Azure for Students, and others like them). Being seeded from a real
            program is not the same as being independently reconfirmed against the provider&apos;s live page. A
            newly seeded benefit is marked &quot;needs review&quot; until someone checks the actual current offer and
            confirms it still holds. That&apos;s a deliberate, visible state, not a bug, and not something to hide
            behind a confident-looking green checkmark.
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Who maintains this</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Perqora is an open-source, community-maintained project. It is not a company, has no funding, and
            has no team to introduce, just a public codebase anyone can read, run, or submit changes to. The
            source is on{" "}
            <a
              href="https://github.com/levimackay/perqora"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-[19px] font-semibold text-text-primary">Help keep it accurate</h2>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-text-secondary">
            Know a real student benefit that isn&apos;t listed, or spotted one that&apos;s gone stale? Both are
            useful.{" "}
            <Link href="/submit" className="rounded-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              Submit a benefit
            </Link>{" "}
            to add one to the review queue.
          </p>
        </section>
      </div>
    </Container>
  );
}
