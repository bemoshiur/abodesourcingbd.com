import "./(site)/globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { GoogleTag } from "@/components/google-tag";

// Rendered for URLs that match no route. The site and the CMS admin are separate root layouts, so this
// page supplies its own <html>/<body> and stays deliberately light (no CMS queries).
export const metadata: Metadata = {
  title: { absolute: "Page not found | ABD Sourcing" },
  robots: { index: false, follow: true },
};

const links = [
  { href: "/products/", label: "Products" },
  { href: "/services/", label: "Services" },
  { href: "/factories/", label: "Factories" },
  { href: "/compliance/", label: "Compliance" },
  { href: "/contact/", label: "Contact" },
];

export default function GlobalNotFound() {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <GoogleTag />
      </head>
      <body className="min-h-full">
        <main className="relative isolate grid min-h-screen place-items-center overflow-hidden px-6 text-center">
          <div aria-hidden className="mesh-light absolute inset-0 -z-10" />
          <div>
            <p className="font-display text-7xl font-semibold text-gradient sm:text-8xl">404</p>
            <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Page not found</h1>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              That page has moved or never existed. Try one of these, or head back to the home page.
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex h-12 items-center rounded-lg bg-primary px-7 text-base font-medium text-primary-foreground"
              >
                Back to home
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </body>
    </html>
  );
}
