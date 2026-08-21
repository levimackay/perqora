"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { adminReviewSchema } from "@/lib/validation";
import type { AuditAction } from "@/generated/prisma/client";

const AUDIT_ACTION_BY_STATUS: Record<"APPROVED" | "REJECTED" | "NEEDS_INFO", AuditAction> = {
  APPROVED: "SUBMISSION_APPROVED",
  REJECTED: "SUBMISSION_REJECTED",
  NEEDS_INFO: "SUBMISSION_NEEDS_INFO",
};

/**
 * Reviews a community submission from the /admin/submissions list. This
 * only ever changes the Submission row; it never creates a Benefit.
 * "Approved" means "worth adding," not "a verified listing now exists" - a
 * human still has to create that listing by hand in /admin/benefits with
 * real category, eligibility, pricing, and source data.
 *
 * reviewedBy is hardcoded to "admin" because this app has one shared admin
 * token and no per-admin identity yet. Known v1 limitation.
 */
export async function reviewSubmissionAction(formData: FormData) {
  const parsed = adminReviewSchema.safeParse({
    submissionId: formData.get("submissionId"),
    status: formData.get("status"),
    reviewNotes: formData.get("reviewNotes") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid submission review payload");
  }

  const { submissionId, status, reviewNotes } = parsed.data;

  await prisma.$transaction([
    prisma.submission.update({
      where: { id: submissionId },
      data: {
        status,
        reviewedBy: "admin",
        reviewNotes: reviewNotes ?? null,
        reviewedAt: new Date(),
      },
    }),
    prisma.auditLog.create({
      data: {
        action: AUDIT_ACTION_BY_STATUS[status],
        actor: "admin",
        targetType: "Submission",
        targetId: submissionId,
        detail: reviewNotes ? { reviewNotes } : undefined,
      },
    }),
  ]);

  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}
