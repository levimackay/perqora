import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <section>
      <Container className="py-10 sm:py-16">
        <div className="h-3 w-16 animate-pulse rounded-sm bg-surface-raised" />
        <div className="mt-3 h-12 w-80 animate-pulse rounded-sm bg-surface-raised" />
        <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded-sm bg-surface-raised" />

        <div className="mt-8 h-[46px] animate-pulse rounded-md border border-surface-border bg-surface-raised/40" />

        <div className="mt-8 divide-y divide-surface-border border-t border-surface-border">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-6 py-4">
              <div className="h-4 flex-1 animate-pulse rounded-sm bg-surface-raised" />
              <div className="h-4 w-20 animate-pulse rounded-sm bg-surface-raised" />
              <div className="h-6 w-28 animate-pulse rounded-full bg-surface-raised" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
