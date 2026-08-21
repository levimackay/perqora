"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cx } from "@/lib/utils";
import { INTERESTS, type InterestSlug } from "@/lib/constants";
import { annualizeCents } from "@/lib/money";
import type { BenefitCard, SavingsSummary } from "@/lib/benefits";
import { BenefitIndex } from "@/components/benefit-index";
import { SavingsCounter } from "@/components/savings-counter";
import { Button } from "@/components/ui/button";

// A client-safe re-implementation of lib/benefits.ts's summarizeSavings:
// that module is server-only (it drags in the Prisma/pg client), so it
// can't be imported here even for its pure aggregation helper.
function summarizePersonalizedResults(benefits: BenefitCard[]): SavingsSummary {
  let totalAnnualCents = 0;
  let benefitsWithValue = 0;

  for (const benefit of benefits) {
    if (benefit.estimatedSavingsCents && benefit.estimatedSavingsCents > 0) {
      totalAnnualCents += annualizeCents(benefit.estimatedSavingsCents, benefit.pricePeriod);
      benefitsWithValue += 1;
    }
  }

  return { totalAnnualCents, benefitsWithValue, totalBenefits: benefits.length, currency: "USD" };
}

type Step = "school" | "interests" | "results";

type SchoolLookup = {
  id: string;
  name: string;
  type?: string;
  country?: { code: string; name: string } | null;
} | null;

type SearchBenefit = Omit<BenefitCard, "lastVerifiedAt" | "createdAt" | "updatedAt" | "expiresAt"> & {
  lastVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
};

function hydrate(benefits: SearchBenefit[]): BenefitCard[] {
  return benefits.map((benefit) => ({
    ...benefit,
    lastVerifiedAt: benefit.lastVerifiedAt ? new Date(benefit.lastVerifiedAt) : null,
    createdAt: new Date(benefit.createdAt),
    updatedAt: new Date(benefit.updatedAt),
    expiresAt: benefit.expiresAt ? new Date(benefit.expiresAt) : null,
  }));
}

