import type { Metadata } from "next";
import { cabinetGrotesk, plexMono } from "@/app/fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Perqora — What does your student status unlock?",
    template: "%s — Perqora",
  },
  description:
    "Discover the free software, discounts, cloud credits, and everyday benefits your student status unlocks, with a visible verification date on every listing.",
  openGraph: {
    type: "website",
    siteName: "Perqora",
    title: "Perqora — What does your student status unlock?",
    description:
      "Discover the free software, discounts, cloud credits, and everyday benefits your student status unlocks.",
    url: appUrl,
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perqora — What does your student status unlock?",
    description: "Discover what your student status unlocks, verified and dated.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cabinetGrotesk.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
