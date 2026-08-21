import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "../_components/admin-nav";
import { FilterLink } from "../_components/filter-link";
import { freshnessToneClass } from "../_components/status-styles";
import { describeFreshness } from "@/lib/freshness";
import type { VerificationStatus } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Benefits", robots: { index: false, follow: false } };

const STATUSES: VerificationStatus[] = ["VERIFIED", "NEEDS_REVIEW", "STALE", "UNVERIFIED"];

export default async function AdminBenefitsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filterStatus = STATUSES.includes(status as VerificationStatus)
    ? (status as VerificationStatus)
    : undefined;

  const benefits = await prisma.benefit.findMany({
    where: filterStatus ? { verificationStatus: filterStatus } : undefined,
    orderBy: [{ verificationStatus: "asc" }, { lastVerifiedAt: "asc" }],
    include: { category: true },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <AdminNav active="/admin/benefits" />
      <h1 className="text-text-primary mt-6 text-2xl font-semibold">Benefits</h1>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <FilterLink label="All" href="/admin/benefits" active={!filterStatus} />
        {STATUSES.map((s) => (
          <FilterLink key={s} label={s} href={`/admin/benefits?status=${s}`} active={filterStatus === s} />
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="border-surface-border text-text-secondary border-b text-left text-xs uppercase">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Category</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Freshness</th>
              <th className="py-2 font-medium">Active</th>
            </tr>
          </thead>
          <tbody className="divide-surface-border divide-y">
            {benefits.map((benefit) => {
              const freshness = describeFreshness(benefit.verificationStatus, benefit.lastVerifiedAt);
              return (
                <tr key={benefit.id}>
                  <td className="py-2 pr-4">
                    <Link
                      href={`/admin/benefits/${benefit.id}`}
                      className="text-text-primary hover:text-accent"
                    >
                      {benefit.name}
                    </Link>
                    <p className="text-text-secondary text-xs">{benefit.provider}</p>
                  </td>
                  <td className="text-text-secondary py-2 pr-4">{benefit.category.name}</td>
                  <td className="py-2 pr-4">
                    <StatusChip status={benefit.verificationStatus} />
                  </td>
                  <td className={`py-2 pr-4 font-mono text-xs ${freshnessToneClass(freshness.tone)}`}>
                    {freshness.text}
                  </td>
                  <td className="text-text-secondary py-2">{benefit.isActive ? "Yes" : "No"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {benefits.length === 0 ? (
          <p className="text-text-secondary py-6 text-sm">No benefits match this filter.</p>
        ) : null}
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: VerificationStatus }) {
  const tone =
    status === "VERIFIED"
      ? "text-status-verified border-status-verified/40"
      : status === "NEEDS_REVIEW"
        ? "text-status-review border-status-review/40"
        : status === "STALE"
          ? "text-status-stale border-status-stale/40"
          : "text-text-secondary border-surface-border";

  return <span className={`rounded-full border px-2 py-0.5 font-mono text-xs ${tone}`}>{status}</span>;
}
