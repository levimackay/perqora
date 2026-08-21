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
          className="font-mono-data rounded-sm text-xs text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          &larr; All categories
        </Link>

        <h1 className="mt-4 text-[40px] leading-[1.05] font-bold tracking-[-0.02em] text-text-primary sm:text-[64px]">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 max-w-[65ch] text-[19px] leading-[1.6] text-text-secondary">{category.description}</p>
        )}
        <p className="font-mono-data mt-4 text-xs text-text-secondary uppercase">
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
