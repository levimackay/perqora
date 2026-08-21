import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { BenefitIndex } from "@/components/benefit-index";
import { getCategoryBySlug, listBenefits, recordAnalyticsEvent } from "@/lib/benefits";

export async function generateMetadata({ params }: PageProps<"/categories/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: category.name,
    description: category.description ?? `Student benefits in ${category.name}, verified and dated.`,
  };
}

export default async function CategoryPage({ params }: PageProps<"/categories/[category]">) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const benefits = await listBenefits({ categorySlug: slug }, 100);
  await recordAnalyticsEvent("CATEGORY_VIEW", { metadata: { category: slug } });

  return (
    <section>
      <Container className="py-10 sm:py-16">
        <Link
          href="/categories"
          className="font-mono-data text-text-secondary hover:text-text-primary focus-visible:outline-accent rounded-sm text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          &larr; All categories
        </Link>

        <h1 className="text-text-primary mt-4 text-[40px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[64px]">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-text-secondary mt-3 max-w-[65ch] text-[19px] leading-[1.6]">
            {category.description}
          </p>
        )}
        <p className="font-mono-data text-text-secondary mt-4 text-xs uppercase">
          {benefits.length} benefit{benefits.length === 1 ? "" : "s"}
        </p>

        <div className="mt-8">
          <h2 className="sr-only">Benefits in {category.name}</h2>
          <BenefitIndex benefits={benefits} emptyState="No benefits are indexed in this category yet." />
        </div>
      </Container>
    </section>
  );
}
