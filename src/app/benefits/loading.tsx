import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <section>
      <Container className="py-10 sm:py-16">
        <div className="bg-surface-raised h-3 w-16 animate-pulse rounded-sm" />
        <div className="bg-surface-raised mt-3 h-12 w-80 animate-pulse rounded-sm" />
        <div className="bg-surface-raised mt-4 h-4 w-96 max-w-full animate-pulse rounded-sm" />

        <div className="border-surface-border bg-surface-raised/40 mt-8 h-[46px] animate-pulse rounded-md border" />

        <div className="divide-surface-border border-surface-border mt-8 divide-y border-t">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-6 py-4">
              <div className="bg-surface-raised h-4 flex-1 animate-pulse rounded-sm" />
              <div className="bg-surface-raised h-4 w-20 animate-pulse rounded-sm" />
              <div className="bg-surface-raised h-6 w-28 animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
