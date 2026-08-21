import { describe, expect, it } from "vitest";
import { annualizeCents, formatCents, formatPeriod } from "@/lib/money";

describe("annualizeCents", () => {
  it("multiplies monthly prices by 12", () => {
    expect(annualizeCents(1500, "MONTHLY")).toBe(18000);
  });

  it("leaves annual prices unchanged", () => {
    expect(annualizeCents(64900, "ANNUAL")).toBe(64900);
  });

  it("leaves one-time prices unchanged", () => {
    expect(annualizeCents(5000, "ONE_TIME")).toBe(5000);
  });

  it("leaves prices with no period unchanged", () => {
    expect(annualizeCents(5000, null)).toBe(5000);
  });
});

describe("formatCents", () => {
  it("formats whole-dollar amounts without decimals", () => {
    expect(formatCents(64900)).toBe("$649");
  });

  it("formats fractional amounts with decimals", () => {
    expect(formatCents(1550)).toBe("$15.50");
  });

  it("falls back to a clear label when the amount is unknown", () => {
    expect(formatCents(null)).toBe("Value varies");
    expect(formatCents(undefined)).toBe("Value varies");
  });
});

describe("formatPeriod", () => {
  it("returns a short suffix for recurring periods", () => {
    expect(formatPeriod("MONTHLY")).toBe("/mo");
    expect(formatPeriod("ANNUAL")).toBe("/yr");
  });

  it("returns an empty string for one-time or unknown periods", () => {
    expect(formatPeriod("ONE_TIME")).toBe("");
    expect(formatPeriod(null)).toBe("");
  });
});
