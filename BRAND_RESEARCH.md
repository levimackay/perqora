# Brand research: naming Perqora

This document records the naming process for the product built in this repository, including names that were rejected and why. It is not a legal trademark clearance. A formal trademark search by a licensed professional is required before any commercial use of this name.

## Constraints going in

The name needed to be distinctive, short, easy to pronounce and spell, appropriate for a serious technology company and a public open-source repository, and not obviously confusing with an existing student-benefits product (UNiDAYS, Student Beans, Unigo) or an unrelated well-known technology company. Generic descriptive names ("StudentStack," "EduPerks," "StudentUnlock," and similar) were avoided on purpose per the brief: a name that just describes the feature is weak and likely to collide with something that already exists in a crowded, obvious naming space.

## Candidates considered and rejected

**Cohort.** Real word, thematically reasonable (a cohort of students), but "Cohort Go" is an active international student tuition payment company, and "cohort-based course platform" is a populated category (Maven, Mighty Networks, and others). Too much adjacent noise in the same audience.

**Lanyard.** Short, evokes a student ID badge. Rejected after search: it's already in active use across several unrelated developer-facing products, most notably a well-known open-source Discord presence API called Lanyard with real mindshare in exactly the developer community this product's CS Stack section targets. Collision risk with the target audience's existing vocabulary was too high.

**Trove.** Real word meaning a valuable collection, reasonable metaphor. Rejected because it is already a common startup name across unrelated categories (a grocery app, a health app, an antiques marketplace, and Australia's National Library digital archive all use it), which fails the distinctiveness bar even though none compete directly.

**Eligo** (Latin, "I choose/select"). Invented-feeling in English, short, pronounceable. Rejected after search: already used by multiple live, unrelated software products, including an online voting/election-management platform and a warehouse-robotics picking system, both with real commercial presence.

**Verid** (root: verify/verification, which is the actual product differentiator). Rejected: "Verid Inc." is a real, actively listed company (Bloomberg and Crunchbase profiles) in knowledge-based authentication, an adjacent-enough space (identity verification) to create real confusion risk.

**Statum** (Latin root: status, tying directly to "what does your student status unlock"). Rejected: "Statum Systems" is a funded, active healthcare SaaS company (StatumHEALTH), a direct, unambiguous collision on the exact word.

**Unlockt / Unlocked-style names.** Rejected on the brief's own terms before a search was even needed: the brief explicitly asks for a distinctive invented name over a generic descriptive one, and a respelled "unlocked" is simply the feature description with a letter removed.

## Final candidate: Perqora

Root: "perquisite," the word for a benefit or privilege granted by virtue of a position or status, which is precisely the product's premise (what your student status entitles you to). Constructed as an invented word (Perqora is not a dictionary term), which keeps it ownable and reduces the odds of colliding with an existing generic-word product the way several rejected candidates did.

**Search results at time of writing:** no company, app, GitHub project, npm package, or PyPI package found operating under this name in the student-benefits space or elsewhere. A closely related search term, "PERQ," returned an unrelated multifamily-real-estate marketing SaaS company, different spelling, different category, low practical confusion risk. Registry checks:

- npm: `perqora` unregistered.
- PyPI: `perqora` unregistered.
- GitHub: no organization or repository named `perqora`; a single personal user account with that exact username exists (empty, zero public repos, created earlier this year), which does not block using the name for a repository under a different account, but is worth knowing about.

**Domain.** The production deployment is intended to live at a subdomain of levimackay.com (`perqora.levimackay.com`), not on a dedicated apex domain, so `.com` availability for "perqora" was not a blocking factor in the decision and was not separately checked as part of this research.

## Remaining risk

This is web-search-based clearance only. It does not check the USPTO trademark database, state trademark registries, or international trademark registries, and it does not check unregistered common-law trademark use that wouldn't surface in a general search. Before any commercial use, run a formal trademark search (USPTO TESS at minimum, ideally through a trademark attorney) covering software, education services, and financial/discount services classes, since a name can be clear in one class and contested in another.
