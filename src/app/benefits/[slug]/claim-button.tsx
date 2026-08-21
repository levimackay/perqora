"use client";

import { logClaimClick } from "@/app/benefits/[slug]/actions";

export function ClaimButton({ benefitId, claimUrl }: { benefitId: string; claimUrl: string }) {
  return (
    <a
      href={claimUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        // Fire-and-forget: the tab opens regardless of whether this resolves.
        logClaimClick(benefitId).catch(() => undefined);
      }}
      className="bg-accent text-text-on-accent hover:bg-accent-600 focus-visible:outline-accent inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-[15px] font-medium transition-colors duration-150 ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      Claim benefit &rarr;
    </a>
  );
}
