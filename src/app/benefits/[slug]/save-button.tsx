"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/utils";

type SavedEntry = { benefitId?: string; benefit?: { id?: string } };

export function SaveButton({ benefitId }: { benefitId: string }) {
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<"idle" | "checking" | "working" | "error">("checking");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/saved-benefits")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("failed"))))
      .then((data: SavedEntry[]) => {
        if (cancelled) return;
        const isSaved = Array.isArray(data)
          ? data.some((entry) => entry.benefitId === benefitId || entry.benefit?.id === benefitId)
          : false;
        setSaved(isSaved);
        setStatus("idle");
      })
      .catch(() => {
        if (!cancelled) setStatus("idle");
      });
    return () => {
      cancelled = true;
    };
  }, [benefitId]);

  async function toggle() {
    const next = !saved;
    setSaved(next); // optimistic
    setStatus("working");
    try {
      const res = next
        ? await fetch("/api/saved-benefits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ benefitId }),
          })
        : await fetch(`/api/saved-benefits/${benefitId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setStatus("idle");
    } catch {
      setSaved(!next); // revert
      setStatus("error");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={status === "checking"}
      aria-pressed={saved}
      className={cx(
        "focus-visible:outline-accent inline-flex items-center justify-center gap-2 rounded-md border px-6 py-3 text-[15px] font-medium transition-colors duration-150 ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50",
        saved
          ? "border-accent text-accent"
          : "border-surface-border text-text-primary hover:border-accent/50",
      )}
    >
      {saved ? "Saved" : "Save for later"}
    </button>
  );
}
