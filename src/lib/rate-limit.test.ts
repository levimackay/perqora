import { describe, expect, it, vi, afterEach } from "vitest";
import { rateLimit, clientIpFrom } from "@/lib/rate-limit";

describe("rateLimit", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit within the window", () => {
    const key = `test-${crypto.randomUUID()}`;
    expect(rateLimit(key, 3, 60_000)).toEqual({ allowed: true, remaining: 2 });
    expect(rateLimit(key, 3, 60_000)).toEqual({ allowed: true, remaining: 1 });
    expect(rateLimit(key, 3, 60_000)).toEqual({ allowed: true, remaining: 0 });
  });

  it("rejects requests once the limit is exceeded within the window", () => {
    const key = `test-${crypto.randomUUID()}`;
    rateLimit(key, 2, 60_000);
    rateLimit(key, 2, 60_000);
    expect(rateLimit(key, 2, 60_000)).toEqual({ allowed: false, remaining: 0 });
    expect(rateLimit(key, 2, 60_000)).toEqual({ allowed: false, remaining: 0 });
  });

  it("keeps separate windows for separate keys", () => {
    const keyA = `test-${crypto.randomUUID()}`;
    const keyB = `test-${crypto.randomUUID()}`;
    rateLimit(keyA, 1, 60_000);
    expect(rateLimit(keyA, 1, 60_000).allowed).toBe(false);
    expect(rateLimit(keyB, 1, 60_000).allowed).toBe(true);
  });

  it("resets the count once the window has elapsed", () => {
    vi.useFakeTimers();
    const key = `test-${crypto.randomUUID()}`;

    expect(rateLimit(key, 1, 1_000).allowed).toBe(true);
    expect(rateLimit(key, 1, 1_000).allowed).toBe(false);

    vi.advanceTimersByTime(1_001);

    expect(rateLimit(key, 1, 1_000)).toEqual({ allowed: true, remaining: 0 });
  });
});

describe("clientIpFrom", () => {
  it("trusts the last hop in x-forwarded-for, not the client-supplied first one", () => {
    // The last entry is the one the trusted reverse proxy itself appended;
    // the first entry is whatever the client sent and is spoofable.
    const headers = new Headers({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" });
    expect(clientIpFrom(headers)).toBe("10.0.0.1");
  });

  it("trims whitespace around the trusted address", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.5,  10.0.0.1  " });
    expect(clientIpFrom(headers)).toBe("10.0.0.1");
  });

  it("prefers x-real-ip over x-forwarded-for when both are present", () => {
    const headers = new Headers({
      "x-real-ip": "198.51.100.7",
      "x-forwarded-for": "203.0.113.5, 10.0.0.1",
    });
    expect(clientIpFrom(headers)).toBe("198.51.100.7");
  });

  it("falls back to 'unknown' when no client ip headers are present", () => {
    expect(clientIpFrom(new Headers())).toBe("unknown");
  });
});
