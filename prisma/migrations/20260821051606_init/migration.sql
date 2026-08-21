-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('UNIVERSITY', 'COMMUNITY_COLLEGE', 'TRADE_SCHOOL', 'HIGH_SCHOOL', 'BOOTCAMP', 'OTHER');

-- CreateEnum
CREATE TYPE "BenefitType" AS ENUM ('FREE', 'DISCOUNT', 'CREDIT', 'FREE_TRIAL', 'EDUCATION_PRICING', 'STUDENT_PRICING', 'UNIVERSITY_PROVIDED', 'CONDITIONAL', 'REGION_SPECIFIC');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'NEEDS_REVIEW', 'STALE', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "VerificationMethod" AS ENUM ('MANUAL_REVIEW', 'AUTOMATED_FETCH', 'COMMUNITY_REPORT', 'PROVIDER_CONFIRMATION');

-- CreateEnum
CREATE TYPE "VerificationResult" AS ENUM ('STILL_ACCURATE', 'CHANGED', 'EXPIRED', 'UNABLE_TO_VERIFY');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'NEEDS_INFO', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('SEARCH', 'BENEFIT_VIEW', 'CATEGORY_VIEW', 'CLAIM_CLICK', 'BENEFIT_SAVED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('BENEFIT_CREATED', 'BENEFIT_UPDATED', 'BENEFIT_ARCHIVED', 'BENEFIT_VERIFIED', 'SUBMISSION_APPROVED', 'SUBMISSION_REJECTED', 'SUBMISSION_NEEDS_INFO');

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "code" CHAR(2) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SchoolType" NOT NULL DEFAULT 'UNIVERSITY',
    "countryId" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_domains" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefits" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "whatsIncluded" TEXT,
    "whyClaim" TEXT,
    "howToClaim" TEXT,
    "categoryId" TEXT NOT NULL,
    "subcategory" TEXT,
    "benefitType" "BenefitType" NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "normalPriceCents" INTEGER,
    "studentPriceCents" INTEGER,
    "estimatedSavingsCents" INTEGER,
    "eligibilitySummary" TEXT NOT NULL,
    "requiresVerifiedStudent" BOOLEAN NOT NULL DEFAULT true,
    "requiredSchoolType" "SchoolType",
    "requiredEmailDomainHint" TEXT,
    "isSchoolRestricted" BOOLEAN NOT NULL DEFAULT false,
    "isRegionRestricted" BOOLEAN NOT NULL DEFAULT false,
    "claimUrl" TEXT NOT NULL,
    "officialUrl" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "confidenceScore" INTEGER NOT NULL DEFAULT 50,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationMethod" "VerificationMethod",
    "lastVerifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_countries" (
    "benefitId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "benefit_countries_pkey" PRIMARY KEY ("benefitId","countryId")
);

-- CreateTable
CREATE TABLE "benefit_tags" (
    "benefitId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "benefit_tags_pkey" PRIMARY KEY ("benefitId","tagId")
);

-- CreateTable
CREATE TABLE "benefit_schools" (
    "benefitId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "benefit_schools_pkey" PRIMARY KEY ("benefitId","schoolId")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "benefitId" TEXT NOT NULL,
    "method" "VerificationMethod" NOT NULL,
    "result" "VerificationResult" NOT NULL,
    "notes" TEXT,
    "checkedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "benefitName" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "studentRequirements" TEXT,
    "country" TEXT,
    "notes" TEXT,
    "submitterEmail" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "resultingBenefitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_profiles" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "schoolId" TEXT,
    "countryCode" TEXT,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_benefits" (
    "id" TEXT NOT NULL,
    "deviceProfileId" TEXT NOT NULL,
    "benefitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "type" "AnalyticsEventType" NOT NULL,
    "benefitId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actor" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "detail" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "schools_slug_key" ON "schools"("slug");

-- CreateIndex
CREATE INDEX "schools_countryId_idx" ON "schools"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "school_domains_domain_key" ON "school_domains"("domain");

-- CreateIndex
CREATE INDEX "school_domains_schoolId_idx" ON "school_domains"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "benefits_slug_key" ON "benefits"("slug");

-- CreateIndex
CREATE INDEX "benefits_categoryId_idx" ON "benefits"("categoryId");

-- CreateIndex
CREATE INDEX "benefits_benefitType_idx" ON "benefits"("benefitType");

-- CreateIndex
CREATE INDEX "benefits_verificationStatus_idx" ON "benefits"("verificationStatus");

-- CreateIndex
CREATE INDEX "benefits_isActive_isFeatured_idx" ON "benefits"("isActive", "isFeatured");

-- CreateIndex
CREATE INDEX "verifications_benefitId_idx" ON "verifications"("benefitId");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_resultingBenefitId_key" ON "submissions"("resultingBenefitId");

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "submissions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "device_profiles_deviceId_key" ON "device_profiles"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_benefits_deviceProfileId_benefitId_key" ON "saved_benefits"("deviceProfileId", "benefitId");

-- CreateIndex
CREATE INDEX "analytics_events_type_createdAt_idx" ON "analytics_events"("type", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_benefitId_idx" ON "analytics_events"("benefitId");

-- CreateIndex
CREATE INDEX "audit_logs_targetType_targetId_idx" ON "audit_logs"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_domains" ADD CONSTRAINT "school_domains_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefits" ADD CONSTRAINT "benefits_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_countries" ADD CONSTRAINT "benefit_countries_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "benefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_countries" ADD CONSTRAINT "benefit_countries_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_tags" ADD CONSTRAINT "benefit_tags_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "benefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_tags" ADD CONSTRAINT "benefit_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_schools" ADD CONSTRAINT "benefit_schools_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "benefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_schools" ADD CONSTRAINT "benefit_schools_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "benefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_resultingBenefitId_fkey" FOREIGN KEY ("resultingBenefitId") REFERENCES "benefits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_benefits" ADD CONSTRAINT "saved_benefits_deviceProfileId_fkey" FOREIGN KEY ("deviceProfileId") REFERENCES "device_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_benefits" ADD CONSTRAINT "saved_benefits_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "benefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "benefits"("id") ON DELETE SET NULL ON UPDATE CASCADE;
