# Security policy

## Reporting a vulnerability

If you find a security vulnerability in Perqora, please report it privately rather than opening a public issue. Use GitHub's private vulnerability reporting for this repository (Security tab, "Report a vulnerability"), which opens a private advisory visible only to maintainers until it's resolved.

Please include:

- A clear description of the vulnerability and its impact.
- Steps to reproduce it, or a proof of concept.
- The affected version or commit.

We will acknowledge reports within a few days and aim to have a fix or mitigation plan within two weeks for anything confirmed as a real vulnerability, faster for anything actively exploitable. Please give us a reasonable window to fix an issue before disclosing it publicly.

## Scope

This is a single-maintainer open-source project, not an enterprise security program. In scope: the application code in this repository, its API routes, and its admin authentication. Out of scope: third-party provider sites this app links to (GitHub, JetBrains, and so on), and denial-of-service reports against the demo deployment.

## What's already in place

- No user accounts or passwords exist in this system. Personalization is backed by an anonymous, httpOnly, cookie-scoped device profile, not an identity system.
- Admin access is gated behind a single shared bearer token compared against a server-side environment variable, checked in `src/proxy.ts` before any `/admin` route renders. This is a deliberate v1 simplification appropriate to a single-maintainer project; it is documented, not hidden, and is the first thing that should change if this project ever needs multiple admins.
- All user input (search queries, submission forms, admin forms) is validated with Zod schemas server-side before it touches the database.
- The community submission form is rate-limited per IP and includes a honeypot field; approved submissions never auto-publish as verified benefit data, a human always fills in the actual benefit record.
- Prisma's query builder is used for all database access, no raw SQL string interpolation.
- Dependabot is configured for both npm dependencies and GitHub Actions, with security updates prioritized. See `.github/dependabot.yml`.

## Known limitations

- Rate limiting is in-memory and per-instance. A horizontally scaled deployment needs a shared store (Redis or similar) instead; see `SETUP.md`.
- The submission rate limiter identifies a client by IP, read from `x-real-ip`/`x-forwarded-for` (`src/lib/rate-limit.ts`). Those headers are only trustworthy if a reverse proxy in front of this app sets them itself; if this app is ever run with no reverse proxy in front of it, those headers become fully client-controlled and the rate limiter is trivially bypassable by rotating them. This is an accepted risk, not an oversight: the endpoint it protects (`/api/submissions`) can only create a `PENDING` submission, which a human always reviews before anything from it becomes a live benefit, so bypassing the limiter produces spam in a moderation queue, not a data breach or unauthorized write. If this project ever handles something higher-stakes behind rate limiting, this needs a real trusted-proxy verification step (or a platform-native client IP API) before then.
- The admin auth model (single shared token) does not support per-admin audit attribution beyond a hardcoded `"admin"` actor string in the audit log. This is fine for one maintainer and not fine at any larger scale.
