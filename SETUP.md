# Setup

## Prerequisites

- Node.js 20.9+ (24 recommended, matching CI)
- pnpm (`corepack enable` or `npm install -g pnpm`)
- PostgreSQL 16+ running locally, or a connection string to a hosted instance

## Local Postgres (macOS, Homebrew)

```bash
brew install postgresql@16
brew services start postgresql@16   # or run it in the foreground, see brew's own output
createdb perqora_dev
```

On Linux, install `postgresql` from your distribution's package manager and create a database the same way. On any platform, a hosted free-tier Postgres (Neon, Supabase, Railway, and similar) works too, just put its connection string in `DATABASE_URL`.

## Application setup

```bash
git clone https://github.com/levimackay/perqora.git
cd perqora
pnpm install
cp .env.example .env
# edit .env: set DATABASE_URL to your Postgres instance, and ADMIN_ACCESS_TOKEN to any local value
pnpm db:migrate
pnpm db:seed
pnpm dev
```

The app runs at `http://localhost:3000`. The admin area is at `/admin`, gated by whatever value you set for `ADMIN_ACCESS_TOKEN`.

## Scripts

| Script                                            | What it does                                                                |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`                                        | Start the dev server (Turbopack)                                            |
| `pnpm build` / `pnpm start`                       | Production build and serve                                                  |
| `pnpm lint` / `pnpm format` / `pnpm format:check` | ESLint / Prettier                                                           |
| `pnpm typecheck`                                  | `tsc --noEmit`                                                              |
| `pnpm test` / `pnpm test:watch`                   | Vitest unit tests                                                           |
| `pnpm test:e2e`                                   | Playwright end-to-end tests (run `pnpm exec playwright install` once first) |
| `pnpm db:migrate`                                 | Create and apply a new migration in development                             |
| `pnpm db:deploy`                                  | Apply existing migrations without prompting (used in CI/production)         |
| `pnpm db:seed`                                    | Load the seed data in `prisma/seed.ts`                                      |
| `pnpm db:studio`                                  | Prisma Studio, a GUI for the local database                                 |
| `pnpm db:reset`                                   | Drop and recreate the local database from migrations, then reseed           |

## Production deployment

Live at [perqora.levimackay.com](https://perqora.levimackay.com). The app is not hardcoded to that domain: `NEXT_PUBLIC_APP_URL` drives metadata, Open Graph tags, and the sitemap, so the same build works at any URL.

Current production setup, for reference if this ever needs to be reproduced or migrated:

- **Hosting**: Vercel, project `perqora` under the `levibmackays-projects` team, linked to this GitHub repository. Every push to `main` deploys to production automatically (Vercel's default git integration behavior); this repo's own CI (lint/typecheck/test/build/e2e) and branch protection are what actually gate what reaches `main` in the first place.
- **Database**: Neon Postgres, provisioned through the Vercel Marketplace integration (`vercel integration add neon`), which auto-injected `DATABASE_URL` (pooled, used by the deployed app) into the project's environment variables. Migrations and seeding were run once, directly, using Neon's unpooled connection string (`DATABASE_URL_UNPOOLED`), since DDL and a one-time seed don't benefit from connection pooling and some pooled/PgBouncer setups are stricter about the statements they'll accept.
- **Domain**: `perqora.levimackay.com` is a Vercel-managed domain (`vercel domains add`) pointed at Vercel's anycast IP (`76.76.21.21`) via an A record on Cloudflare, since `levimackay.com`'s nameservers are Cloudflare's, not Vercel's. The record is DNS-only (not proxied through Cloudflare's edge), so Vercel can issue and manage its own TLS certificate for the subdomain directly.
- **Environment variables** set on the Vercel project (Production environment): `DATABASE_URL`/`DATABASE_URL_UNPOOLED` and the rest of the Neon-provisioned variables (auto-managed by the integration, don't edit by hand), `NEXT_PUBLIC_APP_URL=https://perqora.levimackay.com`, `NEXT_PUBLIC_APP_ENV=production`, and `ADMIN_ACCESS_TOKEN` (a random 64-character hex value, generated once with `openssl rand -hex 32`, not the local dev placeholder).

To reproduce this setup for a fork or a new environment:

```bash
npm install -g vercel
vercel link                          # inside the repo, pick/create the project
vercel integration add neon          # provisions Postgres and injects DATABASE_URL
vercel env pull .env.local           # get the generated connection strings locally
DATABASE_URL="$(grep '^DATABASE_URL_UNPOOLED' .env.local | cut -d'"' -f2)" pnpm db:deploy
DATABASE_URL="$(grep '^DATABASE_URL_UNPOOLED' .env.local | cut -d'"' -f2)" pnpm db:seed
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_ENV production
vercel env add ADMIN_ACCESS_TOKEN production   # paste the output of: openssl rand -hex 32
vercel domains add your-subdomain.example.com
vercel domains inspect your-subdomain.example.com   # shows the DNS record to add
# add that record at your DNS provider, then:
vercel deploy --prod
```

## GitHub repository configuration this project needs, and what's already been done automatically versus what a human has to do by hand

This section is authoritative: don't assume something is configured just because a workflow file or config file exists in the repo, some of GitHub's settings can only be changed through the API or the web UI by someone with admin rights on the repository, not by committing a file. The state below was checked directly on 2026-08-21, not assumed, each item noted with how it was actually confirmed:

**In the repository, and confirmed by their CI runs actually passing on `main`:**

- CI (`.github/workflows/ci.yml`): lint, typecheck, unit tests, build, and end-to-end tests on every pull request and push to `main`. All four jobs are green.
- CodeQL security scanning (`.github/workflows/codeql.yml`), on push, pull request, and a weekly schedule.
- Dependency review on pull requests (`.github/workflows/dependency-review.yml`).
- Issue templates, a pull request template, and a code of conduct.

**Repository-level settings, confirmed via `gh api repos/levimackay/perqora`:**

- Dependabot version updates for npm packages and GitHub Actions (`.github/dependabot.yml`). Already opened real pull requests bumping outdated Actions versions and a stale `@types/node` range within minutes of the repository going public (`security_and_analysis.dependabot_security_updates.status`).
- Secret scanning, including push protection (`security_and_analysis.secret_scanning.status` and `.secret_scanning_push_protection.status`).
- Repository description and topics (`student`, `student-discounts`, `education`, `benefits`, `deals`, `software`, `open-source`, `nextjs`, `typescript`, `postgres`).

**Branch protection on `main`, confirmed via `gh api repos/OWNER/REPO/branches/main/protection`:** pull request required, the four CI jobs (`lint-and-typecheck`, `test`, `build`, `e2e`) required and must be up to date before merging, conversation resolution required, force pushes disallowed, branch deletion disallowed, enforced for admins too (including the repository owner, which is why even a repo-owner push to `main` gets rejected and has to go through a pull request like any other change).

Reusable command to (re)apply that branch protection, for example after transferring the repository or on a fork. Replace `OWNER/REPO` and `main` with the actual target, this repository's values aren't hard-coded below on purpose:

```bash
REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
BRANCH="main"

gh api "repos/$REPO/branches/$BRANCH/protection" \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["lint-and-typecheck", "test", "build", "e2e"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
JSON
```

**Still worth doing by hand, not scriptable in a way that made sense to automate here:**

- Once this project has more than one regular contributor, raise `required_approving_review_count` above `0` in the branch protection settings above.
