# Perqora: Design Specification

This file is binding. Deviating from it means editing it first, not quietly diverging in code.

## 1. The brief

**Who, and what do they feel 800ms after load.** CS and technically-minded students first, every other major second. The feeling is _engineered_ and _audited_: the calm of opening a well-instrumented dashboard, not the noise of a coupon site.

**The one thing they remember.** Verification is drawn, not claimed. Every benefit carries a status chip and a "last checked" timestamp rendered like a build-status indicator, and the whole index of benefits reads like a monitored system rather than a wall of deal cards.

**The one action that matters.** Tell it your school (or email domain) and see the specific list of things you now qualify for. Everything else, including "claim," is downstream of that one moment.

**What this is not.** Not Student Beans. Not RetailMeNot with a school logo. Not a bento grid of icon-title-paragraph cards. Not a purple-to-blue hero wash. Not friendly and rounded, precise and legible instead.

**Where it lives.** Developer-tool-adjacent consumer SaaS: the register of Linear and Vercel, not the register of a deals aggregator. The flagship benefit is the GitHub Student Developer Pack, so a quiet nod to commit/status UI language is earned, not costume.

**References, and the specific thing taken from each.**

- **Linear**: restrained motion, monospace used for metadata/labels rather than decoration, generous negative space around dense information.
- **Vercel**: dark-mode-first surface, a grid tight enough to feel engineered, geometric display type doing real hierarchy work.
- **GitHub's own status/commit UI**: small, literal status language (verified / needs review / stale) instead of marketing badges. Not imitated visually, borrowed structurally.

## 2. Typography

Two families, both free-licensed, both non-default.

