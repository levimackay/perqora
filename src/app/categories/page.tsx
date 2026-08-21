import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { listCategories } from "@/lib/benefits";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse student benefits by category, from developer tools to travel.",
};

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <section>
      <Container className="py-10 sm:py-16">
        <p className="font-mono-data text-[11px] tracking-[0.03em] text-text-secondary uppercase">Directory</p>
        <h1 className="mt-2 text-[40px] leading-[1.05] font-bold tracking-[-0.02em] text-text-primary sm:text-[64px]">
          Categories
        </h1>
        <p className="mt-3 max-w-[65ch] text-text-secondary">
          {categories.length} categories covering every benefit Perqora tracks.
        </p>

        <div className="mt-10 grid grid-cols-1 border-t border-l border-surface-border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group border-r border-b border-surface-border p-6 transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-surface-raised focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
            >
              <span className="text-[19px] font-medium text-text-primary group-hover:text-accent">
                {category.name}
              </span>
              {category.description && (
                <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{category.description}</p>
              )}
              <span className="font-mono-data mt-3 block text-xs text-text-secondary">
                {category._count.benefits} benefit{category._count.benefits === 1 ? "" : "s"}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
