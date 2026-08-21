import "server-only";
import { Prisma } from "@/generated/prisma/client";
import type { BenefitType, SchoolType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { annualizeCents } from "@/lib/money";
import { CS_STACK_TAG_SLUGS } from "@/lib/constants";

export const benefitCardInclude = {
  category: true,
  tags: { include: { tag: true } },
} satisfies Prisma.BenefitInclude;

export const benefitDetailInclude = {
  category: true,
  tags: { include: { tag: true } },
  countries: { include: { country: true } },
  schools: { include: { school: true } },
  verifications: { orderBy: { createdAt: "desc" }, take: 10 },
} satisfies Prisma.BenefitInclude;

export type BenefitCard = Prisma.BenefitGetPayload<{ include: typeof benefitCardInclude }>;
export type BenefitDetail = Prisma.BenefitGetPayload<{ include: typeof benefitDetailInclude }>;

export type BenefitFilters = {
  q?: string;
  categorySlug?: string;
  benefitType?: BenefitType;
  interests?: string[]; // tag slugs
  freeOnly?: boolean;
  countryCode?: string;
  schoolType?: SchoolType;
};

function buildWhere(filters: BenefitFilters): Prisma.BenefitWhereInput {
  const where: Prisma.BenefitWhereInput = { isActive: true };

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { provider: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { tags: { some: { tag: { name: { contains: filters.q, mode: "insensitive" } } } } },
    ];
  }

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }

  if (filters.benefitType) {
    where.benefitType = filters.benefitType;
  }

  if (filters.freeOnly) {
    where.benefitType = "FREE";
  }

  if (filters.interests && filters.interests.length > 0) {
    where.tags = { some: { tag: { slug: { in: filters.interests } } } };
  }

  if (filters.countryCode) {
    where.OR = [
      ...(where.OR ?? []),
      { isRegionRestricted: false },
      { countries: { some: { country: { code: filters.countryCode } } } },
    ];
  }

  return where;
}

export async function listBenefits(filters: BenefitFilters = {}, take = 60) {
  return prisma.benefit.findMany({
    where: buildWhere(filters),
    include: benefitCardInclude,
    orderBy: [{ isFeatured: "desc" }, { confidenceScore: "desc" }, { createdAt: "desc" }],
    take,
  });
}

export async function getBenefitBySlug(slug: string): Promise<BenefitDetail | null> {
  return prisma.benefit.findUnique({ where: { slug }, include: benefitDetailInclude });
}

export async function getFeaturedBenefits(take = 6) {
  return prisma.benefit.findMany({
    where: { isActive: true, isFeatured: true },
    include: benefitCardInclude,
    orderBy: { confidenceScore: "desc" },
    take,
  });
}

export async function getCsStackBenefits(take = 12) {
  return listBenefits({ interests: CS_STACK_TAG_SLUGS }, take);
}

export async function getRelatedBenefits(benefit: BenefitDetail, take = 4) {
  return prisma.benefit.findMany({
    where: {
      isActive: true,
      id: { not: benefit.id },
      OR: [
        { categoryId: benefit.categoryId },
        { tags: { some: { tagId: { in: benefit.tags.map((t) => t.tagId) } } } },
      ],
    },
    include: benefitCardInclude,
    orderBy: { confidenceScore: "desc" },
    take,
  });
}

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { benefits: { where: { isActive: true } } } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function listSchools() {
  return prisma.school.findMany({ orderBy: { name: "asc" }, include: { country: true } });
}

export async function getSchoolBySlug(slug: string) {
  return prisma.school.findUnique({ where: { slug }, include: { country: true, domains: true } });
}

export type SavingsSummary = {
  totalAnnualCents: number;
  benefitsWithValue: number;
  totalBenefits: number;
  currency: string;
};

/**
 * "Potential value," never "guaranteed savings." Only benefits with an
 * explicit normal price contribute a dollar figure; everything else still
 * counts toward totalBenefits so the UI can be honest about how many
 * benefits carry an unpriced value (credits, bundles) versus a priced one.
 */
export function summarizeSavings(benefits: BenefitCard[]): SavingsSummary {
  let totalAnnualCents = 0;
  let benefitsWithValue = 0;

  for (const benefit of benefits) {
    if (benefit.estimatedSavingsCents && benefit.estimatedSavingsCents > 0) {
      totalAnnualCents += annualizeCents(benefit.estimatedSavingsCents, benefit.pricePeriod);
      benefitsWithValue += 1;
    }
  }

  return {
    totalAnnualCents,
    benefitsWithValue,
    totalBenefits: benefits.length,
    currency: "USD",
  };
}

export async function recordAnalyticsEvent(
  type: "SEARCH" | "BENEFIT_VIEW" | "CATEGORY_VIEW" | "CLAIM_CLICK" | "BENEFIT_SAVED",
  options: { benefitId?: string; metadata?: Prisma.InputJsonValue } = {},
) {
  await prisma.analyticsEvent.create({
    data: { type, benefitId: options.benefitId, metadata: options.metadata },
  });
}
