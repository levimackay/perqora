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

The app is designed to be deployed as a standard Next.js app (Vercel, or any Node.js host that supports the Next.js production server) at a subdomain of `levimackay.com`, `perqora.levimackay.com`. It is not hardcoded to that domain: set `NEXT_PUBLIC_APP_URL` to wherever it's actually deployed, that value drives metadata, Open Graph tags, and the sitemap.

Required environment variables in production, same as `.env.example`:

- `DATABASE_URL`, pointed at a production Postgres instance.
- `NEXT_PUBLIC_APP_URL`, the real public URL, no trailing slash.
- `NEXT_PUBLIC_APP_ENV=production`.
- `ADMIN_ACCESS_TOKEN`, a long random value (`openssl rand -hex 32`), never the local dev placeholder.

Run `pnpm db:deploy` (not `db:migrate`, which prompts interactively) as part of the deploy step, before the app starts serving traffic.

## GitHub repository configuration this project needs, and what's already been done automatically versus what a human has to do by hand

This section is authoritative: don't assume something is configured just because a workflow file or config file exists in the repo, some of GitHub's settings can only be changed through the API or the web UI by someone with admin rights on the repository, not by committing a file.

**Already configured by pushing files in this repository (no manual step needed):**

- CI (`.github/workflows/ci.yml`): lint, typecheck, unit tests, build, and end-to-end tests on every pull request and push to `main`.
- CodeQL security scanning (`.github/workflows/codeql.yml`), on push, pull request, and a weekly schedule.
- Dependency review on pull requests (`.github/workflows/dependency-review.yml`).
- Dependabot version updates for npm packages and GitHub Actions (`.github/dependabot.yml`).
- Issue templates, a pull request template, and a code of conduct.

**Requires a manual step in the GitHub UI or API, by whoever has admin access to the repository (this cannot be done by pushing a commit):**

- **Branch protection on `main`.** Settings → Branches → Add branch protection rule for `main`: require a pull request before merging, require the CI status checks (`lint-and-typecheck`, `test`, `build`, `e2e`) to pass before merging, require branches to be up to date before merging, disallow force pushes, disallow branch deletion, and consider requiring at least one approving review once there's more than one contributor. See `gh api` commands below for a scriptable version of the same thing.
- **Enabling Dependabot security updates and secret scanning.** Settings → Code security and analysis: turn on "Dependabot alerts," "Dependabot security updates," and "Secret scanning" (and push protection, if available on the plan this repository is under). Dependabot version updates (the weekly PR bumps) work from the committed `dependabot.yml` alone, but the security-alert features are account/plan-level toggles.
- **Repository description and topics.** Settings (or the repository's About panel): a short description and topics like `student`, `student-discounts`, `education`, `benefits`, `nextjs`, `typescript`, `postgres`, `open-source`.

Scriptable equivalent for branch protection, once the repository exists and you have a token with `repo` scope:

```bash
gh api repos/levimackay/perqora/branches/main/protection \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -f 'required_status_checks[strict]=true' \
  -f 'required_status_checks[contexts][]=lint-and-typecheck' \
  -f 'required_status_checks[contexts][]=test' \
  -f 'required_status_checks[contexts][]=build' \
  -f 'required_status_checks[contexts][]=e2e' \
  -f 'enforce_admins=true' \
  -f 'required_pull_request_reviews[required_approving_review_count]=0' \
  -f 'restrictions=null' \
  -f 'allow_force_pushes=false' \
  -f 'allow_deletions=false'
```

If this command was run as part of setting up this repository, it will be noted in the commit history or the pull request that introduced this file; check `git log SETUP.md` or the repository's branch protection settings directly rather than assuming.
