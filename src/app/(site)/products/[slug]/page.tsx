import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { LogoPlate } from "@/components/logo-plate";
import { JsonLd } from "@/components/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CountryBadge } from "@/components/country-badge";
import { FaqSection } from "@/components/faq-section";
import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { originPhrase } from "@/lib/answers";
import { categoryFaqs } from "@/lib/default-faqs";
import { categoryEntry } from "@/lib/page-meta";
import {
  factoriesForCategory,
  getCategories,
  getCategory,
  getSiteSettings,
  productsForCategory,
  servicesForCategory,
} from "@/lib/payload";
import { CONTACT_PATH, productPath } from "@/lib/routes";
import { breadcrumbNode, faqNode, graph, itemListNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [{ site }, cat] = await Promise.all([getSiteSettings(), getCategory(slug)]);
  if (!cat) return {};
  const e = categoryEntry(site, cat);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: cat.seo.ogImage ?? site.ogImage,
    ogEyebrow: `Sourced${originPhrase(cat.origins)}`,
  });
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) permanentRedirect("/products/");

  const [{ site }, products, relatedServices, relatedFactories, allCategories] = await Promise.all([
    getSiteSettings(),
    productsForCategory(cat.slug),
    servicesForCategory(cat.slug),
    factoriesForCategory(cat.slug),
    getCategories(),
  ]);
  const e = categoryEntry(site, cat);
  const crumbs = [
    { label: "Products", href: "/products/" },
    { label: cat.title, href: e.path },
  ];
  const faqs = cat.faqs.length
    ? cat.faqs
    : categoryFaqs({
        title: cat.title,
        subItems: cat.subItems,
        productNames: products.map((p) => p.name),
        compositions: products.map((p) => p.composition ?? ""),
      });

  const jsonLd = graph([
    webPageNode(site, {
      path: e.path,
      name: e.title,
      description: e.description,
      type: "CollectionPage",
      dateModified: e.lastModified,
      mainEntity: { "@id": `${site.url.replace(/\/$/, "")}${e.path}#itemlist` },
    }),
    breadcrumbNode(site, e.path, crumbs),
    itemListNode(site, {
      path: e.path,
      name: `${cat.title} styles`,
      items: products.map((p) => ({ name: p.name, url: productPath(p.categorySlug, p.slug) })),
    }),
    ...[faqNode(site, e.path, faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader eyebrow="Product category" title={e.heading} intro={cat.intro} answer={e.answer}>
        <ul className="mt-6 flex flex-wrap gap-2">
          {cat.subItems.map((item) => (
            <li key={item}>
              <Badge variant="outline" className="bg-card/70 backdrop-blur">{item}</Badge>
            </li>
          ))}
        </ul>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Running styles"
          title={`Running ${cat.title.toLowerCase()} styles`}
          intro="Tap a style for its full specification, or add it to your inquiry list."
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 60}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </section>

      {relatedFactories.length > 0 && (
        <section className="border-t border-border bg-muted/40 py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Where it is made"
              title="Sourced through these factories"
              intro={`Compliant partner units that run ${cat.title.toLowerCase()} for us.`}
              href="/factories/"
              cta="All factories"
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedFactories.map((f) => (
                <Link
                  key={f.slug}
                  href={`/factories/${f.slug}/`}
                  className="glass group flex items-center justify-between gap-3 rounded-2xl p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {f.logo && (
                      <LogoPlate image={f.logo} alt={`${f.name} logo`} sizes="96px" className="rounded-lg" height={48} pad={6} minWidth={56} maxWidth={96} />
                    )}
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{f.name}</span>
                      <span className="block text-xs text-muted-foreground">{f.specialty}</span>
                      <CountryBadge country={f.country} location={f.location} className="mt-1.5" />
                    </span>
                  </span>
                  <Icon name="ChevronRight" className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {relatedServices.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold">Related services</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {relatedServices.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}/`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Icon name={s.icon} className="size-3.5 text-primary" />
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2 className="font-display text-xl font-semibold">More categories</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {allCategories
                .filter((c) => c.slug !== cat.slug)
                .map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/products/${c.slug}/`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Icon name={c.icon} className="size-3.5 text-primary" />
                      {c.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} className="border-t border-border" />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mesh-dark flex flex-col items-start gap-4 overflow-hidden rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold sm:text-2xl">Source {cat.title.toLowerCase()} with ABD</h2>
            <p className="mt-1.5 text-sm text-primary-foreground/75">
              Share your styles, target price and quantity — we&apos;ll come back within 24 hours.
            </p>
          </div>
          <Link href={CONTACT_PATH} className={cn(buttonVariants({ size: "xl" }), "btn-shine bg-accent text-accent-foreground")}>
            Get a Quote
            <Icon name="ArrowRight" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
