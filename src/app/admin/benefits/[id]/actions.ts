"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const benefitVerificationSchema = z.object({
  benefitId: z.string().trim().min(1),
  verificationStatus: z.enum(["VERIFIED", "NEEDS_REVIEW", "STALE", "UNVERIFIED"]),
  verificationMethod: z.enum([
    "MANUAL_REVIEW",
    "AUTOMATED_FETCH",
    "COMMUNITY_REPORT",
    "PROVIDER_CONFIRMATION",
  ]),
  verificationResult: z.enum(["STILL_ACCURATE", "CHANGED", "EXPIRED", "UNABLE_TO_VERIFY"]),
  expiresAt: z.string().trim().optional(),
  confidenceScore: z.coerce.number().int().min(0).max(100),
  isActive: z.coerce.boolean(),
  notes: z.string().trim().max(1000).optional(),
});

/**
 * This is the actual implementation of Perqora's verification workflow.
 * Every save: updates the benefit's verification metadata (status, method,
 * lastVerifiedAt is always reset to now, expiry, confidence, active flag),
 * records a Verification row for the check that just happened, and writes
 * an AuditLog entry.
 *
 * The audit action distinguishes a routine "still accurate, checked today"
 * pass (BENEFIT_VERIFIED) from a save that also changed something
 * substantive like isActive or expiresAt (BENEFIT_UPDATED). This form does
 * not edit the benefit's description, pricing, or eligibility copy; that
 * content lives outside the verification workflow this page owns.
 */
export async function updateBenefitVerificationAction(formData: FormData) {
  const parsed = benefitVerificationSchema.safeParse({
    benefitId: formData.get("benefitId"),
    verificationStatus: formData.get("verificationStatus"),
    verificationMethod: formData.get("verificationMethod"),
    verificationResult: formData.get("verificationResult"),
    expiresAt: formData.get("expiresAt") || undefined,
    confidenceScore: formData.get("confidenceScore"),
    isActive: formData.get("isActive") === "on",
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid benefit verification payload");
  }

  const {
    benefitId,
    verificationStatus,
    verificationMethod,
    verificationResult,
    expiresAt,
    confidenceScore,
    isActive,
    notes,
  } = parsed.data;

  const existing = await prisma.benefit.findUnique({ where: { id: benefitId } });
  if (!existing) {
    throw new Error("Benefit not found");
  }

  const now = new Date();
  const nextExpiresAt = expiresAt ? new Date(expiresAt) : null;

  const isSubstantiveEdit =
    existing.isActive !== isActive ||
    (existing.expiresAt?.getTime() ?? null) !== (nextExpiresAt?.getTime() ?? null);

  await prisma.$transaction([
    prisma.benefit.update({
      where: { id: benefitId },
      data: {
        verificationStatus,
        verificationMethod,
        lastVerifiedAt: now,
        expiresAt: nextExpiresAt,
        confidenceScore,
        isActive,
      },
    }),
    prisma.verification.create({
      data: {
        benefitId,
        method: verificationMethod,
        result: verificationResult,
        notes: notes ?? null,
        checkedBy: "admin",
      },
    }),
    prisma.auditLog.create({
      data: {
        action: isSubstantiveEdit ? "BENEFIT_UPDATED" : "BENEFIT_VERIFIED",
        actor: "admin",
        targetType: "Benefit",
        targetId: benefitId,
        detail: { verificationStatus, verificationResult, confidenceScore, isActive },
      },
    }),
  ]);

  revalidatePath("/admin/benefits");
  revalidatePath(`/admin/benefits/${benefitId}`);
  revalidatePath("/admin");
}
