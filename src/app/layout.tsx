import type { Metadata } from "next";
import { Hanken_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NavProgress } from "@/components/nav-progress";
import { SpeedInsights } from "@vercel/speed-insights/next";

// One primary family — Hanken Grotesk — for everything. Self-hosted, no layout shift.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Single serif accent — Fraunces — reserved for the hero wordmark/headline only.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.oneLiner,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Apparel Sourcing",
  keywords: [
    "garments buying office Bangladesh",
    "apparel sourcing Bangladesh",
    "garment sourcing agent Dhaka",
    "knitwear sourcing Bangladesh",
    "woven wear manufacturer Bangladesh",
    "sportswear sourcing Bangladesh",
    "activewear manufacturer Bangladesh",
    "outerwear sourcing",
    "workwear manufacturer Bangladesh",
    "clothing supplier Bangladesh",
    "private label apparel Bangladesh",
    "BSCI SEDEX WRAP OEKO-TEX GOTS GRS factories",
    "Uttara Dhaka buying house",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.oneLiner,
    url: site.url,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.tagline}`, description: site.oneLiner },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <NavProgress />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <SpeedInsights />
      </body>
    </html>
  );
}
