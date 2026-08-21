import { Container } from "@/components/ui/container";

export default function SavedLoading() {
  return (
    <Container as="section" className="py-10 sm:py-16">
      <div className="border-surface-border max-w-2xl border-b pb-6">
        <div className="bg-surface-raised h-3 w-14 animate-pulse rounded-sm" />
        <div className="bg-surface-raised mt-3 h-8 w-64 animate-pulse rounded-sm" />
        <div className="bg-surface-raised mt-3 h-4 w-full max-w-sm animate-pulse rounded-sm" />
      </div>

      <div className="mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-surface-border flex items-center justify-between border-b py-4">
            <div className="bg-surface-raised h-4 w-56 animate-pulse rounded-sm" />
            <div className="bg-surface-raised h-5 w-24 animate-pulse rounded-sm" />
          </div>
        ))}
      </div>
    </Container>
  );
}
