import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Resolves a school from an email address's domain. Returns null rather than
 * guessing when the domain isn't in our school directory yet — the directory
 * is seeded with a handful of institutions and is expected to grow via the
 * admin/school-import path, not by fuzzy-matching unknown domains.
 */
export async function findSchoolByEmail(email: string) {
  const domain = email.trim().toLowerCase().split("@")[1];
  if (!domain) return null;

  const match = await prisma.schoolDomain.findUnique({
    where: { domain },
    include: { school: { include: { country: true } } },
  });

  return match?.school ?? null;
}

export function looksLikeSchoolEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1];
  if (!domain) return false;
  return domain.endsWith(".edu") || domain.includes(".ac.");
}
