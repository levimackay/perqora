import Link from "next/link";
import { Container } from "@/components/ui/container";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/discover", label: "Discover" },
      { href: "/benefits", label: "All benefits" },
      { href: "/categories/developer-tools", label: "CS Stack" },
      { href: "/submit", label: "Submit a benefit" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/how-it-works", label: "How it works" },
      { href: "https://github.com/levimackay/perqora", label: "GitHub" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/security", label: "Security" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-surface-border">
      <Container className="grid gap-10 py-12 sm:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <span className="text-[17px] font-semibold">Perqora</span>
          <p className="mt-3 max-w-xs text-sm text-text-secondary">
            Independent, community-maintained, not affiliated with or endorsed by any university or
            company named on this site. Offers change; verify before you rely on one.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h3 className="font-mono-data text-xs tracking-[0.03em] text-text-secondary uppercase">
              {column.heading}
            </h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <Container className="flex flex-col gap-2 border-t border-surface-border py-6 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <p>All trademarks belong to their respective owners.</p>
        <p className="font-mono-data">Perqora is open source, MIT licensed.</p>
      </Container>
    </footer>
  );
}
