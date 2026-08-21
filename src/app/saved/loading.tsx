import { Container } from "@/components/ui/container";

export default function SavedLoading() {
  return (
    <Container as="section" className="py-10 sm:py-16">
      <div className="max-w-2xl border-b border-surface-border pb-6">
        <div className="h-3 w-14 animate-pulse rounded-sm bg-surface-raised" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded-sm bg-surface-raised" />
        <div className="mt-3 h-4 w-full max-w-sm animate-pulse rounded-sm bg-surface-raised" />
      </div>

      <div className="mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-surface-border py-4">
            <div className="h-4 w-56 animate-pulse rounded-sm bg-surface-raised" />
            <div className="h-5 w-24 animate-pulse rounded-sm bg-surface-raised" />
          </div>
        ))}
      </div>
    </Container>
  );
}
