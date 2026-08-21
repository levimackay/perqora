import { describe, expect, it } from "vitest";
import { describeFreshness } from "@/lib/freshness";

const NOW = new Date("2026-08-20T00:00:00Z");
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);

describe("describeFreshness", () => {
  it("never claims a date for unverified benefits", () => {
    expect(describeFreshness("UNVERIFIED", null, NOW)).toEqual({
      text: "Verification needed",
      tone: "review",
    });
  });

  it("labels a benefit verified moments ago as verified today", () => {
    expect(describeFreshness("VERIFIED", daysAgo(0), NOW).text).toBe("Verified today");
  });

  it("labels a benefit verified one day ago distinctly", () => {
    expect(describeFreshness("VERIFIED", daysAgo(1), NOW).text).toBe("Verified yesterday");
  });

  it("labels a benefit verified within the week by day count", () => {
    expect(describeFreshness("VERIFIED", daysAgo(5), NOW).text).toBe("Verified 5 days ago");
  });

  it("labels a benefit verified within the month generically", () => {
    expect(describeFreshness("VERIFIED", daysAgo(20), NOW).text).toBe("Verified this month");
  });

  it("surfaces staleness once verification is old enough, even with VERIFIED status", () => {
    const result = describeFreshness("VERIFIED", daysAgo(90), NOW);
    expect(result.tone).toBe("stale");
    expect(result.text).toContain("90 days ago");
  });

  it("marks STALE status distinctly regardless of last-checked date", () => {
    const result = describeFreshness("STALE", daysAgo(10), NOW);
    expect(result.tone).toBe("stale");
    expect(result.text).toContain("Offer may have changed");
  });

  it("marks NEEDS_REVIEW status distinctly", () => {
    const result = describeFreshness("NEEDS_REVIEW", daysAgo(3), NOW);
    expect(result.tone).toBe("review");
    expect(result.text).toContain("Verification needed");
  });
});
