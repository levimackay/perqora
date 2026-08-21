"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function BenefitsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24 text-center">
      <p className="font-mono-data text-status-error text-[11px] tracking-[0.03em] uppercase">Error</p>
      <h1 className="text-text-primary mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em]">
        Couldn&apos;t load the benefits index.
      </h1>
      <p className="text-text-secondary mt-2">Something went wrong fetching this list. Try again.</p>
      <Button type="button" variant="primary" onClick={reset} className="mt-6">
        Try again
      </Button>
    </Container>
  );
}
