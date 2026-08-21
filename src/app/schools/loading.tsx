import { Container } from "@/components/ui/container";

export default function SchoolsLoading() {
  return (
    <Container as="section" className="py-10 sm:py-16">
      <div className="border-surface-border max-w-2xl border-b pb-6">
        <div className="bg-surface-raised h-3 w-16 animate-pulse rounded-sm" />
        <div className="bg-surface-raised mt-3 h-8 w-56 animate-pulse rounded-sm" />
        <div className="bg-surface-raised mt-4 h-4 w-full max-w-md animate-pulse rounded-sm" />
      </div>

      <ul className="mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="border-surface-border flex items-center justify-between border-b py-4">
            <div>
              <div className="bg-surface-raised h-4 w-48 animate-pulse rounded-sm" />
              <div className="bg-surface-raised mt-2 h-3 w-32 animate-pulse rounded-sm" />
            </div>
            <div className="bg-surface-raised h-5 w-20 animate-pulse rounded-sm" />
          </li>
        ))}
      </ul>
    </Container>
  );
}
