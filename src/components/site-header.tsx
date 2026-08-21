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
    <header className="border-surface-border relative border-b">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="focus-visible:outline-accent flex items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Image src="/logo.svg" alt="" width={28} height={28} priority />
          <span className="text-[17px] font-semibold tracking-[-0.01em]">Perqora</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-text-secondary hover:text-text-primary focus-visible:outline-accent rounded-sm text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/saved"
            className="text-text-secondary hover:text-text-primary focus-visible:outline-accent hidden rounded-sm text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 sm:inline"
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
