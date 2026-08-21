import type { SchoolType } from "@/generated/prisma/client";

/**
 * Not in src/lib/constants.ts (read-only), so it lives beside the two routes
 * that render it instead of duplicating the map inline in each page.
 */
export const SCHOOL_TYPE_LABELS: Record<SchoolType, string> = {
  UNIVERSITY: "University",
  COMMUNITY_COLLEGE: "Community college",
  TRADE_SCHOOL: "Trade school",
  HIGH_SCHOOL: "High school",
  BOOTCAMP: "Bootcamp",
  OTHER: "School",
};
