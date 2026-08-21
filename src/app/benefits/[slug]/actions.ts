"use server";

import { recordAnalyticsEvent } from "@/lib/benefits";

export async function logClaimClick(benefitId: string) {
  await recordAnalyticsEvent("CLAIM_CLICK", { benefitId });
}
