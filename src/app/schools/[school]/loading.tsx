import { Container } from "@/components/ui/container";

export default function SchoolDetailLoading() {
  return (
    <Container as="section" className="py-10 sm:py-16">
      <div className="border-surface-border max-w-2xl border-b pb-6">
        <div className="bg-surface-raised h-3 w-24 animate-pulse rounded-sm" />
        <div className="bg-surface-raised mt-3 h-8 w-72 animate-pulse rounded-sm" />
        <div className="bg-surface-raised mt-2 h-4 w-48 animate-pulse rounded-sm" />
        <div className="bg-surface-raised mt-5 h-16 w-full animate-pulse rounded-md" />
      </div>

      <div className="mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-surface-border flex items-center justify-between border-b py-4">
            <div className="bg-surface-raised h-4 w-56 animate-pulse rounded-sm" />
            <div className="bg-surface-raised h-5 w-24 animate-pulse rounded-sm" />
          </div>
        ))}
      </div>
    </Container>
  );
}
