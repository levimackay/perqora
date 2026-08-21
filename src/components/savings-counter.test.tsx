import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SavingsCounter } from "@/components/savings-counter";
import type { SavingsSummary } from "@/lib/benefits";

function mockMatchMedia(prefersReducedMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" && prefersReducedMotion,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("SavingsCounter", () => {
  it("jumps straight to the final value when prefers-reduced-motion is set, never animating", () => {
    mockMatchMedia(true);
    const summary: SavingsSummary = {
      totalAnnualCents: 82936,
      benefitsWithValue: 2,
      totalBenefits: 20,
      currency: "USD",
    };

    render(<SavingsCounter summary={summary} />);

    // With reduced motion, the final formatted value is present immediately,
    // with no intermediate "$0" or partial-count render to wait out.
    expect(screen.getByText("$829.36")).toBeInTheDocument();
  });

  it("discloses how many benefits carry a priced value versus vary by usage", () => {
    mockMatchMedia(true);
    const summary: SavingsSummary = {
      totalAnnualCents: 82936,
      benefitsWithValue: 2,
      totalBenefits: 20,
      currency: "USD",
    };

    render(<SavingsCounter summary={summary} />);

    expect(screen.getByText(/2 of 20 benefits priced above/)).toBeInTheDocument();
    expect(screen.getByText(/18 more unlock value that varies by usage/)).toBeInTheDocument();
  });

  it("omits the disclosure entirely when every benefit carries a priced value", () => {
    mockMatchMedia(true);
    const summary: SavingsSummary = {
      totalAnnualCents: 10000,
      benefitsWithValue: 5,
      totalBenefits: 5,
      currency: "USD",
    };

    render(<SavingsCounter summary={summary} />);

    expect(screen.queryByText(/priced above/)).not.toBeInTheDocument();
  });

  it("shows an honest empty state instead of a $0 figure when nothing matched", () => {
    mockMatchMedia(false);
    const summary: SavingsSummary = {
      totalAnnualCents: 0,
      benefitsWithValue: 0,
      totalBenefits: 0,
      currency: "USD",
    };

    render(<SavingsCounter summary={summary} />);

    expect(screen.getByText("No benefits matched yet")).toBeInTheDocument();
    expect(screen.queryByText("$0")).not.toBeInTheDocument();
  });

  it("accepts a custom label for the personalized-results context", () => {
    mockMatchMedia(true);
    const summary: SavingsSummary = {
      totalAnnualCents: 5000,
      benefitsWithValue: 1,
      totalBenefits: 1,
      currency: "USD",
    };

    render(<SavingsCounter summary={summary} label="Your potential annual value" />);

    expect(screen.getByText("Your potential annual value")).toBeInTheDocument();
  });
});
