import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { BenefitIndex } from "@/components/benefit-index";
import { SavingsCounter } from "@/components/savings-counter";
import { getFeaturedBenefits, listBenefits, listCategories, summarizeSavings } from "@/lib/benefits";

export default async function HomePage() {
  const [featured, allActive, categories] = await Promise.all([
    getFeaturedBenefits(6),
    listBenefits({}, 500),
    listCategories(),
  ]);
  const summary = summarizeSavings(allActive);

  return (
    <>
      {/* Hero: most air on the page, per DESIGN.md section 5. */}
      <section className="grid-surface hero-glow relative overflow-hidden border-b border-surface-border">
        <Container className="py-24 sm:py-40">
          <h1 className="max-w-4xl text-[56px] leading-[0.95] font-extrabold tracking-[-0.03em] text-text-primary sm:text-[96px]">
            Your student email is worth more than you think.
          </h1>
          <p className="mt-6 max-w-[65ch] text-[19px] leading-[1.6] text-text-secondary">
            Free software, developer tools, cloud credits, hardware pricing, and travel discounts are sitting
            behind your .edu address right now. Perqora indexes what&apos;s actually real, with a status chip
            and a last-checked date on every entry, not a coupon-site wall of claims.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <LinkButton href="/discover" variant="primary">
              Find my benefits
            </LinkButton>
            <LinkButton href="/benefits" variant="secondary">
              Browse the full index
            </LinkButton>
          </div>
        </Container>
      </section>

      {/* Savings counter: its own breathing section, per DESIGN.md section 5. */}
      <section className="border-b border-surface-border">
        <Container className="py-16 sm:py-24">
          <SavingsCounter summary={summary} />
        </Container>
      </section>

      {/* Featured index: tight rhythm, dense rows. */}
      <section className="border-b border-surface-border">
        <Container className="py-10 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono-data text-[11px] tracking-[0.03em] text-text-secondary uppercase">
                Featured
              </p>
              <h2 className="mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em] text-text-primary">
                Currently indexed
              </h2>
            </div>
            <Link
              href="/benefits"
              className="font-mono-data shrink-0 rounded-sm text-sm text-accent transition-colors duration-150 hover:text-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="mt-6">
            <BenefitIndex benefits={featured} />
          </div>
        </Container>
      </section>

      {/* CS Stack teaser: its own breathing section. */}
      <section className="border-b border-surface-border bg-surface-raised/40">
        <Container className="py-16 sm:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono-data text-[11px] tracking-[0.03em] text-accent uppercase">
                The CS student stack
              </p>
              <h2 className="mt-2 text-[40px] leading-[1.05] font-bold tracking-[-0.02em] text-text-primary sm:text-[64px]">
                Built around the GitHub Student Developer Pack.
              </h2>
              <p className="mt-4 text-[19px] leading-[1.6] text-text-secondary">
                Cloud credits, IDEs, and the rest of the toolchain a CS or software student actually installs
                in the first week, curated separately from the general index.
              </p>
            </div>
            <LinkButton href="/cs-stack" variant="secondary" className="shrink-0">
              Open the CS stack
            </LinkButton>
          </div>
        </Container>
      </section>

      {/* Categories overview: a directory, not a feature grid. */}
      <section>
        <Container className="py-16 sm:py-24">
          <p className="font-mono-data text-[11px] tracking-[0.03em] text-text-secondary uppercase">
            Categories
          </p>
          <h2 className="mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em] text-text-primary">
            {categories.length} categories, {allActive.length} benefits indexed
          </h2>
          <div className="mt-6 grid grid-cols-1 border-t border-l border-surface-border sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group border-r border-b border-surface-border p-6 transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-surface-raised focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
              >
                <span className="text-[17px] font-medium text-text-primary group-hover:text-accent">
                  {category.name}
                </span>
                <span className="font-mono-data mt-2 block text-xs text-text-secondary">
                  {category._count.benefits} benefit{category._count.benefits === 1 ? "" : "s"}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
