import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "./_components/admin-nav";

export const metadata: Metadata = { title: "Admin dashboard", robots: { index: false, follow: false } };

export default async function AdminDashboardPage() {
  const [pendingSubmissions, benefitsByStatus, recentAudit] = await Promise.all([
    prisma.submission.count({ where: { status: "PENDING" } }),
    prisma.benefit.groupBy({ by: ["verificationStatus"], _count: { _all: true } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <AdminNav active="/admin" />

      <h1 className="text-text-primary mt-6 text-2xl font-semibold">Dashboard</h1>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Pending submissions" value={pendingSubmissions} />
        {benefitsByStatus.map((row) => (
          <StatTile key={row.verificationStatus} label={row.verificationStatus} value={row._count._all} />
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-text-secondary text-xs font-medium tracking-wide uppercase">Recent activity</h2>
        <ul className="divide-surface-border border-surface-border mt-3 divide-y border-t">
          {recentAudit.length === 0 ? (
            <li className="text-text-secondary py-3 text-sm">No audit log entries yet.</li>
          ) : (
            recentAudit.map((entry) => (
              <li
                key={entry.id}
                className="text-text-primary flex flex-wrap items-center justify-between gap-3 py-3 font-mono text-xs"
              >
                <span>{entry.action}</span>
                <span className="text-text-secondary">
                  {entry.targetType}:{entry.targetId}
                </span>
                <span className="text-text-secondary">{entry.createdAt.toISOString()}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-surface-border bg-surface-raised rounded-md border px-4 py-3">
      <p className="text-text-primary font-mono text-2xl">{value}</p>
      <p className="text-text-secondary mt-1 text-xs">{label}</p>
    </div>
  );
}
