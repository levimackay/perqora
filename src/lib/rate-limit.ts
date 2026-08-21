import "server-only";

/**
 * Fixed-window in-memory rate limiter. Good enough for a single Next.js
 * instance; a horizontally scaled deployment needs a shared store (Redis)
 * instead; see SETUP.md.
 */
const windows = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count };
}

/**
 * Best-effort client identifier, not a verified identity. It assumes a
 * trusted reverse proxy sits in front of this app and either sets x-real-ip
 * itself or appends its own hop as the LAST entry of x-forwarded-for; on
 * that topology, the first (client-supplied) x-forwarded-for entry is
 * spoofable, so it's ignored in favor of the last one.
 *
 * That assumption does not hold for every deployment this app documents.
 * Run this Next.js server directly, with no reverse proxy in front of it,
 * and every header here, x-real-ip included, is fully client-controlled:
 * this function then degrades to being trivially bypassable, indistinguishable
 * from having no rate limiter at all. This is a deliberate, accepted tradeoff,
 * not an oversight, see the "Known limitations" section of SECURITY.md for
 * why that's an acceptable risk for what this endpoint actually gates
 * (a community submission that always lands in a human-reviewed queue,
 * never auto-published), and what a real fix would require.
 */
export function clientIpFrom(headers: Headers): string {
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((hop) => hop.trim());
    return hops[hops.length - 1] || "unknown";
  }

  return "unknown";
}
