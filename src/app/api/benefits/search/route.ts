import { NextResponse, type NextRequest } from "next/server";
import { searchParamsSchema } from "@/lib/validation";
import { listBenefits, type BenefitFilters } from "@/lib/benefits";
import { BenefitType } from "@/generated/prisma/client";

const VALID_BENEFIT_TYPES = new Set<string>(Object.values(BenefitType));

// Called by client-side filtering on the public benefits/discover pages
// (search box, category/type/interest filters) so results update without
// a full page navigation.
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const interests = url.searchParams.getAll("interest");

  const raw = {
    q: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    type: url.searchParams.get("type") ?? undefined,
    interest: interests.length > 0 ? interests : undefined,
    freeOnly: url.searchParams.get("freeOnly") ?? undefined,
    countryCode: url.searchParams.get("countryCode") ?? undefined,
  };

  const parsed = searchParamsSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search parameters" }, { status: 400 });
  }

  if (parsed.data.type && !VALID_BENEFIT_TYPES.has(parsed.data.type)) {
    return NextResponse.json({ error: "Unknown benefit type" }, { status: 400 });
  }

  const filters: BenefitFilters = {
    q: parsed.data.q,
    categorySlug: parsed.data.category,
    benefitType: parsed.data.type as BenefitFilters["benefitType"],
    interests: parsed.data.interest,
    freeOnly: parsed.data.freeOnly,
    countryCode: parsed.data.countryCode,
  };

  const benefits = await listBenefits(filters);
  return NextResponse.json(benefits);
}
