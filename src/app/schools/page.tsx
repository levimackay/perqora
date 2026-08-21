import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { listSchools } from "@/lib/benefits";
import { SCHOOL_TYPE_LABELS } from "./school-type-label";

export const metadata: Metadata = {
  title: "Schools",
  description:
    "Browse schools in the Perqora directory and see the student benefits available to their students.",
};

export default async function SchoolsPage() {
  const schools = await listSchools();

  return (
    <Container as="section" className="py-10 sm:py-16">
      <header className="border-surface-border max-w-2xl border-b pb-6">
        <p className="font-mono-data text-text-secondary text-xs tracking-[0.03em] uppercase">Schools</p>
        <h1 className="text-text-primary mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.01em]">
          Find your school
        </h1>
        <p className="text-text-secondary mt-3 text-[16px] leading-[1.6]">
          Perqora does not have exclusive deals for any single school. Every school page shows the same
          verified benefit catalog, filtered to what your school&apos;s country and eligibility signals allow.
        </p>
      </header>

      {schools.length === 0 ? (
        <div className="border-surface-border mt-8 rounded-md border px-6 py-10 text-center">
          <p className="text-text-primary text-[16px]">No schools in the directory yet.</p>
          <p className="text-text-secondary mt-2 text-sm">
            Every student can still browse the full catalog at{" "}
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
        <ul className="mt-2">
          {schools.map((school) => (
            <li key={school.id} className="border-surface-border border-b">
              <Link
                href={`/schools/${school.slug}`}
                className="group hover:bg-surface-raised/60 focus-visible:outline-accent flex flex-col gap-1 rounded-sm py-4 transition-colors duration-150 ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-row sm:items-center sm:justify-between sm:px-3"
              >
                <div>
                  <h2 className="text-text-primary group-hover:text-accent text-[17px] font-medium">
                    {school.name}
                  </h2>
                  <p className="font-mono-data text-text-secondary mt-1 text-xs tracking-[0.02em]">
                    {[school.city, school.state, school.country.name].filter(Boolean).join(", ")}
                  </p>
                </div>
                <span className="font-mono-data border-surface-border text-text-secondary shrink-0 rounded-sm border px-2 py-0.5 text-[11px] tracking-[0.03em] uppercase">
                  {SCHOOL_TYPE_LABELS[school.type]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
