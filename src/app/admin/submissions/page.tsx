import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "../_components/admin-nav";
import { FilterLink } from "../_components/filter-link";
import { reviewSubmissionAction } from "./actions";
import type { SubmissionStatus } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Submissions", robots: { index: false, follow: false } };

const STATUSES: SubmissionStatus[] = ["PENDING", "NEEDS_INFO", "APPROVED", "REJECTED"];

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filterStatus = STATUSES.includes(status as SubmissionStatus) ? (status as SubmissionStatus) : undefined;

  const submissions = await prisma.submission.findMany({
    where: filterStatus ? { status: filterStatus } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <AdminNav active="/admin/submissions" />
      <h1 className="mt-6 text-2xl font-semibold text-text-primary">Submissions</h1>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <FilterLink label="All" href="/admin/submissions" active={!filterStatus} />
        {STATUSES.map((s) => (
          <FilterLink key={s} label={s} href={`/admin/submissions?status=${s}`} active={filterStatus === s} />
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {submissions.length === 0 ? (
          <li className="text-sm text-text-secondary">No submissions match this filter.</li>
        ) : (
          submissions.map((submission) => {
            const canReview = submission.status === "PENDING" || submission.status === "NEEDS_INFO";

            return (
              <li key={submission.id} className="rounded-md border border-surface-border bg-surface-raised p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-text-primary">{submission.benefitName}</p>
                    <p className="text-sm text-text-secondary">{submission.provider}</p>
                  </div>
                  <span className="rounded-sm border border-surface-border px-2 py-0.5 font-mono text-xs text-text-secondary">
                    {submission.status}
                  </span>
                </div>

                <dl className="mt-3 flex flex-col gap-1 text-sm text-text-secondary">
                  <div>
                    <dt className="inline font-medium text-text-primary">URL: </dt>
                    <dd className="inline break-all">{submission.url}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-text-primary">Category: </dt>
                    <dd className="inline">{submission.category}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-text-primary">Description: </dt>
                    <dd className="inline">{submission.description}</dd>
                  </div>
                  {submission.studentRequirements ? (
                    <div>
                      <dt className="inline font-medium text-text-primary">Requirements: </dt>
                      <dd className="inline">{submission.studentRequirements}</dd>
                    </div>
                  ) : null}
                  {submission.submitterEmail ? (
                    <div>
                      <dt className="inline font-medium text-text-primary">Submitter: </dt>
                      <dd className="inline">{submission.submitterEmail}</dd>
                    </div>
                  ) : null}
                </dl>

                {submission.reviewNotes ? (
                  <p className="mt-3 text-sm text-text-secondary">
                    Review notes: <span className="text-text-primary">{submission.reviewNotes}</span>
                  </p>
                ) : null}

                {canReview ? (
                  <>
                    <form action={reviewSubmissionAction} className="mt-4 flex flex-wrap items-end gap-3">
                      <input type="hidden" name="submissionId" value={submission.id} />
                      <label className="flex min-w-64 flex-1 flex-col gap-1 text-xs text-text-secondary">
                        Review notes (optional)
                        <input
                          type="text"
                          name="reviewNotes"
                          className="rounded-md border border-control-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus-visible:border-accent"
                        />
                      </label>
                      <button
                        type="submit"
                        name="status"
                        value="APPROVED"
                        className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-text-on-accent transition-colors duration-150 hover:bg-accent-600"
                      >
                        Approve
                      </button>
                      <button
                        type="submit"
                        name="status"
                        value="NEEDS_INFO"
                        className="rounded-md border border-control-border px-3 py-2 text-sm text-text-primary transition-colors duration-150 hover:border-accent/50"
                      >
                        Needs info
                      </button>
                      <button
                        type="submit"
                        name="status"
                        value="REJECTED"
                        className="rounded-md border border-control-border px-3 py-2 text-sm text-text-secondary transition-colors duration-150 hover:border-status-error/50 hover:text-status-error"
                      >
                        Reject
                      </button>
                    </form>
                    <p className="mt-2 text-xs text-text-secondary">
                      Approving marks this idea worth adding. It does not publish a benefit; a verified listing
                      still has to be created by hand in Benefits with real eligibility, pricing, and source
                      details.
                    </p>
                  </>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
