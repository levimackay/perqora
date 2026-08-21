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

      <h1 className="mt-6 text-2xl font-semibold text-text-primary">{benefit.name}</h1>
      <p className="text-sm text-text-secondary">{benefit.provider}</p>
      <p className={`mt-3 font-mono text-sm ${freshnessToneClass(freshness.tone)}`}>{freshness.text}</p>

      <form
        action={updateBenefitVerificationAction}
        className="mt-6 flex flex-col gap-5 rounded-md border border-surface-border bg-surface-raised p-5"
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

        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="checkbox" name="isActive" defaultChecked={benefit.isActive} />
          Active (visible on the public site)
        </label>

        <Field label="Notes for this check (optional)">
          <textarea name="notes" rows={3} className={fieldClass} />
        </Field>

        <p className="text-xs text-text-secondary">
          Saving sets &quot;last verified&quot; to now, records a verification entry, and writes an audit log
          entry. It does not change the benefit&apos;s description, pricing, or eligibility text.
        </p>

        <button
          type="submit"
          className="self-start rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-text-on-accent transition-colors duration-150 hover:bg-accent-600"
        >
          Save verification
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-xs font-medium tracking-wide text-text-secondary uppercase">Verification history</h2>
        <ul className="mt-3 divide-y divide-surface-border border-t border-surface-border">
          {benefit.verifications.length === 0 ? (
            <li className="py-3 text-sm text-text-secondary">No verification checks recorded yet.</li>
          ) : (
            benefit.verifications.map((verification) => (
              <li
                key={verification.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 font-mono text-xs text-text-primary"
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
    <label className="flex flex-col gap-1 text-sm text-text-secondary">
      {label}
      {children}
    </label>
  );
}
