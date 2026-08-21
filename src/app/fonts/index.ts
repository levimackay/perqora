import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";

export const cabinetGrotesk = localFont({
  src: "./CabinetGrotesk-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "100 900",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});
