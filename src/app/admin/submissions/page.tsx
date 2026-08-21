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
  const filterStatus = STATUSES.includes(status as SubmissionStatus)
    ? (status as SubmissionStatus)
    : undefined;

  const submissions = await prisma.submission.findMany({
    where: filterStatus ? { status: filterStatus } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <AdminNav active="/admin/submissions" />
      <h1 className="text-text-primary mt-6 text-2xl font-semibold">Submissions</h1>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <FilterLink label="All" href="/admin/submissions" active={!filterStatus} />
        {STATUSES.map((s) => (
          <FilterLink key={s} label={s} href={`/admin/submissions?status=${s}`} active={filterStatus === s} />
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {submissions.length === 0 ? (
          <li className="text-text-secondary text-sm">No submissions match this filter.</li>
        ) : (
          submissions.map((submission) => {
            const canReview = submission.status === "PENDING" || submission.status === "NEEDS_INFO";

            return (
              <li
                key={submission.id}
                className="border-surface-border bg-surface-raised rounded-md border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-text-primary font-medium">{submission.benefitName}</p>
                    <p className="text-text-secondary text-sm">{submission.provider}</p>
                  </div>
                  <span className="border-surface-border text-text-secondary rounded-sm border px-2 py-0.5 font-mono text-xs">
                    {submission.status}
                  </span>
                </div>

                <dl className="text-text-secondary mt-3 flex flex-col gap-1 text-sm">
                  <div>
                    <dt className="text-text-primary inline font-medium">URL: </dt>
                    <dd className="inline break-all">{submission.url}</dd>
                  </div>
                  <div>
                    <dt className="text-text-primary inline font-medium">Category: </dt>
                    <dd className="inline">{submission.category}</dd>
                  </div>
                  <div>
                    <dt className="text-text-primary inline font-medium">Description: </dt>
                    <dd className="inline">{submission.description}</dd>
                  </div>
                  {submission.studentRequirements ? (
                    <div>
                      <dt className="text-text-primary inline font-medium">Requirements: </dt>
                      <dd className="inline">{submission.studentRequirements}</dd>
                    </div>
                  ) : null}
                  {submission.submitterEmail ? (
                    <div>
                      <dt className="text-text-primary inline font-medium">Submitter: </dt>
                      <dd className="inline">{submission.submitterEmail}</dd>
                    </div>
                  ) : null}
                </dl>

                {submission.reviewNotes ? (
                  <p className="text-text-secondary mt-3 text-sm">
                    Review notes: <span className="text-text-primary">{submission.reviewNotes}</span>
                  </p>
                ) : null}

                {canReview ? (
                  <>
                    <form action={reviewSubmissionAction} className="mt-4 flex flex-wrap items-end gap-3">
                      <input type="hidden" name="submissionId" value={submission.id} />
                      <label className="text-text-secondary flex min-w-64 flex-1 flex-col gap-1 text-xs">
                        Review notes (optional)
                        <input
                          type="text"
                          name="reviewNotes"
                          className="border-control-border bg-surface text-text-primary focus-visible:border-accent rounded-md border px-3 py-2 text-sm outline-none"
                        />
                      </label>
                      <button
                        type="submit"
                        name="status"
                        value="APPROVED"
                        className="bg-accent text-text-on-accent hover:bg-accent-600 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150"
                      >
                        Approve
                      </button>
                      <button
                        type="submit"
                        name="status"
                        value="NEEDS_INFO"
                        className="border-control-border text-text-primary hover:border-accent/50 rounded-md border px-3 py-2 text-sm transition-colors duration-150"
                      >
                        Needs info
                      </button>
                      <button
                        type="submit"
                        name="status"
                        value="REJECTED"
                        className="border-control-border text-text-secondary hover:border-status-error/50 hover:text-status-error rounded-md border px-3 py-2 text-sm transition-colors duration-150"
                      >
                        Reject
                      </button>
                    </form>
                    <p className="text-text-secondary mt-2 text-xs">
                      Approving marks this idea worth adding. It does not publish a benefit; a verified
                      listing still has to be created by hand in Benefits with real eligibility, pricing, and
                      source details.
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
