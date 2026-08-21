"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string };

export function MobileNav({ items, savedHref }: { items: NavItem[]; savedHref: NavItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="text-text-primary focus-visible:outline-accent flex h-9 w-9 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-nav-panel"
          aria-label="Primary"
          className="border-surface-border bg-surface absolute inset-x-0 top-16 z-20 border-b px-4 py-4 sm:px-6"
        >
          <ul className="flex flex-col gap-1">
            {[...items, savedHref].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-text-primary hover:bg-surface-raised focus-visible:outline-accent block rounded-sm px-2 py-2.5 text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
