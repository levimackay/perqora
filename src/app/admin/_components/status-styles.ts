import type { FreshnessLabel } from "@/lib/freshness";

export function freshnessToneClass(tone: FreshnessLabel["tone"]): string {
  switch (tone) {
    case "verified":
      return "text-status-verified";
    case "review":
      return "text-status-review";
    case "stale":
      return "text-status-stale";
  }
}
