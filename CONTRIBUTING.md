# Contributing to Perqora

Thanks for considering a contribution. This project welcomes bug reports, benefit submissions, and code contributions.

## The fastest way to help: submit a benefit

You don't need to write code to contribute. If you know a real student benefit that's missing, use the in-app submission form at `/submit`, or open an issue using the "Benefit submission" template. Submissions go into a review queue and are never auto-published; a maintainer verifies the details before they go live. See `/how-it-works` in the running app for the full verification philosophy.

## Reporting bugs or requesting features

Open an issue using the matching template (bug report, feature request, or data-quality issue) under `.github/ISSUE_TEMPLATE/`. For anything security-sensitive, see `SECURITY.md` instead of opening a public issue.

## Development setup

```bash
git clone https://github.com/levimackay/perqora.git
cd perqora
pnpm install
cp .env.example .env   # then fill in DATABASE_URL and the other variables
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Full setup details, including how to get a local Postgres instance running, are in `SETUP.md`.

## Before opening a pull request

Run the full check suite locally:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

All four need to pass; the same checks run in CI and a pull request can't merge until they're green. If you touched a page's UI, also run `pnpm test:e2e` if you have Playwright's browsers installed (`pnpm exec playwright install`).

## Code conventions

- No Unicode em dash anywhere in code, comments, or copy. Use a period, comma, or parentheses instead.
- Server components by default; reach for a client component (`"use client"`) only where real interactivity requires it.
- Don't invent benefit data. If you're adding a new seed benefit, cite a real source URL and leave its `verificationStatus` as `NEEDS_REVIEW` unless you've personally confirmed it against the live provider page today.
- Reuse the existing design tokens in `src/app/globals.css` and the primitives in `src/components/ui/`, don't introduce one-off colors or a second button/badge/chip component. `DESIGN.md` is binding for anything visual.
- Keep pull requests scoped to one change. A bug fix doesn't need an unrelated refactor riding along with it.

## Commit messages

Write what changed and why, not a changelog restating the diff. No em dashes, here either.

## Governance

See `GOVERNANCE.md` for how decisions get made in this project right now.
