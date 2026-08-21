# About the seed data

`prisma/seed.ts` loads 20 real, publicly documented student benefit programs so the application has something meaningful to show in development and in screenshots. This file explains exactly what that data is, and isn't.

## What's real

Every benefit in the seed file is a genuine program run by the named provider (GitHub, JetBrains, Microsoft, Adobe, Figma, and so on). Each row carries a `source` and `officialUrl` pointing at that provider's real page for the program. Nothing was invented: no fabricated discount percentages, no made-up partnership, no benefit that doesn't actually exist.

## What's honestly uncertain

The seed data was authored by an engineer working from general knowledge of these programs, not by visiting each provider's page on the day it was written and confirming the current terms. Because of that, every seeded benefit is written with:

- `verificationStatus: "NEEDS_REVIEW"`, never `"VERIFIED"`.
- No `lastVerifiedAt` date, so the UI correctly shows "Verification needed" rather than a confident-looking timestamp.
- A `confidenceScore` between 30 and 70, reflecting how stable and well-documented that specific program's terms are believed to be, not certainty.

This is the application's verification system working as designed, not a gap in it: `NEEDS_REVIEW` is the honest starting state for any benefit that hasn't been independently reconfirmed against a live provider page, and the seed data demonstrates that state rather than hiding it.

## Pricing

Most seeded benefits have no `normalPriceCents`/`studentPriceCents` at all, because many of these programs (cloud credit, bundles like the GitHub Student Developer Pack, conditional offers) don't have a single stable "normal price" to cite, and inventing one would violate the project's own rule against fabricated prices. A small number of benefits with well-known, stable consumer pricing (JetBrains' individual license, Figma's paid seat) do carry a specific price, annotated with `pricePeriod` so the savings calculator can annualize it correctly. Those specific numbers are an engineer's best recollection, not a live-verified figure, same caveat as above.

## Moving a benefit from seed data to actually verified

Through the admin area (`/admin/benefits/[id]`), a maintainer reviews the benefit against its live source page and, if it checks out, sets `verificationStatus: "VERIFIED"`, `verificationMethod`, and `lastVerifiedAt`, which also writes a `Verification` audit row. Until that happens, every seeded benefit stays marked as needing review, exactly as it should.