export function DiscoverFlow() {
  const [step, setStep] = useState<Step>("school");

  const [email, setEmail] = useState("");
  const [school, setSchool] = useState<SchoolLookup>(null);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "found" | "not-found" | "error">(
    "idle",
  );

  const [interests, setInterests] = useState<InterestSlug[]>([]);

  const [results, setResults] = useState<BenefitCard[] | null>(null);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEmailChange(value: string) {
    setEmail(value);
    // Set the "loading"/"idle" state right here, in the event handler, so
    // the debounced effect below only ever needs to setState from inside
    // its async callback once a lookup actually resolves.
    const looksLikeEmail = value.includes("@") && !value.endsWith("@");
    setLookupState(looksLikeEmail ? "loading" : "idle");
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const looksLikeEmail = email.includes("@") && !email.endsWith("@");
    if (!looksLikeEmail) return;

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/schools/lookup?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("lookup failed");
        const data: { school: SchoolLookup } = await res.json();
        setSchool(data.school);
        setLookupState(data.school ? "found" : "not-found");
      } catch {
        setLookupState("error");
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [email]);

  function toggleInterest(slug: InterestSlug) {
    setInterests((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  async function runDiscovery() {
    setStep("results");
    setResultsLoading(true);
    setResultsError(null);

    const params = new URLSearchParams();
    for (const slug of interests) params.append("interest", slug);
    if (school?.country?.code) params.set("countryCode", school.country.code);

    try {
      await fetch("/api/device-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests,
          schoolId: school?.id,
          countryCode: school?.country?.code,
        }),
      }).catch(() => undefined); // best-effort; personalization still works without it

      const res = await fetch(`/api/benefits/search?${params.toString()}`);
      if (!res.ok) throw new Error("search failed");
      const data: SearchBenefit[] = await res.json();
      setResults(hydrate(data));
    } catch {
      setResultsError("Couldn't load your results just now. Try again in a moment.");
    } finally {
      setResultsLoading(false);
    }
  }

  const summary: SavingsSummary | null = useMemo(
    () => (results ? summarizePersonalizedResults(results) : null),
    [results],
  );

  if (step === "results") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setStep("interests")}
          className="font-mono-data text-text-secondary hover:text-text-primary focus-visible:outline-accent rounded-sm text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          &larr; Back to interests
        </button>

        <div className="border-surface-border mt-6 border-b pb-10" aria-live="polite">
          {resultsLoading ? (
            <p className="text-text-secondary">Loading your results&hellip;</p>
          ) : summary ? (
            <SavingsCounter summary={summary} label="Your potential annual value" />
          ) : null}
        </div>

        <div className="mt-10">
          {resultsError && (
            <p role="alert" className="text-status-error">
              {resultsError}
            </p>
          )}
          {!resultsLoading && !resultsError && results && (
            <>
              <h2 className="sr-only">Your matched benefits</h2>
              <BenefitIndex
                benefits={results}
                emptyState={
                  <span>
                    Nothing matched those interests yet.{" "}
                    <button
                      type="button"
                      onClick={() => setStep("interests")}
                      className="text-accent focus-visible:outline-accent rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      Adjust your picks
                    </button>{" "}
                    or browse the{" "}
                    <Link
                      href="/benefits"
                      className="text-accent focus-visible:outline-accent rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      full index
                    </Link>
                    .
                  </span>
                }
              />
            </>
          )}
        </div>
      </div>
    );
  }

  if (step === "interests") {
    return (
      <div>
        <p className="font-mono-data text-text-secondary text-[11px] tracking-[0.03em] uppercase">
          Step 2 of 2
        </p>
        <h2 className="text-text-primary mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em]">
          What are you into?
        </h2>
        <p className="text-text-secondary mt-2 max-w-[65ch]">
          Pick as many as apply. This ranks and filters the index, it never hides the rest of it.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const active = interests.includes(interest.slug);
            return (
              <button
                key={interest.slug}
                type="button"
                aria-pressed={active}
                onClick={() => toggleInterest(interest.slug)}
                className={cx(
                  "font-mono-data focus-visible:outline-accent rounded-sm border px-3 py-1.5 text-sm tracking-[0.01em] transition-colors duration-150 ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-control-border text-text-secondary hover:border-accent/40 hover:text-text-primary",
                )}
              >
                {interest.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Button type="button" variant="primary" onClick={runDiscovery}>
            See my benefits
          </Button>
          <button
            type="button"
            onClick={() => setStep("school")}
            className="font-mono-data text-text-secondary hover:text-text-primary focus-visible:outline-accent rounded-sm text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            &larr; Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="font-mono-data text-text-secondary text-[11px] tracking-[0.03em] uppercase">
        Step 1 of 2
      </p>
      <h2 className="text-text-primary mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em]">
        What&apos;s your school email?
      </h2>
      <p className="text-text-secondary mt-2 max-w-[65ch]">
        Used to match your school and its region. Nothing is verified or sent anywhere at this step.
      </p>

      <div className="mt-6 max-w-md">
        <label htmlFor="school-email" className="sr-only">
          School email
        </label>
        <input
          id="school-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@university.edu"
          value={email}
          onChange={(event) => handleEmailChange(event.target.value)}
          className="border-control-border bg-surface text-text-primary placeholder:text-text-secondary focus-visible:border-accent w-full rounded-md border px-4 py-3 text-[15px] focus-visible:outline-none"
        />

        <div className="font-mono-data mt-3 min-h-[1.5rem] text-xs" role="status" aria-live="polite">
          {lookupState === "loading" && <span className="text-text-secondary">Looking that up&hellip;</span>}
          {lookupState === "found" && school && (
            <span className="text-status-verified">Matched: {school.name}</span>
          )}
          {lookupState === "not-found" && (
            <span className="text-status-review">
              We don&apos;t recognize that domain yet. You can still continue.
            </span>
          )}
          {lookupState === "error" && (
            <span className="text-status-stale">
              Couldn&apos;t reach the lookup, but you can still continue.
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button type="button" variant="primary" onClick={() => setStep("interests")}>
          Continue
        </Button>
        <button
          type="button"
          onClick={() => setStep("interests")}
          className="font-mono-data text-text-secondary hover:text-text-primary focus-visible:outline-accent rounded-sm text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
