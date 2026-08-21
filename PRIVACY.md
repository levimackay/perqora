# Privacy policy

This is the canonical privacy policy for Perqora, also rendered in the running app at `/privacy`. If the two ever disagree, this file is the source of truth.

## No accounts, no passwords

Perqora does not have user accounts or a login system. There is nothing to sign up for and nothing to authenticate with, by design.

## Anonymous personalization

The discovery flow and saved-benefits feature are backed by a single anonymous, `httpOnly` cookie (`perqora_device`) that points at a `DeviceProfile` row containing only: a random device id, an optional school selection, an optional country, an optional list of interests, and whatever benefits were saved. This is not tied to a name, email, or any other identity. Clearing cookies or using a different browser starts a new, empty profile.

## What we do collect

- **Community submissions.** The `/submit` form has one optional field, an email address, collected only so a maintainer can follow up if a submission is unclear or needs more information. It is never required, never published, and never used for anything else.
- **Anonymous product analytics.** Search terms, benefit views, category views, claim-link clicks, and saves are recorded as anonymous event counters (an event type, an optional benefit id, and a timestamp), with no IP address, device fingerprint, or identifier linking events to a specific person or device. This is used only to understand which benefits and categories are actually useful, not to track individuals.
- **Admin access.** The `/admin` area is gated by a single shared token, not a personal login, so there is no per-admin identity data to protect or leak.

## What we don't do

No third-party analytics or advertising trackers are embedded in this app. No student email addresses are collected as part of normal browsing. No data is sold, ever.

## Third-party links

Every "Claim benefit" link on this site goes directly to the benefit provider's own website. Once you leave Perqora, that provider's own privacy policy applies, not this one.

## Changes to this policy

If this policy changes in a way that matters, the date below will move and the change will be visible in this repository's commit history, which is public.

_Last updated: this document is versioned in git; see the commit history of this file for the actual date of the most recent change._
