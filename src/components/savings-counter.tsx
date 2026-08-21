"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { formatCents } from "@/lib/money";
import type { SavingsSummary } from "@/lib/benefits";

const DURATION_MS = 900;
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCE_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCE_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/** Reads prefers-reduced-motion without an effect->setState round trip. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

/**
 * Counts a value up from 0 to `target` over DURATION_MS using
 * requestAnimationFrame, per DESIGN.md section 7 ("the hero stat counts up
 * from 0 over 900ms"). Skips straight to the final value when the visitor
 * has prefers-reduced-motion set, by never animating in the first place.
 */
function useCountUp(target: number) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = target > 0 && !prefersReducedMotion;

  const [animatedValue, setAnimatedValue] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldAnimate) return;

    // No manual reset to 0 needed: state already starts at 0, and the first
    // rAF callback below lands at (near-)zero progress anyway.
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(target * eased));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [target, shouldAnimate]);

  return shouldAnimate ? animatedValue : target;
}

export function SavingsCounter({
  summary,
  label = "Potential annual value",
}: {
  summary: SavingsSummary;
  label?: string;
}) {
  const value = useCountUp(summary.totalAnnualCents);
  const unpriced = summary.totalBenefits - summary.benefitsWithValue;

  if (summary.totalBenefits === 0) {
    return (
      <div>
        <p className="font-mono-data text-[11px] tracking-[0.03em] text-text-secondary uppercase">{label}</p>
        <p className="mt-2 text-[30px] leading-[1.05] font-bold tracking-[-0.02em] text-text-secondary">
          No benefits matched yet
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-mono-data text-[11px] tracking-[0.03em] text-text-secondary uppercase">{label}</p>
      <p className="font-mono-data mt-2 text-[56px] leading-[0.95] font-extrabold tracking-[-0.03em] text-text-primary sm:text-[96px]">
        {formatCents(value, summary.currency)}
      </p>
      {unpriced > 0 && (
        <p className="mt-3 max-w-[65ch] text-sm text-text-secondary">
          {summary.benefitsWithValue} of {summary.totalBenefits} benefit
          {summary.totalBenefits === 1 ? "" : "s"} priced above. {unpriced} more unlock value that varies by
          usage (cloud credits, bundles, conditional pricing) and are not counted in this number.
        </p>
      )}
    </div>
  );
}
