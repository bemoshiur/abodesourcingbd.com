import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import { getCategories, getServices, getSiteSettings } from "@/lib/payload";
import { Logo } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NavProgress } from "@/components/nav-progress";
import { GoogleTag } from "@/components/google-tag";
import { InquiryDrawer } from "@/components/inquiry/inquiry-drawer";
import { MobileCtaBar } from "@/components/inquiry/mobile-cta-bar";
import { withBrand } from "@/lib/seo";

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

// Safety net: even if a CMS save somehow skips its on-save revalidation, pages refresh within the hour.
export const revalidate = 3600;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1c5340" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1411" },
  ],
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteSettings();
  const title = withBrand("Garments Buying Office in Dhaka, Bangladesh");
  return {
    metadataBase: new URL(site.url),
    // Pages pass their final title via title.absolute; this template only guards new routes.
    title: { default: title, template: "%s" },
    description: site.oneLiner,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    category: "Apparel Sourcing",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    // NB: no root-level `alternates.canonical` — it would be inherited by any route
    // that does not set its own and canonicalise it to the home page.
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      url: site.url,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [categories, services] = await Promise.all([getCategories(), getServices()]);
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <GoogleTag />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <NavProgress />
        <SiteHeader
          logo={<Logo />}
          products={categories.map((c) => ({
            href: `/products/${c.slug}/`,
            title: c.title,
            icon: c.icon,
            summary: c.summary,
          }))}
          services={services.map((s) => ({
            href: `/services/${s.slug}/`,
            title: s.title,
            icon: s.icon,
            summary: s.summary,
          }))}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <InquiryDrawer />
        <MobileCtaBar />
        <SpeedInsights />
      </body>
    </html>
  );
}
