import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "../_components/admin-nav";

export const metadata: Metadata = { title: "Audit log", robots: { index: false, follow: false } };

const PAGE_SIZE = 50;

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const [entries, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.auditLog.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <AdminNav active="/admin/audit-log" />
      <h1 className="text-text-primary mt-6 text-2xl font-semibold">Audit log</h1>
      <p className="text-text-secondary mt-1 text-sm">
        Read-only history of admin actions, most recent first ({total} total).
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="border-surface-border text-text-secondary border-b text-left text-xs uppercase">
              <th className="py-2 pr-4 font-medium">Action</th>
              <th className="py-2 pr-4 font-medium">Actor</th>
              <th className="py-2 pr-4 font-medium">Target</th>
              <th className="py-2 font-medium">When</th>
            </tr>
          </thead>
          <tbody className="divide-surface-border divide-y font-mono text-xs">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="text-text-primary py-2 pr-4">{entry.action}</td>
                <td className="text-text-secondary py-2 pr-4">{entry.actor}</td>
                <td className="text-text-secondary py-2 pr-4">
                  {entry.targetType}:{entry.targetId}
                </td>
                <td className="text-text-secondary py-2">{entry.createdAt.toISOString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 ? (
          <p className="text-text-secondary py-6 text-sm">No audit log entries yet.</p>
        ) : null}
      </div>

      {totalPages > 1 ? (
        <nav className="mt-6 flex items-center gap-3 text-sm">
          {page > 1 ? (
            <Link
              href={`/admin/audit-log?page=${page - 1}`}
              className="border-surface-border text-text-secondary hover:text-text-primary rounded-md border px-3 py-1.5"
            >
              Previous
            </Link>
          ) : null}
          <span className="text-text-secondary">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/admin/audit-log?page=${page + 1}`}
              className="border-surface-border text-text-secondary hover:text-text-primary rounded-md border px-3 py-1.5"
            >
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
