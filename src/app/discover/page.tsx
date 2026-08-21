import Link from "next/link";
import { Container } from "@/components/ui/container";
import { DiscoverFlow } from "@/app/discover/discover-flow";

export const metadata = {
  title: "Discover your benefits",
  description:
    "Tell Perqora your school and what you're into, and see the specific list of software, discounts, and credits you qualify for.",
};

export default function DiscoverPage() {
  return (
    <section className="grid-surface hero-glow border-surface-border border-b">
      <Container className="py-16 sm:py-24">
        <p className="font-mono-data text-accent text-[11px] tracking-[0.03em] uppercase">Discover</p>
        <h1 className="text-text-primary mt-2 max-w-3xl text-[40px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[64px]">
          Tell it your school, see what you qualify for.
        </h1>
        <p className="text-text-secondary mt-4 max-w-[65ch] text-[19px] leading-[1.6]">
          Two quick steps. Nothing here requires an account, and none of this is required to browse the{" "}
          <Link
            href="/benefits"
            className="text-accent focus-visible:outline-accent rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            full index
          </Link>{" "}
          instead.
        </p>

        <div className="mt-10">
          <DiscoverFlow />
        </div>
      </Container>
    </section>
  );
}
