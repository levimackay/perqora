import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { BenefitIndex } from "@/components/benefit-index";
import { getCsStackBenefits } from "@/lib/benefits";
import type { BenefitCard } from "@/lib/benefits";

export const metadata: Metadata = {
  title: "The CS student stack",
  description:
    "The developer tools, cloud credits, and licenses that make up a CS or software student's toolchain, curated and verified separately from the general index.",
};

function groupByCategory(benefits: BenefitCard[]) {
  const groups = new Map<string, { name: string; benefits: BenefitCard[] }>();
  for (const benefit of benefits) {
    const key = benefit.category.slug;
    const existing = groups.get(key);
    if (existing) {
      existing.benefits.push(benefit);
    } else {
      groups.set(key, { name: benefit.category.name, benefits: [benefit] });
    }
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default async function CsStackPage() {
  const benefits = await getCsStackBenefits(50);
  const groups = groupByCategory(benefits);

  return (
    <section>
      <section className="grid-surface hero-glow border-surface-border border-b">
        <Container className="py-16 sm:py-24">
          <p className="font-mono-data text-accent text-[11px] tracking-[0.03em] uppercase">
            CS student stack
          </p>
          <h1 className="text-text-primary mt-2 max-w-3xl text-[40px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[64px]">
            The toolchain, not a coupon list.
          </h1>
          <p className="text-text-secondary mt-4 max-w-[65ch] text-[19px] leading-[1.6]">
            The GitHub Student Developer Pack is the flagship benefit here, a single application that unlocks
            cloud credits, IDE licenses, and developer tooling from dozens of providers at once. This page
            collects it alongside the other tools a CS or software student installs early: cloud platforms to
            practice on, an IDE that isn&apos;t fighting you, and infrastructure credit that makes a side
            project or class assignment free to run. {benefits.length} tools, currently indexed across{" "}
            {groups.length} categories.
          </p>
        </Container>
      </section>

      <Container className="py-10 sm:py-16">
        <div className="flex flex-col gap-14">
          {groups.map((group) => (
            <div key={group.name}>
              <h2 className="text-text-primary text-[28px] leading-[1.15] font-semibold tracking-[-0.01em]">
                {group.name}
              </h2>
              <div className="mt-4">
                <BenefitIndex benefits={group.benefits} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
