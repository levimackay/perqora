import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { BenefitRow } from "@/components/benefit-row";
import { getSchoolBySlug, listBenefits } from "@/lib/benefits";
import { SCHOOL_TYPE_LABELS } from "../school-type-label";

type Params = { school: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { school: slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) return { title: "School not found" };

  return {
    title: school.name,
    description: `Student benefits available to ${school.name} students, verified and dated.`,
  };
}

export default async function SchoolDetailPage({ params }: { params: Promise<Params> }) {
  const { school: slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const benefits = await listBenefits({ countryCode: school.country.code }, 60);

  return (
    <Container as="section" className="py-10 sm:py-16">
      <header className="border-surface-border max-w-2xl border-b pb-6">
        <p className="font-mono-data text-text-secondary text-xs tracking-[0.03em] uppercase">
          {SCHOOL_TYPE_LABELS[school.type]}
        </p>
        <h1 className="text-text-primary mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em]">
          {school.name}
        </h1>
        <p className="font-mono-data text-text-secondary mt-2 text-sm">
          {[school.city, school.state, school.country.name].filter(Boolean).join(", ")}
        </p>
        {school.website && (
          <p className="mt-3 text-sm">
            <a
              href={school.website}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent focus-visible:outline-accent rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {school.website.replace(/^https?:\/\//, "")}
            </a>
          </p>
        )}

        <div className="border-surface-border bg-surface-raised/60 mt-5 rounded-md border px-4 py-3">
          <p className="text-text-secondary text-sm leading-[1.6]">
            Perqora does not have exclusive partnerships with {school.name}. The list below is benefits
            available to {school.name} students: the general verified catalog, filtered to what applies in{" "}
            {school.country.name}
            {school.domains.length > 0 ? " and matched against known student email domains" : ""}. If a
            school-specific deal exists that isn&apos;t listed here, it hasn&apos;t been verified yet.
          </p>
          {school.domains.length > 0 && (
            <p className="font-mono-data text-text-secondary mt-2 text-xs">
              Recognized domain{school.domains.length > 1 ? "s" : ""}:{" "}
              {school.domains.map((d) => d.domain).join(", ")}
            </p>
          )}
        </div>
      </header>

      <div className="mt-4">
        <h2 className="font-mono-data text-text-secondary text-xs tracking-[0.03em] uppercase">
          Benefits available to {school.name} students ({benefits.length})
        </h2>

        {benefits.length === 0 ? (
          <div className="border-surface-border mt-4 rounded-md border px-6 py-10 text-center">
            <p className="text-text-primary text-[16px]">No matching benefits right now.</p>
            <p className="text-text-secondary mt-2 text-sm">
              Check the full catalog at{" "}
              <Link
                href="/benefits"
                className="text-accent focus-visible:outline-accent rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                /benefits
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-2">
            {benefits.map((benefit) => (
              <BenefitRow key={benefit.id} benefit={benefit} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
