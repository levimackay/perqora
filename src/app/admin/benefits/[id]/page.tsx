import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "../../_components/admin-nav";
import { freshnessToneClass } from "../../_components/status-styles";
import { describeFreshness } from "@/lib/freshness";
import { updateBenefitVerificationAction } from "./actions";

export const metadata: Metadata = { title: "Edit benefit", robots: { index: false, follow: false } };

const VERIFICATION_STATUSES = ["VERIFIED", "NEEDS_REVIEW", "STALE", "UNVERIFIED"] as const;
const VERIFICATION_METHODS = [
  "MANUAL_REVIEW",
  "AUTOMATED_FETCH",
  "COMMUNITY_REPORT",
  "PROVIDER_CONFIRMATION",
] as const;
const VERIFICATION_RESULTS = ["STILL_ACCURATE", "CHANGED", "EXPIRED", "UNABLE_TO_VERIFY"] as const;

const fieldClass =
  "rounded-md border border-control-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus-visible:border-accent";

export default async function AdminBenefitEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const benefit = await prisma.benefit.findUnique({
    where: { id },
    include: { verifications: { orderBy: { createdAt: "desc" }, take: 10 } },
  });

  if (!benefit) notFound();

  const freshness = describeFreshness(benefit.verificationStatus, benefit.lastVerifiedAt);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <AdminNav active="/admin/benefits" />

      <h1 className="text-text-primary mt-6 text-2xl font-semibold">{benefit.name}</h1>
      <p className="text-text-secondary text-sm">{benefit.provider}</p>
      <p className={`mt-3 font-mono text-sm ${freshnessToneClass(freshness.tone)}`}>{freshness.text}</p>

      <form
        action={updateBenefitVerificationAction}
        className="border-surface-border bg-surface-raised mt-6 flex flex-col gap-5 rounded-md border p-5"
      >
        <input type="hidden" name="benefitId" value={benefit.id} />

        <Field label="Verification status">
          <select name="verificationStatus" defaultValue={benefit.verificationStatus} className={fieldClass}>
            {VERIFICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Verification method">
          <select
            name="verificationMethod"
            defaultValue={benefit.verificationMethod ?? "MANUAL_REVIEW"}
            className={fieldClass}
          >
            {VERIFICATION_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Verification result (this check)">
          <select name="verificationResult" defaultValue="STILL_ACCURATE" className={fieldClass}>
            {VERIFICATION_RESULTS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Confidence score (0 to 100)">
          <input
            type="number"
            name="confidenceScore"
            min={0}
            max={100}
            defaultValue={benefit.confidenceScore}
            className={fieldClass}
          />
        </Field>

        <Field label="Expires at">
          <input
            type="date"
            name="expiresAt"
            defaultValue={benefit.expiresAt ? benefit.expiresAt.toISOString().slice(0, 10) : ""}
            className={fieldClass}
          />
        </Field>

        <label className="text-text-primary flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={benefit.isActive} />
          Active (visible on the public site)
        </label>

        <Field label="Notes for this check (optional)">
          <textarea name="notes" rows={3} className={fieldClass} />
        </Field>

        <p className="text-text-secondary text-xs">
          Saving sets &quot;last verified&quot; to now, records a verification entry, and writes an audit log
          entry. It does not change the benefit&apos;s description, pricing, or eligibility text.
        </p>

        <button
          type="submit"
          className="bg-accent text-text-on-accent hover:bg-accent-600 self-start rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-150"
        >
          Save verification
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-text-secondary text-xs font-medium tracking-wide uppercase">
          Verification history
        </h2>
        <ul className="divide-surface-border border-surface-border mt-3 divide-y border-t">
          {benefit.verifications.length === 0 ? (
            <li className="text-text-secondary py-3 text-sm">No verification checks recorded yet.</li>
          ) : (
            benefit.verifications.map((verification) => (
              <li
                key={verification.id}
                className="text-text-primary flex flex-wrap items-center justify-between gap-3 py-3 font-mono text-xs"
              >
                <span>{verification.result}</span>
                <span className="text-text-secondary">{verification.method}</span>
                <span className="text-text-secondary">{verification.checkedBy ?? "system"}</span>
                <span className="text-text-secondary">{verification.createdAt.toISOString()}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-text-secondary flex flex-col gap-1 text-sm">
      {label}
      {children}
    </label>
  );
}
