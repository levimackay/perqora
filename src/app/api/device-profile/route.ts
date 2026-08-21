import { NextResponse, type NextRequest } from "next/server";
import { deviceProfileUpdateSchema } from "@/lib/validation";
import { getOrCreateDeviceProfile } from "@/lib/device";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// Called by the /discover personalization flow to persist the interests,
// school, and country a visitor picked against their anonymous device
// profile cookie. There is no login here; the cookie is the identity.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = deviceProfileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid device profile update" }, { status: 400 });
  }

  const profile = await getOrCreateDeviceProfile();

  const data: Prisma.DeviceProfileUpdateInput = {};
  if (parsed.data.interests !== undefined) data.interests = parsed.data.interests;
  if (parsed.data.schoolId !== undefined) data.schoolId = parsed.data.schoolId;
  if (parsed.data.countryCode !== undefined) data.countryCode = parsed.data.countryCode;

  const updated = await prisma.deviceProfile.update({
    where: { id: profile.id },
    data,
  });

  return NextResponse.json(updated);
}
