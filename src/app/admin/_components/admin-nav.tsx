import Link from "next/link";

// Underscore-prefixed folder: not a route, just a shared piece for the
// authenticated /admin/** pages (the /admin/login page intentionally
// doesn't render this, since it's reachable before authentication).
const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/benefits", label: "Benefits" },
  { href: "/admin/audit-log", label: "Audit log" },
];

export function AdminNav({ active }: { active: string }) {
  return (
    <nav className="border-surface-border flex items-center gap-1 border-b pb-3 text-sm">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            link.href === active
              ? "bg-surface-raised text-text-primary rounded-md px-3 py-1.5 font-medium"
              : "text-text-secondary hover:text-text-primary rounded-md px-3 py-1.5 transition-colors duration-150"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
