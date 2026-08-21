import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

const NAV = [
  { href: "/discover", label: "Discover" },
  { href: "/benefits", label: "Benefits" },
  { href: "/cs-stack", label: "CS Stack" },
  { href: "/how-it-works", label: "How it works" },
];

const SAVED: (typeof NAV)[number] = { href: "/saved", label: "Saved" };

export function SiteHeader() {
  return (
    <header className="relative border-b border-surface-border">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Image src="/logo.svg" alt="" width={28} height={28} priority />
          <span className="text-[17px] font-semibold tracking-[-0.01em]">Perqora</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/saved"
            className="hidden rounded-sm text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline"
          >
            Saved
          </Link>
          <LinkButton href="/discover" variant="primary" className="text-sm">
            Find my benefits
          </LinkButton>
          <MobileNav items={NAV} savedHref={SAVED} />
        </div>
      </Container>
    </header>
  );
}
