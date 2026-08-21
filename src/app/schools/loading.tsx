import { Container } from "@/components/ui/container";

export default function SchoolsLoading() {
  return (
    <Container as="section" className="py-10 sm:py-16">
      <div className="max-w-2xl border-b border-surface-border pb-6">
        <div className="h-3 w-16 animate-pulse rounded-sm bg-surface-raised" />
        <div className="mt-3 h-8 w-56 animate-pulse rounded-sm bg-surface-raised" />
        <div className="mt-4 h-4 w-full max-w-md animate-pulse rounded-sm bg-surface-raised" />
      </div>

      <ul className="mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center justify-between border-b border-surface-border py-4">
            <div>
              <div className="h-4 w-48 animate-pulse rounded-sm bg-surface-raised" />
              <div className="mt-2 h-3 w-32 animate-pulse rounded-sm bg-surface-raised" />
            </div>
            <div className="h-5 w-20 animate-pulse rounded-sm bg-surface-raised" />
          </li>
        ))}
      </ul>
    </Container>
  );
}
