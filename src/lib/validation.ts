import { z } from "zod";

export const searchParamsSchema = z.object({
  q: z.string().trim().max(200).optional(),
  category: z.string().trim().max(80).optional(),
  type: z.string().trim().max(40).optional(),
  interest: z.array(z.string().trim().max(60)).optional(),
  freeOnly: z.coerce.boolean().optional(),
  countryCode: z.string().trim().length(2).optional(),
});

export const submissionSchema = z.object({
  benefitName: z.string().trim().min(2).max(160),
  provider: z.string().trim().min(2).max(120),
  url: z.string().trim().url().max(500),
  description: z.string().trim().min(20).max(2000),
  category: z.string().trim().min(2).max(80),
  studentRequirements: z.string().trim().max(1000).optional(),
  country: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(1000).optional(),
  submitterEmail: z.string().trim().email().max(200).optional(),
  // Honeypot field: real users never see or fill this input.
  website: z.string().max(0).optional(),
});
export type SubmissionInput = z.infer<typeof submissionSchema>;

export const saveBenefitSchema = z.object({
  benefitId: z.string().trim().min(1).max(60),
});

export const deviceProfileUpdateSchema = z.object({
  interests: z.array(z.string().trim().max(60)).max(20).optional(),
  schoolId: z.string().trim().max(60).nullable().optional(),
  countryCode: z.string().trim().length(2).nullable().optional(),
});

export const adminReviewSchema = z.object({
  submissionId: z.string().trim().min(1),
  status: z.enum(["APPROVED", "REJECTED", "NEEDS_INFO"]),
  reviewNotes: z.string().trim().max(2000).optional(),
});
