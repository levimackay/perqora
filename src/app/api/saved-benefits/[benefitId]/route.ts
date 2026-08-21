import { NextResponse } from "next/server";
import { getDeviceProfile } from "@/lib/device";
import { prisma } from "@/lib/prisma";

// Called by the unsave action on the /saved page and by the save/unsave
// toggle button when a benefit is already saved.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ benefitId: string }> },
) {
  const { benefitId } = await params;

  const profile = await getDeviceProfile();
  if (!profile) {
    // No device profile cookie yet means nothing could have been saved.
    return NextResponse.json({ saved: false });
  }

  await prisma.savedBenefit.deleteMany({
    where: { deviceProfileId: profile.id, benefitId },
  });

  return NextResponse.json({ saved: false });
}
