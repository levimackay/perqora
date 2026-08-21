/**
 * Seed data for local development and demos.
 *
 * Every benefit below is a real, publicly documented student program.
 * Numeric pricing is included only where a standard consumer price is
 * stable and well known; bundles with no single "normal price" (developer
 * tool packs, cloud credits) are seeded without invented totals. All rows
 * are written with verificationStatus = NEEDS_REVIEW and no lastVerifiedAt,
 * because this seed was authored by an engineer, not confirmed against the
 * live provider pages. Do not treat seed data as verified. See SEED_DATA.md.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  BenefitType,
  VerificationStatus,
  SchoolType,
  PricePeriod,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
];

const SCHOOLS = [
  {
    slug: "byu-idaho",
    name: "Brigham Young University-Idaho",
    domains: ["byui.edu"],
    state: "Idaho",
    city: "Rexburg",
  },
  {
    slug: "stanford",
    name: "Stanford University",
    domains: ["stanford.edu"],
    state: "California",
    city: "Stanford",
  },
  {
    slug: "mit",
    name: "Massachusetts Institute of Technology",
    domains: ["mit.edu"],
    state: "Massachusetts",
    city: "Cambridge",
  },
  {
    slug: "georgia-tech",
    name: "Georgia Institute of Technology",
    domains: ["gatech.edu"],
    state: "Georgia",
    city: "Atlanta",
  },
  {
    slug: "university-of-washington",
    name: "University of Washington",
    domains: ["uw.edu"],
    state: "Washington",
    city: "Seattle",
  },
];

const CATEGORIES = [
  { slug: "developer-tools", name: "Developer Tools", icon: "terminal", sortOrder: 1 },
  { slug: "ai", name: "AI Tools", icon: "sparkles", sortOrder: 2 },
  { slug: "cloud", name: "Cloud & Hosting", icon: "cloud", sortOrder: 3 },
  { slug: "design", name: "Design & Creative", icon: "pen-tool", sortOrder: 4 },
  { slug: "productivity", name: "Productivity", icon: "layout", sortOrder: 5 },
  { slug: "education", name: "Education", icon: "book", sortOrder: 6 },
  { slug: "hardware", name: "Hardware & Computers", icon: "laptop", sortOrder: 7 },
  { slug: "entertainment", name: "Entertainment", icon: "play", sortOrder: 8 },
];

const TAGS = [
  "github",
  "cloud-credits",
  "ide",
  "hosting",
  "domains",
  "database",
  "design",
  "ai-api",
  "cs-stack",
  "music",
  "video",
  "office",
  "cad",
  "version-control",
  "apple",
  "microsoft",
  // These mirror the interest slugs in src/lib/constants.ts (INTERESTS) so the
  // /discover personalization flow and interest-based filtering can match
  // benefits directly by tag, without a separate mapping table.
  "software-development",
  "cloud",
  "productivity",
  "education",
  "gaming",
  "cybersecurity",
];

type SeedBenefit = {
  slug: string;
  name: string;
  provider: string;
  description: string;
  whatsIncluded?: string;
  whyClaim?: string;
  howToClaim: string;
  category: string;
  subcategory?: string;
  benefitType: BenefitType;
  normalPriceCents?: number;
  studentPriceCents?: number;
  pricePeriod?: PricePeriod;
  eligibilitySummary: string;
  requiredEmailDomainHint?: string;
  claimUrl: string;
  officialUrl: string;
  source: string;
  confidenceScore: number;
  tags: string[];
  isFeatured?: boolean;
};

const BENEFITS: SeedBenefit[] = [
  {
    slug: "github-student-developer-pack",
    name: "GitHub Student Developer Pack",
    provider: "GitHub",
    description:
      "A bundle of free access to developer tools, cloud credits, and services from dozens of partner companies, available to verified students.",
    whatsIncluded:
      "Access varies by partner and changes over time. Historically includes items such as cloud hosting credit, domain name credit, a code editor license, and API credits from multiple providers bundled under one eligibility check.",
    whyClaim:
      "It is the single highest-leverage account a CS or software student can claim: one verification unlocks a rotating catalog of dozens of paid developer tools at no cost.",
    howToClaim:
      "Sign in with a GitHub account, apply with a school-issued email address or proof of enrollment, and GitHub verifies student status before unlocking the pack.",
    category: "developer-tools",
    subcategory: "Bundles",
    benefitType: BenefitType.FREE,
    eligibilitySummary: "Available to verified students at accredited schools, worldwide.",
    requiredEmailDomainHint: ".edu (or school-issued email)",
    claimUrl: "https://education.github.com/pack",
    officialUrl: "https://education.github.com/pack",
    source: "https://education.github.com/pack",
    confidenceScore: 70,
    tags: ["github", "cloud-credits", "cs-stack", "version-control", "software-development", "cloud"],
    isFeatured: true,
  },
  {
    slug: "jetbrains-student-license",
    name: "JetBrains Student License",
    provider: "JetBrains",
    description:
      "Free access to the full JetBrains IDE lineup (IntelliJ IDEA Ultimate, PyCharm Professional, WebStorm, CLion, Rider, and more) for the duration of enrollment.",
    whyClaim:
      "JetBrains IDEs are the default professional toolchain in most CS programs; the individual commercial license for the full suite is a meaningful annual cost that students skip entirely.",
    howToClaim:
      "Apply at the JetBrains education portal with a school email or other proof of student status; JetBrains re-verifies periodically to keep the license active.",
    category: "developer-tools",
    subcategory: "IDEs",
    benefitType: BenefitType.FREE,
    normalPriceCents: 64900,
    pricePeriod: PricePeriod.ANNUAL,
    eligibilitySummary: "Verified students and educators at accredited institutions.",
    requiredEmailDomainHint: ".edu",
    claimUrl: "https://www.jetbrains.com/community/education/",
    officialUrl: "https://www.jetbrains.com/community/education/",
    source: "https://www.jetbrains.com/community/education/",
    confidenceScore: 65,
    tags: ["ide", "cs-stack", "software-development"],
    isFeatured: true,
  },
  {
    slug: "microsoft-azure-for-students",
    name: "Azure for Students",
    provider: "Microsoft",
    description:
      "Free Azure cloud credit for verified students, with no credit card required to sign up, plus free tiers of select services.",
    whyClaim:
      "Gives CS students a real cloud environment to deploy projects, run databases, and learn infrastructure without a billing risk.",
    howToClaim: "Sign up with a school email address at the Azure for Students portal.",
    category: "cloud",
    subcategory: "Cloud Credits",
    benefitType: BenefitType.CREDIT,
    eligibilitySummary: "Verified students at accredited institutions with no prior Azure account.",
    requiredEmailDomainHint: ".edu",
    claimUrl: "https://azure.microsoft.com/en-us/free/students/",
    officialUrl: "https://azure.microsoft.com/en-us/free/students/",
    source: "https://azure.microsoft.com/en-us/free/students/",
    confidenceScore: 65,
    tags: ["cloud-credits", "cs-stack", "microsoft", "cloud", "software-development"],
    isFeatured: true,
  },
  {
    slug: "aws-educate",
    name: "AWS Educate",
    provider: "Amazon Web Services",
    description:
      "AWS's education program offering learning content and, for many institutions, cloud credit for coursework and student projects.",
    whyClaim:
      "AWS is the most widely used cloud provider in industry; hands-on access while still a student is directly transferable to internship and job interviews.",
    howToClaim: "Apply through the AWS Educate portal; access details depend on your institution's participation.",
    category: "cloud",
    subcategory: "Cloud Credits",
    benefitType: BenefitType.CONDITIONAL,
    eligibilitySummary: "Students at participating institutions; terms vary by school.",
    claimUrl: "https://aws.amazon.com/education/awseducate/",
    officialUrl: "https://aws.amazon.com/education/awseducate/",
    source: "https://aws.amazon.com/education/awseducate/",
    confidenceScore: 55,
    tags: ["cloud-credits", "cs-stack", "cloud", "software-development"],
  },
  {
    slug: "figma-education",
    name: "Figma for Education",
    provider: "Figma",
    description:
      "Free access to Figma's professional design tier for verified students and educators, including the full design and prototyping toolset.",
    whyClaim:
      "Figma is the industry-standard interface design tool; the education tier removes the seat-based cost that would otherwise gate professional features.",
    howToClaim: "Verify your student status through Figma's education verification flow (via SheerID) using a school email or ID.",
    category: "design",
    subcategory: "UI/UX Design",
    benefitType: BenefitType.FREE,
    normalPriceCents: 1500,
    pricePeriod: PricePeriod.MONTHLY,
    eligibilitySummary: "Verified students and educators, worldwide.",
    requiredEmailDomainHint: ".edu",
    claimUrl: "https://www.figma.com/education/",
    officialUrl: "https://www.figma.com/education/",
    source: "https://www.figma.com/education/",
    confidenceScore: 65,
    tags: ["design"],
    isFeatured: true,
  },
  {
    slug: "adobe-creative-cloud-student",
    name: "Adobe Creative Cloud (Student Pricing)",
    provider: "Adobe",
    description:
      "Discounted access to the full Adobe Creative Cloud suite (Photoshop, Illustrator, Premiere Pro, and more) for students and teachers.",
    whyClaim: "The full Creative Cloud suite at standard consumer pricing is one of the largest line items in a creative student's budget.",
    howToClaim: "Verify eligibility on Adobe's education store using a school email address or other proof of enrollment.",
    category: "design",
    subcategory: "Creative Suite",
    benefitType: BenefitType.STUDENT_PRICING,
    eligibilitySummary: "Students and teachers at eligible institutions.",
    requiredEmailDomainHint: ".edu",
    claimUrl: "https://www.adobe.com/creativecloud/buy/students.html",
    officialUrl: "https://www.adobe.com/creativecloud/buy/students.html",
    source: "https://www.adobe.com/creativecloud/buy/students.html",
    confidenceScore: 55,
    tags: ["design", "video"],
  },
  {
    slug: "notion-education",
    name: "Notion for Education",
    provider: "Notion",
    description: "Free Notion Plus plan for verified students and educators, including unlimited blocks and file uploads.",
    whyClaim: "Removes the workspace size limits of the free tier for note-taking, project planning, and group coursework.",
    howToClaim: "Apply for the education plan from your Notion workspace settings using a school email address.",
    category: "productivity",
    subcategory: "Notes & Docs",
    benefitType: BenefitType.FREE,
    eligibilitySummary: "Verified students and educators.",
    requiredEmailDomainHint: ".edu",
    claimUrl: "https://www.notion.com/students",
    officialUrl: "https://www.notion.com/students",
    source: "https://www.notion.com/students",
    confidenceScore: 65,
    tags: ["productivity"],
  },
  {
    slug: "canva-for-education",
    name: "Canva for Education",
    provider: "Canva",
    description: "Free access to Canva's Pro design features for eligible students, including premium templates and stock media.",
    whyClaim: "Gives non-designers a fast path to polished presentations, flyers, and social content for coursework and clubs.",
    howToClaim: "Apply through Canva's education verification using a school email or enrollment proof.",
    category: "design",
    subcategory: "Quick Design",
    benefitType: BenefitType.FREE,
    eligibilitySummary: "Primarily aimed at K-12 and some higher-ed institutions; eligibility varies by school.",
    claimUrl: "https://www.canva.com/education/",
    officialUrl: "https://www.canva.com/education/",
    source: "https://www.canva.com/education/",
    confidenceScore: 45,
    tags: ["design"],
  },
  {
    slug: "autodesk-education",
    name: "Autodesk Education Plan",
    provider: "Autodesk",
    description: "Free educational access to Autodesk's professional design and engineering software, including AutoCAD, Fusion, Maya, and Revit.",
    whyClaim: "Autodesk's commercial licenses are priced for studios and firms; the education plan removes that cost entirely for coursework use.",
    howToClaim: "Create an Autodesk Education account and verify enrollment at an accredited institution.",
    category: "design",
    subcategory: "CAD & Engineering",
    benefitType: BenefitType.FREE,
    eligibilitySummary: "Students and educators at qualifying institutions, for educational use only.",
    requiredEmailDomainHint: ".edu",
    claimUrl: "https://www.autodesk.com/education/edu-software/overview",
    officialUrl: "https://www.autodesk.com/education/edu-software/overview",
    source: "https://www.autodesk.com/education/edu-software/overview",
    confidenceScore: 55,
    tags: ["cad", "design", "education"],
  },
  {
    slug: "matlab-student",
    name: "MATLAB & Simulink Student Suite",
    provider: "MathWorks",
    description: "Discounted or campus-licensed access to MATLAB and Simulink for coursework in engineering, data science, and applied math.",
    whyClaim: "Many engineering courses assign MATLAB directly; a student license avoids per-seat commercial pricing.",
    howToClaim: "Check whether your school has a Total Academic Headcount license first (often free); otherwise purchase the individual student license.",
    category: "developer-tools",
    subcategory: "Engineering Tools",
    benefitType: BenefitType.STUDENT_PRICING,
    eligibilitySummary: "Enrolled students; many schools provide a free campus-wide license.",
    claimUrl: "https://www.mathworks.com/academia/student-edition.html",
    officialUrl: "https://www.mathworks.com/academia/student-edition.html",
    source: "https://www.mathworks.com/academia/student-edition.html",
    confidenceScore: 55,
    tags: ["cs-stack", "software-development", "education"],
  },
  {
    slug: "spotify-premium-student",
    name: "Spotify Premium Student",
    provider: "Spotify",
    description: "Discounted Spotify Premium for verified students, roughly half the standard individual plan price.",
    whyClaim: "Ad-free, offline music at a meaningfully reduced monthly cost for the length of your degree.",
    howToClaim: "Verify student status through SheerID in your Spotify account settings; renews with periodic re-verification.",
    category: "entertainment",
    subcategory: "Music",
    benefitType: BenefitType.STUDENT_PRICING,
    eligibilitySummary: "Full-time students at accredited institutions in supported countries.",
    requiredEmailDomainHint: ".edu",
    claimUrl: "https://www.spotify.com/student/",
    officialUrl: "https://www.spotify.com/student/",
    source: "https://www.spotify.com/student/",
    confidenceScore: 50,
    tags: ["music"],
  },
  {
    slug: "amazon-prime-student",
    name: "Amazon Prime Student",
    provider: "Amazon",
    description: "Discounted Prime membership for students, typically including a free trial period followed by a reduced ongoing rate.",
    whyClaim: "Fast shipping and Prime Video/Music at roughly half the standard membership price.",
    howToClaim: "Sign up with a valid .edu email address; Amazon periodically re-verifies enrollment.",
    category: "entertainment",
    subcategory: "Shopping & Streaming",
    benefitType: BenefitType.STUDENT_PRICING,
    eligibilitySummary: "Students with a valid .edu email address, primarily in the US.",
    requiredEmailDomainHint: ".edu",
    claimUrl: "https://www.amazon.com/amazonprime/student",
    officialUrl: "https://www.amazon.com/amazonprime/student",
    source: "https://www.amazon.com/amazonprime/student",
    confidenceScore: 50,
    tags: [],
  },
  {
    slug: "apple-education-pricing",
    name: "Apple Education Pricing",
    provider: "Apple",
    description: "Discounted pricing on Mac and iPad for college students and educators, purchased through Apple's education store.",
    whyClaim: "One of the few recurring discounts on Apple hardware, applicable to the largest single purchase many students make.",
    howToClaim: "Verify eligibility through Apple's education store (via UNiDAYS in some regions) before checkout.",
    category: "hardware",
    subcategory: "Computers",
    benefitType: BenefitType.EDUCATION_PRICING,
    eligibilitySummary: "College students, university staff, and educators; verification requirements vary by country.",
    claimUrl: "https://www.apple.com/us-edu/store",
    officialUrl: "https://www.apple.com/us-edu/store",
    source: "https://www.apple.com/us-edu/store",
    confidenceScore: 55,
    tags: ["apple"],
    isFeatured: true,
  },
  {
    slug: "microsoft-office-education",
    name: "Microsoft 365 Education",
    provider: "Microsoft",
    description: "Free Microsoft 365 (Word, Excel, PowerPoint, and 1TB OneDrive storage) for students at participating institutions.",
    whyClaim: "Removes the need for a personal Microsoft 365 subscription for the length of enrollment.",
    howToClaim: "Check whether your school provides this through its Office 365 for Education agreement, using your school email address.",
    category: "productivity",
    subcategory: "Office Suite",
    benefitType: BenefitType.UNIVERSITY_PROVIDED,
    eligibilitySummary: "Students at institutions with a qualifying Microsoft agreement.",
    requiredEmailDomainHint: ".edu",
    claimUrl: "https://www.microsoft.com/en-us/education/products/office",
    officialUrl: "https://www.microsoft.com/en-us/education/products/office",
    source: "https://www.microsoft.com/en-us/education/products/office",
    confidenceScore: 50,
    tags: ["office", "microsoft", "productivity"],
  },
  {
    slug: "google-workspace-education",
    name: "Google Workspace for Education",
    provider: "Google",
    description: "Free Google Workspace tools (Docs, Sheets, Drive, Gmail) provided through your institution's Google for Education agreement.",
    whyClaim: "Most schools already provide this by default; knowing it exists helps students find the storage and collaboration tools they already have access to.",
    howToClaim: "Sign in with your school-issued Google Workspace account; ask your IT department if you are unsure whether your school participates.",
    category: "productivity",
    subcategory: "Office Suite",
    benefitType: BenefitType.UNIVERSITY_PROVIDED,
    eligibilitySummary: "Students at institutions enrolled in Google Workspace for Education.",
    claimUrl: "https://edu.google.com/workspace-for-education/",
    officialUrl: "https://edu.google.com/workspace-for-education/",
    source: "https://edu.google.com/workspace-for-education/",
    confidenceScore: 50,
    tags: ["office", "productivity"],
  },
  {
    slug: "unity-student-plan",
    name: "Unity Student Plan",
    provider: "Unity Technologies",
    description: "Free access to Unity's game engine for students, including learning content and asset store credit in some regions.",
    whyClaim: "Unity is a standard teaching tool for game development and interactive media coursework.",
    howToClaim: "Create a Unity ID and verify student status through Unity Learn.",
    category: "developer-tools",
    subcategory: "Game Development",
    benefitType: BenefitType.FREE,
    eligibilitySummary: "Students enrolled in an accredited program.",
    claimUrl: "https://unity.com/products/unity-student",
    officialUrl: "https://unity.com/products/unity-student",
    source: "https://unity.com/products/unity-student",
    confidenceScore: 50,
    tags: ["cs-stack", "gaming", "software-development"],
  },
  {
    slug: "namecheap-domain-github-pack",
    name: "Namecheap Domain Credit",
    provider: "Namecheap",
    description: "A free domain name and SSL certificate for one year, available to students through partner programs such as the GitHub Student Developer Pack.",
    whyClaim: "Covers the cost of standing up a portfolio site or project domain during school.",
    howToClaim: "Redeem through the GitHub Student Developer Pack or Namecheap's education offer page.",
    category: "cloud",
    subcategory: "Domains",
    benefitType: BenefitType.FREE,
    eligibilitySummary: "Verified students, typically redeemed through the GitHub Student Developer Pack.",
    claimUrl: "https://nc.me/",
    officialUrl: "https://nc.me/",
    source: "https://nc.me/",
    confidenceScore: 55,
    tags: ["domains", "cs-stack", "cloud", "software-development"],
  },
  {
    slug: "mongodb-atlas-student-credit",
    name: "MongoDB Atlas Student Credit",
    provider: "MongoDB",
    description: "Cloud database credit for MongoDB Atlas, available to students through partner programs such as the GitHub Student Developer Pack.",
    whyClaim: "Gives students a managed database for class projects and side projects without paying for hosting.",
    howToClaim: "Redeem through the GitHub Student Developer Pack or MongoDB's for-students program.",
    category: "cloud",
    subcategory: "Databases",
    benefitType: BenefitType.CREDIT,
    eligibilitySummary: "Verified students, typically redeemed through a partner program.",
    claimUrl: "https://www.mongodb.com/students",
    officialUrl: "https://www.mongodb.com/students",
    source: "https://www.mongodb.com/students",
    confidenceScore: 50,
    tags: ["database", "cs-stack", "cloud", "software-development"],
  },
  {
    slug: "digitalocean-github-pack-credit",
    name: "DigitalOcean Cloud Credit",
    provider: "DigitalOcean",
    description: "Cloud hosting credit for DigitalOcean, redeemable through the GitHub Student Developer Pack.",
    whyClaim: "Enough credit to run small class projects, portfolio sites, or side projects on real infrastructure without a bill.",
    howToClaim: "Redeem through the GitHub Student Developer Pack after verification.",
    category: "cloud",
    subcategory: "Hosting",
    benefitType: BenefitType.CREDIT,
    eligibilitySummary: "Verified students with an active GitHub Student Developer Pack.",
    claimUrl: "https://education.github.com/pack",
    officialUrl: "https://www.digitalocean.com/",
    source: "https://education.github.com/pack",
    confidenceScore: 50,
    tags: ["hosting", "cloud-credits", "cs-stack", "cloud", "software-development"],
  },
  {
    slug: "1password-families-student",
    name: "1Password for Students",
    provider: "1Password",
    description: "Discounted or free access to 1Password's password manager for verified students in supported regions.",
    whyClaim: "Basic security hygiene (a real password manager) at a reduced cost is worth adopting early.",
    howToClaim: "Check current student offer terms on 1Password's site; availability and terms vary by region and change over time.",
    category: "productivity",
    subcategory: "Security",
    benefitType: BenefitType.CONDITIONAL,
    eligibilitySummary: "Availability varies by region and has changed over time; confirm current terms before relying on it.",
    claimUrl: "https://1password.com/",
    officialUrl: "https://1password.com/",
    source: "https://1password.com/",
    confidenceScore: 30,
    tags: ["cybersecurity", "productivity"],
  },
];

async function main() {
  console.log("Seeding countries...");
  for (const c of COUNTRIES) {
    await prisma.country.upsert({ where: { code: c.code }, update: {}, create: c });
  }

  console.log("Seeding schools...");
  const us = await prisma.country.findUniqueOrThrow({ where: { code: "US" } });
  for (const s of SCHOOLS) {
    const school = await prisma.school.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        name: s.name,
        type: SchoolType.UNIVERSITY,
        countryId: us.id,
        state: s.state,
        city: s.city,
      },
    });
    for (const domain of s.domains) {
      await prisma.schoolDomain.upsert({
        where: { domain },
        update: {},
        create: { schoolId: school.id, domain, isPrimary: true },
      });
    }
  }

  console.log("Seeding categories...");
  for (const c of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  console.log("Seeding tags...");
  for (const t of TAGS) {
    await prisma.tag.upsert({ where: { slug: t }, update: {}, create: { slug: t, name: t.replace(/-/g, " ") } });
  }

  console.log("Seeding benefits...");
  for (const b of BENEFITS) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: b.category } });
    const estimatedSavingsCents =
      b.normalPriceCents !== undefined
        ? b.normalPriceCents - (b.studentPriceCents ?? 0)
        : undefined;

    const benefit = await prisma.benefit.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        slug: b.slug,
        name: b.name,
        provider: b.provider,
        description: b.description,
        whatsIncluded: b.whatsIncluded,
        whyClaim: b.whyClaim,
        howToClaim: b.howToClaim,
        categoryId: category.id,
        subcategory: b.subcategory,
        benefitType: b.benefitType,
        normalPriceCents: b.normalPriceCents,
        studentPriceCents: b.studentPriceCents,
        pricePeriod: b.pricePeriod,
        estimatedSavingsCents,
        eligibilitySummary: b.eligibilitySummary,
        requiredEmailDomainHint: b.requiredEmailDomainHint,
        claimUrl: b.claimUrl,
        officialUrl: b.officialUrl,
        source: b.source,
        confidenceScore: b.confidenceScore,
        verificationStatus: VerificationStatus.NEEDS_REVIEW,
        isFeatured: b.isFeatured ?? false,
      },
    });

    for (const tagSlug of b.tags) {
      const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
      if (!tag) continue;
      await prisma.benefitTag.upsert({
        where: { benefitId_tagId: { benefitId: benefit.id, tagId: tag.id } },
        update: {},
        create: { benefitId: benefit.id, tagId: tag.id },
      });
    }
  }

  console.log(`Seeded ${BENEFITS.length} benefits across ${CATEGORIES.length} categories.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
