import type { MetadataRoute } from "next";
import { listBenefits, listCategories, listSchools } from "@/lib/benefits";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Static routes across the whole app, including routes owned by other agents
// working in parallel on this codebase (the homepage, discover flow,
// benefits list, categories index, and cs-stack), so the sitemap stays
// complete even though this file only builds the schools/saved/about/etc.
// pages itself.
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/discover", changeFrequency: "weekly", priority: 0.9 },
  { path: "/benefits", changeFrequency: "daily", priority: 0.9 },
  { path: "/categories", changeFrequency: "weekly", priority: 0.7 },
  { path: "/cs-stack", changeFrequency: "weekly", priority: 0.7 },
  { path: "/schools", changeFrequency: "weekly", priority: 0.6 },
  { path: "/saved", changeFrequency: "monthly", priority: 0.2 },
  { path: "/about", changeFrequency: "monthly", priority: 0.4 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.5 },
  { path: "/submit", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/security", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [benefits, categories, schools] = await Promise.all([
    listBenefits({}, 5000),
    listCategories(),
    listSchools(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${appUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const benefitEntries: MetadataRoute.Sitemap = benefits.map((benefit) => ({
    url: `${appUrl}/benefits/${benefit.slug}`,
    lastModified: benefit.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${appUrl}/categories/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const schoolEntries: MetadataRoute.Sitemap = schools.map((school) => ({
    url: `${appUrl}/schools/${school.slug}`,
    lastModified: school.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticEntries, ...benefitEntries, ...categoryEntries, ...schoolEntries];
}
