import type { VerificationStatus } from "@/generated/prisma/client";

const DAY_MS = 1000 * 60 * 60 * 24;

export type FreshnessLabel = {
  text: string;
  tone: "verified" | "review" | "stale";
};

/**
 * Never claim authority a benefit doesn't have. A NEEDS_REVIEW or UNVERIFIED
 * record says so plainly instead of showing a confident-looking date.
 */
export function describeFreshness(
  status: VerificationStatus,
  lastVerifiedAt: Date | null,
  now: Date = new Date(),
): FreshnessLabel {
  if (status === "UNVERIFIED" || !lastVerifiedAt) {
    return { text: "Verification needed", tone: "review" };
  }

  const daysAgo = Math.floor((now.getTime() - lastVerifiedAt.getTime()) / DAY_MS);

  if (status === "STALE") {
    return { text: `Offer may have changed (checked ${daysAgo} days ago)`, tone: "stale" };
  }

  if (status === "NEEDS_REVIEW") {
    return { text: `Verification needed (last checked ${daysAgo} days ago)`, tone: "review" };
  }

  if (daysAgo <= 0) return { text: "Verified today", tone: "verified" };
  if (daysAgo === 1) return { text: "Verified yesterday", tone: "verified" };
  if (daysAgo < 7) return { text: `Verified ${daysAgo} days ago`, tone: "verified" };
  if (daysAgo < 31) return { text: "Verified this month", tone: "verified" };
  return { text: `Last checked ${daysAgo} days ago`, tone: "stale" };
}
