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
        <p className="font-mono-data text-text-secondary text-[11px] tracking-[0.03em] uppercase">
          Directory
        </p>
        <h1 className="text-text-primary mt-2 text-[40px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[64px]">
          Categories
        </h1>
        <p className="text-text-secondary mt-3 max-w-[65ch]">
          {categories.length} categories covering every benefit Perqora tracks.
        </p>

        <div className="border-surface-border mt-10 grid grid-cols-1 border-t border-l sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group border-surface-border hover:bg-surface-raised focus-visible:outline-accent border-r border-b p-6 transition-colors duration-150 ease-[var(--ease-standard)] focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2"
            >
              <span className="text-text-primary group-hover:text-accent text-[19px] font-medium">
                {category.name}
              </span>
              {category.description && (
                <p className="text-text-secondary mt-2 line-clamp-2 text-sm">{category.description}</p>
              )}
              <span className="font-mono-data text-text-secondary mt-3 block text-xs">
                {category._count.benefits} benefit{category._count.benefits === 1 ? "" : "s"}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