- **Display + body: [Cabinet Grotesk](https://www.fontshare.com/fonts/cabinet-grotesk)** (Fontshare, free for commercial use). A geometric grotesk with real character in its extremes (Black at display sizes, Regular/Medium for text) so one family can carry both without going generic.
- **Metadata, labels, status, numbers: [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)** (Google Fonts, OFL). Every timestamp, status chip, price, and eligibility tag is set in Plex Mono. This is the load-bearing decision: mono-for-data is what makes the verification mechanic _read_ as verification instead of decoration.

Scale, ratio 1.333 (dramatic, matches a stat-led hero):

| Token               | Size                 | Line height | Tracking | Weight         |
| ------------------- | -------------------- | ----------- | -------- | -------------- |
| `--text-display-xl` | 96px / 56px (mobile) | 0.95        | -0.03em  | 800            |
| `--text-display-l`  | 64px / 40px          | 1.0         | -0.025em | 700            |
| `--text-display-m`  | 40px / 30px          | 1.05        | -0.02em  | 700            |
| `--text-heading`    | 28px                 | 1.15        | -0.01em  | 600            |
| `--text-body-l`     | 19px                 | 1.6         | 0        | 400            |
| `--text-body`       | 16px                 | 1.6         | 0        | 400            |
| `--text-mono`       | 13px                 | 1.5         | 0.01em   | 500            |
| `--text-mono-sm`    | 11px                 | 1.4         | 0.03em   | 500, uppercase |

Body measure caps at 65ch. Display type never sits under 96px without dropping a full step, not a fluid interpolation, so the jump stays dramatic at every breakpoint.

## 3. Color

Dark-mode is the primary register (matches the audience and the "engineered" feeling) and the only one shipped in v1. Light mode is intended as a real second surface, not an afterthought, and its structural tokens (surface, text, borders) already exist in `globals.css`, but see the color-contrast gap noted below before treating it as finished.

Anchor hue: a phosphor/terminal green, because "verified" is both the brand promise and the accent color. No indigo, no violet, no blue-to-purple wash.

```
--ink-950:  oklch(16% 0.01 145)   /* base dark surface, warm-tinted toward the accent, not pure black */
--ink-900:  oklch(20% 0.012 145)
--ink-800:  oklch(27% 0.014 145)
--ink-700:  oklch(35% 0.014 145)
--ink-500:  oklch(64% 0.012 145)  /* secondary text on dark, 5.4:1+ against ink-950/ink-900 */
--ink-300:  oklch(78% 0.01 145)
--ink-100:  oklch(94% 0.006 145)  /* body text on dark */

--paper-50:  oklch(98% 0.004 90)  /* base light surface, warm ivory, never pure white */
--paper-100: oklch(95% 0.006 90)
--paper-300: oklch(88% 0.008 90)
--paper-500: oklch(62% 0.01 145)
--paper-700: oklch(38% 0.014 145)
--paper-900: oklch(18% 0.014 145)  /* body text on light */

--accent-500: oklch(84% 0.20 142)  /* phosphor green, brand plus "verified" */
--accent-600: oklch(74% 0.19 142)  /* pressed / on-paper text use */
--accent-glow: oklch(84% 0.20 142 / 0.14)

--status-verified: var(--accent-500)
--status-review:   oklch(80% 0.16 80)   /* amber, not yellow */
--status-stale:    oklch(65% 0.02 40)   /* desaturated warm grey, deliberately quiet, not alarming red */
--status-error:    oklch(65% 0.22 25)   /* reserved for real errors, not staleness */
```

One accent (the phosphor green) carrying both brand and "verified" meaning is deliberate: staleness and review states use desaturated amber/grey, not competing saturated hues, so the accent still reads as singular.

**Known gap, not yet fixed:** the light-mode values above have not been contrast-checked. Nothing in the app currently sets `data-theme="light"` (no toggle exists yet), so this isn't a live bug, but it means light mode is a real second theme in CSS without yet being a genuinely finished one. Before wiring up a light/dark toggle, the accent and status colors need light-appropriate darker variants (the same hue, roughly 40% OKLCH lightness reads at 8:1+ against `--paper-50` in early testing), not the same bright values used on dark, which fail against a near-white surface.

## 4. Backgrounds

No gradient wash. Depth comes from a faint fixed-position dot-free grid: a 1px hairline grid at 4% opacity of `--ink-100` over `--ink-950`, plus a single soft radial falloff of `--accent-glow` anchored top-left of the hero only, never repeated lower on the page. Section boundaries are hairlines (`1px solid --ink-800`), not padding-only whitespace, reinforcing the "instrumented" feeling.

## 5. Macrostructure

**Stat-led hero, index-style body.** The hero is dominated by one number: the potential annual value of the benefits the visitor's inputs unlock, set in `--text-display-xl` Plex Mono digits. Below it, benefits render as an **index**, dense rows with status chip, name, provider, type, and value, not icon-title-paragraph cards. This is a deliberate structural choice, not a leftover table: the product's honesty claim (verification, freshness) only reads as true if the layout resembles a monitored log rather than a marketing card wall.

Section rhythm is intentionally uneven: hero gets the most air (`--space-8` top and bottom), the index sections run tight (`--space-3` between rows) so density itself communicates "this is real data," and the CS Stack and savings-counter set pieces each get one full breathing section on their own.

## 6. Space

Base unit: 4px.

```
--space-1: 4px    --space-4: 24px    --space-7: 96px
--space-2: 8px    --space-5: 40px    --space-8: 160px
--space-3: 16px   --space-6: 64px
```

Radius is small and consistent with "precise," not "friendly": `--radius-sm: 3px` (chips, inputs), `--radius-md: 6px` (cards, buttons). Nothing above 6px. No pill buttons except status chips, where the pill shape is itself doing semantic work (a status chip reads as a chip because of the shape, everywhere else stays rectangular).

## 7. Motion

- State changes (hover, press, focus): 140ms, `cubic-bezier(0.4, 0, 0.2, 1)`.
- Entrances and layout shifts: 300ms, same curve.
- The one orchestrated moment: on first load, the hero stat counts up from 0 over 900ms while the index rows below stagger in at 40ms intervals, transform/opacity only. Nowhere else gets an entrance animation.
- A status chip that just flipped to "verified" gets a single 600ms accent-colored pulse (opacity only) and then goes static. It never loops.
- `prefers-reduced-motion`: the count-up becomes an instant final value, stagger becomes an instant reveal, the pulse becomes a static state. Nothing is removed, only de-animated.

## 8. What this is not, restated as a checklist

- No indigo/violet gradient, no blue-to-purple hero wash.
- No emoji as interface icons.
- No three-column icon-title-paragraph feature grid.
- No fabricated logo wall.
- No glassmorphism.
- No uniform border-radius across every surface.
- No centered-everything layout.
- Inter, Roboto, system stack, and Space Grotesk are not used anywhere.
