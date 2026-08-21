import Link from "next/link";

export function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-md bg-surface-raised px-3 py-1.5 font-medium text-text-primary"
          : "rounded-md border border-surface-border px-3 py-1.5 text-text-secondary transition-colors duration-150 hover:text-text-primary"
      }
    >
      {label}
    </Link>
  );
}
