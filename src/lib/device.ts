import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "perqora_device";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Perqora never requires an account to browse or save benefits. Personalization
 * is backed by an anonymous device id stored in an httpOnly cookie, not a user
 * record. This function reads the existing profile if present; it does not
 * create one, since anonymous visitors who never save or personalize anything
 * should never get a database row.
 */
export async function getDeviceProfile() {
  const store = await cookies();
  const deviceId = store.get(COOKIE_NAME)?.value;
  if (!deviceId) return null;

  return prisma.deviceProfile.findUnique({ where: { deviceId } });
}

export async function getOrCreateDeviceProfile() {
  const store = await cookies();
  let deviceId = store.get(COOKIE_NAME)?.value;

  if (deviceId) {
    const existing = await prisma.deviceProfile.findUnique({ where: { deviceId } });
    if (existing) return existing;
  }

  deviceId = randomBytes(16).toString("hex");
  store.set(COOKIE_NAME, deviceId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return prisma.deviceProfile.create({ data: { deviceId } });
}
