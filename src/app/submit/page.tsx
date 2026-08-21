import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { listCategories } from "@/lib/benefits";
import { SubmitForm } from "./submit-form";

export const metadata: Metadata = {
  title: "Submit a benefit",
  description: "Know a real student benefit that isn't listed yet? Submit it for review.",
};

export default async function SubmitPage() {
  const categories = await listCategories();

  return (
    <Container as="section" className="max-w-2xl py-10 sm:py-16">
      <header className="border-b border-surface-border pb-6">
        <p className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">Submit</p>
        <h1 className="mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em] text-text-primary">
          Submit a benefit
        </h1>
        <p className="mt-3 text-[16px] leading-[1.6] text-text-secondary">
          Every submission goes into a review queue and is checked against the provider&apos;s page before it
          publishes. Nothing here goes live automatically.
        </p>
      </header>

      <SubmitForm categorySuggestions={categories.map((c) => c.name)} />
    </Container>
  );
}
