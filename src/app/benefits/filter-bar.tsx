"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BenefitType } from "@/generated/prisma/client";

const SELECT_CLASS =
  "rounded-md border border-control-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:border-accent focus-visible:outline-none";

export function FilterBarSkeleton() {
  return <div className="h-[46px] animate-pulse rounded-md border border-surface-border bg-surface-raised/40" />;
}

export function FilterBar({
  categories,
  types,
}: {
  categories: { slug: string; name: string }[];
  types: [BenefitType, string][];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams((params) => {
        if (q) params.set("q", q);
        else params.delete("q");
      });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const category = searchParams.get("category") ?? "";
  const type = searchParams.get("type") ?? "";
  const freeOnly = searchParams.get("freeOnly") === "true";
  const hasFilters = Boolean(q || category || type || freeOnly);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <label htmlFor="benefit-search" className="sr-only">
        Search benefits
      </label>
      <input
        id="benefit-search"
        type="search"
        placeholder="Search benefits, providers, tags..."
        value={q}
        onChange={(event) => setQ(event.target.value)}
        className="flex-1 rounded-md border border-control-border bg-surface px-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:border-accent focus-visible:outline-none sm:min-w-64"
      />

      <label htmlFor="benefit-category" className="sr-only">
        Category
      </label>
      <select
        id="benefit-category"
        value={category}
        onChange={(event) =>
          pushParams((params) => {
            if (event.target.value) params.set("category", event.target.value);
            else params.delete("category");
          })
        }
        className={SELECT_CLASS}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <label htmlFor="benefit-type" className="sr-only">
        Type
      </label>
      <select
        id="benefit-type"
        value={type}
        onChange={(event) =>
          pushParams((params) => {
            if (event.target.value) params.set("type", event.target.value);
            else params.delete("type");
          })
        }
        className={SELECT_CLASS}
      >
        <option value="">All types</option>
        {types.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <label className="font-mono-data flex items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={freeOnly}
          onChange={(event) =>
            pushParams((params) => {
              if (event.target.checked) params.set("freeOnly", "true");
              else params.delete("freeOnly");
            })
          }
          className="h-4 w-4 rounded-sm border-control-border accent-accent"
        />
        Free only
      </label>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setQ("");
            router.push(pathname, { scroll: false });
          }}
          className="font-mono-data rounded-sm text-xs text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
