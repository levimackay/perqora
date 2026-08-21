import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";

export default function CategoryNotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-mono-data text-text-secondary text-[11px] tracking-[0.03em] uppercase">404</p>
      <h1 className="text-text-primary mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em]">
        That category doesn&apos;t exist.
      </h1>
      <p className="text-text-secondary mt-2">Check the link, or browse the full directory.</p>
      <LinkButton href="/categories" variant="primary" className="mt-6">
        All categories
      </LinkButton>
    </Container>
  );
}
