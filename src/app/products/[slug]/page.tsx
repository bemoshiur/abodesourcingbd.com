import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTACT_PATH } from "@/lib/routes";
import {
  products,
  getCategory,
  shotsForCategory,
  type ProductShot,
} from "@/content/products";
import { buyersForCategory } from "@/content/buyers";
import { servicesForCategory, factoriesForCategory } from "@/lib/relations";
import { site } from "@/content/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.title} Sourcing`,
    description: cat.summary,
    keywords: [
      `${cat.title} sourcing Bangladesh`,
      `${cat.title} manufacturer Bangladesh`,
      `${cat.title} buying office`,
      "apparel sourcing Bangladesh",
      ...cat.subItems.map((s) => `${s} sourcing`),
    ],
    alternates: { canonical: `/products/${cat.slug}/` },
    openGraph: {
      title: `${cat.title} Sourcing — ${site.name}`,
      description: cat.summary,
      url: `${site.url}/products/${cat.slug}/`,
    },
  };
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const shots = shotsForCategory(cat.slug);
  const buyers = buyersForCategory(cat.slug);
  const relatedServices = servicesForCategory(cat.slug);
  const relatedFactories = factoriesForCategory(cat.slug);

  // Group the running-product gallery by brand.
  const byBrand = new Map<string, ProductShot[]>();
  for (const s of shots) {
    const arr = byBrand.get(s.brandName) ?? [];
    arr.push(s);
    byBrand.set(s.brandName, arr);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: cat.title,
    description: cat.summary,
    category: cat.title,
    brand: { "@type": "Organization", name: site.name },
    url: `${site.url}/products/${cat.slug}/`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products/" },
          { label: cat.title, href: `/products/${cat.slug}/` },
        ]}
      />
      <PageHeader eyebrow="Product category" title={cat.title} intro={cat.intro}>
        <ul className="mt-6 flex flex-wrap gap-2">
          {cat.subItems.map((item) => (
            <li key={item}>
              <Badge variant="outline">{item}</Badge>
            </li>
          ))}
        </ul>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Brand-grouped gallery */}
        <section>
          <h2 className="font-display text-2xl font-semibold">Running products</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="tabular-nums">{shots.length}</span> styles currently or
            recently in production for this category.
          </p>

          <Reveal as="div" className="mt-8 space-y-12">
            {[...byBrand.entries()].map(([brand, brandShots]) => (
              <div key={brand}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                  {brand}
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {brandShots.map((shot) => (
                    <figure
                      key={shot.src}
                      className="group overflow-hidden rounded-xl glass"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={shot.src}
                          alt={shot.alt}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover img-zoom"
                        />
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        {/* Relevant buyers */}
        {buyers.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="font-display text-xl font-semibold">Buyers in this category</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {buyers.map((b) => (
                <li key={b.slug}>
                  <Link
                    href="/buyers/"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {b.name}
                    {b.country && (
                      <span className="text-xs text-muted-foreground">· {b.country}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Sourced through these factories */}
        {relatedFactories.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="font-display text-xl font-semibold">Sourced through these factories</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Compliant partner units that run {cat.title.toLowerCase()} for us.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedFactories.map((f) => (
                <Link
                  key={f.slug}
                  href={`/factories/${f.slug}/`}
                  className="group flex items-center justify-between gap-3 rounded-lg glass p-4 interact"
                >
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{f.name}</span>
                    <span className="block text-xs text-muted-foreground">{f.specialty}</span>
                  </span>
                  <Icon name="ChevronRight" className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related services */}
        {relatedServices.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="font-display text-xl font-semibold">Related services</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {relatedServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}/`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Icon name={s.icon} className="size-3.5 text-primary" />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="mt-14 flex flex-col items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Source {cat.title.toLowerCase()} with ABD
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Share your styles, target price, and quantity — we&apos;ll come back within 24 hours.
            </p>
          </div>
          <Link href={CONTACT_PATH} className={cn(buttonVariants({ size: "lg" }))}>
            Get a Quote
            <Icon name="ArrowRight" className="size-4" />
          </Link>
        </section>
      </div>
    </>
  );
}
