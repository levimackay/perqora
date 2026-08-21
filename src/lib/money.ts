import type { PricePeriod } from "@/generated/prisma/client";

const MONTHS_PER_YEAR = 12;

/**
 * Normalizes any price period to an annual figure so benefits with different
 * billing cadences (monthly subscriptions vs. one-time or annual licenses)
 * can be summed into a single "potential annual value" figure.
 */
export function annualizeCents(cents: number, period: PricePeriod | null): number {
  if (period === "MONTHLY") return cents * MONTHS_PER_YEAR;
  return cents;
}

export function formatCents(cents: number | null | undefined, currency = "USD"): string {
  if (cents === null || cents === undefined) return "Value varies";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatPeriod(period: PricePeriod | null): string {
  switch (period) {
    case "MONTHLY":
      return "/mo";
    case "ANNUAL":
      return "/yr";
    default:
      return "";
  }
}
