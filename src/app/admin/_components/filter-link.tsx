import Link from "next/link";

export function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? "bg-surface-raised text-text-primary rounded-md px-3 py-1.5 font-medium"
          : "border-surface-border text-text-secondary hover:text-text-primary rounded-md border px-3 py-1.5 transition-colors duration-150"
      }
    >
      {label}
    </Link>
  );
}
