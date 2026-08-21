import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Security",
  description: "How to report a vulnerability in Perqora, and how the codebase handles access and secrets.",
};

export default function SecurityPage() {
  return (
    <Container as="section" className="max-w-3xl py-10 sm:py-16">
      <header className="border-surface-border border-b pb-6">
        <p className="font-mono-data text-text-secondary text-xs tracking-[0.03em] uppercase">Legal</p>
        <h1 className="text-text-primary mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em]">
          Security
        </h1>
      </header>

      <div className="mt-8 space-y-10">
        <section>
          <h2 className="text-text-primary text-[19px] font-semibold">Reporting a vulnerability</h2>
          <p className="text-text-secondary mt-3 max-w-[65ch] text-[16px] leading-[1.6]">
            If you find a security issue, please report it through GitHub&apos;s private advisory flow at{" "}
            <a
              href="https://github.com/levimackay/perqora/security"
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent hover:underline"
            >
              github.com/levimackay/perqora/security
            </a>{" "}
            rather than a public issue. Details on scope and response process are in this repository&apos;s{" "}
            <code className="font-mono-data bg-surface-raised rounded-sm px-1.5 py-0.5 text-[13px]">
              SECURITY.md
            </code>
            . Please practice responsible disclosure: give the project a reasonable window to fix the issue
            before sharing it publicly.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary text-[19px] font-semibold">The codebase is public</h2>
          <p className="text-text-secondary mt-3 max-w-[65ch] text-[16px] leading-[1.6]">
            Perqora is open source. Every route, query, and validation rule in this app is auditable, nothing
            security-relevant is hidden behind a closed-source layer. That cuts both ways: it also means
            anyone can read exactly how access control works, which is why the details below are stated
            plainly rather than left vague.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary text-[19px] font-semibold">No client-side secrets</h2>
          <p className="text-text-secondary mt-3 max-w-[65ch] text-[16px] leading-[1.6]">
            No API keys, tokens, or credentials are ever shipped to the browser. Anything that needs a secret
            (database access, admin gating) stays server-side.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary text-[19px] font-semibold">Admin access</h2>
          <p className="text-text-secondary mt-3 max-w-[65ch] text-[16px] leading-[1.6]">
            The admin area is gated by a single shared bearer token, checked at the proxy layer before any
            admin route or admin action runs. There are no per-maintainer accounts and no role-based access
            control. That is a deliberate v1 simplification appropriate for a single-maintainer, volunteer-run
            project, not an enterprise access model. If Perqora grows more maintainers, that is the first
            access-control change on the list.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary text-[19px] font-semibold">No third-party trackers</h2>
          <p className="text-text-secondary mt-3 max-w-[65ch] text-[16px] leading-[1.6]">
            There are no ad pixels, third-party analytics scripts, or embedded trackers on this site. See{" "}
            <Link
              href="/privacy"
              className="text-accent focus-visible:outline-accent rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              privacy
            </Link>{" "}
            for what limited, anonymous analytics is collected in-house.
          </p>
        </section>
      </div>
    </Container>
  );
}
