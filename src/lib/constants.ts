export const INTERESTS = [
  { slug: "software-development", label: "Software Development" },
  { slug: "ai", label: "AI" },
  { slug: "cybersecurity", label: "Cybersecurity" },
  { slug: "cloud", label: "Cloud" },
  { slug: "design", label: "Design" },
  { slug: "business", label: "Business" },
  { slug: "travel", label: "Travel" },
  { slug: "gaming", label: "Gaming" },
  { slug: "photography", label: "Photography" },
  { slug: "music", label: "Music" },
  { slug: "fitness", label: "Fitness" },
  { slug: "education", label: "Education" },
  { slug: "productivity", label: "Productivity" },
  { slug: "finance", label: "Finance" },
] as const;

export type InterestSlug = (typeof INTERESTS)[number]["slug"];

export const BENEFIT_TYPE_LABELS: Record<string, string> = {
  FREE: "Free",
  DISCOUNT: "Discount",
  CREDIT: "Credit",
  FREE_TRIAL: "Free trial",
  EDUCATION_PRICING: "Education pricing",
  STUDENT_PRICING: "Student pricing",
  UNIVERSITY_PROVIDED: "University provided",
  CONDITIONAL: "Conditional",
  REGION_SPECIFIC: "Region specific",
};

export const CS_STACK_TAG_SLUGS = ["cs-stack"];
