import { NextResponse, type NextRequest } from "next/server";
import { saveBenefitSchema } from "@/lib/validation";
import { getDeviceProfile, getOrCreateDeviceProfile } from "@/lib/device";
import { benefitCardInclude, recordAnalyticsEvent } from "@/lib/benefits";
import { prisma } from "@/lib/prisma";

// GET is called by the client-side save/unsave toggle button on benefit
// cards, and by the /saved page's client shell if it hydrates via fetch
// instead of a server component. Server components rendering /saved
// directly should prefer querying getDeviceProfile() + prisma directly
// instead of fetching this route internally; this endpoint exists for
// client-side interactivity, not as the only path to the same data.
export async function GET() {
  const profile = await getDeviceProfile();
  if (!profile) {
    return NextResponse.json([]);
  }

  const saved = await prisma.savedBenefit.findMany({
    where: { deviceProfileId: profile.id },
    include: { benefit: { include: benefitCardInclude } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(saved.map((row) => row.benefit));
}

// Called by the save/unsave toggle button on benefit cards across the
// public benefits, discover, and category pages.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = saveBenefitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid benefitId is required" }, { status: 400 });
  }

  const profile = await getOrCreateDeviceProfile();

  try {
    await prisma.savedBenefit.upsert({
      where: {
        deviceProfileId_benefitId: {
          deviceProfileId: profile.id,
          benefitId: parsed.data.benefitId,
        },
      },
      create: { deviceProfileId: profile.id, benefitId: parsed.data.benefitId },
      update: {},
    });
  } catch {
    // Most likely an unknown benefitId (foreign key violation). Don't leak
    // the underlying database error to the client.
    return NextResponse.json({ error: "That benefit could not be saved" }, { status: 400 });
  }

  await recordAnalyticsEvent("BENEFIT_SAVED", { benefitId: parsed.data.benefitId });

  return NextResponse.json({ saved: true });
}
