# Third-party notices

Perqora is built on open-source software and two licensed typefaces. This file lists everything that isn't original to this repository.

## Fonts

**Cabinet Grotesk**, by Indian Type Foundry, distributed through Fontshare. Self-hosted in this repository at `src/app/fonts/CabinetGrotesk-Variable.woff2` under the ITF Free Font License, which permits free commercial use and self-hosting. The full license text is included at `THIRD_PARTY_FONTS/CABINET_GROTESK_LICENSE.txt`. Source: https://www.fontshare.com/fonts/cabinet-grotesk

**IBM Plex Mono**, by IBM, distributed through Google Fonts under the SIL Open Font License 1.1. Loaded via `next/font/google`, not vendored directly in this repository. Source: https://fonts.google.com/specimen/IBM+Plex+Mono

## Runtime dependencies

The full list of runtime and development dependencies, with their exact versions and licenses, is in `package.json` and `pnpm-lock.yaml`. The major frameworks this project is built on:

| Package                              | License    |
| ------------------------------------ | ---------- |
| Next.js                              | MIT        |
| React                                | MIT        |
| Prisma (client, engines, adapter-pg) | Apache-2.0 |
| Tailwind CSS                         | MIT        |
| Zod                                  | MIT        |
| pg (node-postgres)                   | MIT        |

Every dependency in this project is under a permissive license (MIT or Apache-2.0). None require source disclosure or impose copyleft obligations on this repository.

## Seed data

The benefit records in `prisma/seed.ts` describe real, publicly documented student programs offered by third-party companies (GitHub, JetBrains, Microsoft, Adobe, and others named in that file). Perqora does not claim ownership of, endorsement by, or affiliation with any of these companies or their programs. Program names and provider names are used descriptively to identify the real offers being indexed, not as a claim of partnership. See `TRADEMARKS.md`.
