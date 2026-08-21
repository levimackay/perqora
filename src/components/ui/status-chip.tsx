import { cx } from "@/lib/utils";
import type { FreshnessLabel } from "@/lib/freshness";

const TONE_STYLES: Record<FreshnessLabel["tone"], string> = {
  verified: "text-status-verified border-status-verified/30 bg-status-verified/10",
  review: "text-status-review border-status-review/30 bg-status-review/10",
  stale: "text-status-stale border-status-stale/40 bg-status-stale/10",
};

const TONE_DOT: Record<FreshnessLabel["tone"], string> = {
  verified: "bg-status-verified",
  review: "bg-status-review",
  stale: "bg-status-stale",
};

export function StatusChip({ freshness, pulse = false }: { freshness: FreshnessLabel; pulse?: boolean }) {
  return (
    <span
      className={cx(
        "font-mono-data inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] tracking-[0.03em] uppercase",
        TONE_STYLES[freshness.tone],
      )}
    >
      <span className={cx("h-1.5 w-1.5 rounded-full", TONE_DOT[freshness.tone], pulse && "animate-verify-pulse")} />
      {freshness.text}
    </span>
  );
}
