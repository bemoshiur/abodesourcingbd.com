import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { products, shotsForCategory } from "@/content/products";

export const metadata: Metadata = {
  title: "Product Categories",
  description:
    "Knitwear, woven wear, activewear & performance wear, outerwear, and workwear — sourced and produced through ABD's Bangladesh factory network.",
  keywords: [
    "knitwear sourcing Bangladesh",
    "woven wear Bangladesh",
    "activewear sourcing Bangladesh",
    "outerwear manufacturer Bangladesh",
    "workwear sourcing Bangladesh",
    "T-shirt polo hoodie manufacturer Bangladesh",
  ],
  alternates: { canonical: "/products/" },
};

export default function ProductsIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Products", href: "/products/" }]} />
      <PageHeader
        eyebrow="What we make"
        title="Product categories"
        intro="Five core categories spanning everyday basics to performance and workwear — each developed with the right factory base."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal as="div" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const count = shotsForCategory(p.slug).length;
            return (
              <Link
                key={p.slug}
                href={`/products/${p.slug}/`}
                className="group flex flex-col rounded-xl glass p-6 interact"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-lg bg-accent/15 text-accent-foreground">
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {count} styles
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  View category
                  <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </Reveal>
      </section>
    </>
  );
}
