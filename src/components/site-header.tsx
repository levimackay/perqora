import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";

const NAV = [
  { href: "/discover", label: "Discover" },
  { href: "/benefits", label: "Benefits" },
  { href: "/categories/developer-tools", label: "CS Stack" },
  { href: "/how-it-works", label: "How it works" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-surface-border">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="" width={28} height={28} priority />
          <span className="text-[17px] font-semibold tracking-[-0.01em]">Perqora</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/saved"
            className="hidden text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary sm:inline"
          >
            Saved
          </Link>
          <LinkButton href="/discover" variant="primary" className="text-sm">
            Find my benefits
          </LinkButton>
        </div>
      </Container>
    </header>
  );
}
