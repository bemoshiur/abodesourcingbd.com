import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import { getCategories } from "@/lib/payload";
import { CONTACT_PATH } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Page not found | ABD Sourcing" },
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const categories = await getCategories();
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="mesh-light absolute inset-0 -z-10" />
      <div aria-hidden className="orb float-slow -right-24 top-10 -z-10 size-80 bg-accent/25" />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:py-32">
        <p className="font-display text-7xl font-semibold text-gradient sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          That page has moved or never existed. Try one of these, or send us your brief and we will point you in the
          right direction.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={cn(buttonVariants({ size: "xl" }), "btn-shine")}>
            Back to home
            <Icon name="ArrowRight" className="size-4" />
          </Link>
          <Link href={CONTACT_PATH} className={cn(buttonVariants({ variant: "outline", size: "xl" }), "bg-card/70")}>
            Contact us
          </Link>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {[{ href: "/products/", label: "All products" }, { href: "/services/", label: "Services" },
            ...categories.map((c) => ({ href: `/products/${c.slug}/`, label: c.title }))].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
