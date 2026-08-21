// Stub for the "server-only" package, which is not an installed dependency
// of this project. Next.js aliases the real "server-only"/"client-only"
// packages internally at build time without requiring them to be
// installed; Vitest runs on plain Vite, which has no such built-in alias,
// so vitest.config.ts points the bare specifier here instead. This has no
// runtime behavior of its own, it exists purely so lib modules guarded by
// `import "server-only"` (rate-limit.ts, prisma.ts, benefits.ts, device.ts,
// eligibility.ts) can be imported in tests.
export {};
