import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqSection } from "@/components/faq-section";
import { PageHeader } from "@/components/page-header";
import { ProductsExplorer } from "@/components/products-explorer";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { productsFaqs } from "@/lib/default-faqs";
import { productsEntry } from "@/lib/page-meta";
import { getCategories, getPageMeta, getProducts, getSiteSettings } from "@/lib/payload";
import { CONTACT_PATH } from "@/lib/routes";
import { breadcrumbNode, faqNode, graph, itemListNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getFaqContext } from "@/lib/site-pages";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, pc] = await Promise.all([getSiteSettings(), getPageMeta("products")]);
  const e = productsEntry(site, pc);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: site.ogImage,
    ogEyebrow: "Products · Sourced in Bangladesh",
  });
}

export default async function ProductsPage() {
  const [{ site }, pc, categories, products, faqCtx] = await Promise.all([
    getSiteSettings(),
    getPageMeta("products"),
    getCategories(),
    getProducts(),
    getFaqContext(),
  ]);
  const e = productsEntry(site, pc);
  const crumbs = [{ label: "Products", href: e.path }];
  const faqs = pc.faqs.length ? pc.faqs : productsFaqs(faqCtx);

  const jsonLd = graph([
    webPageNode(site, {
      path: e.path,
      name: e.title,
      description: e.description,
      type: "CollectionPage",
      mainEntity: { "@id": `${site.url.replace(/\/$/, "")}${e.path}#itemlist` },
    }),
    breadcrumbNode(site, e.path, crumbs),
    itemListNode(site, {
      path: e.path,
      name: "Product categories",
      items: categories.map((c) => ({ name: c.title, url: `/products/${c.slug}/` })),
    }),
    ...[faqNode(site, e.path, faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader
        eyebrow="Products"
        title={e.heading}
        intro="Every style lists its reference, fibre composition and fabric weight. Add the ones you like to your inquiry list and we quote them together."
        answer={e.answer}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={i * 60}>
              <Link
                href={`/products/${c.slug}/`}
                className="glass group flex h-full items-center gap-3 rounded-2xl p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/20 text-primary">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight">{c.title}</span>
                  <span className="text-xs text-muted-foreground">Explore styles</span>
                </span>
                <Icon name="ArrowRight" className="ml-auto size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </ul>

        <h2 className="mb-6 mt-14 font-display text-2xl font-semibold sm:text-3xl">All styles</h2>
        <ProductsExplorer
          categories={categories.map((c) => ({ slug: c.slug, title: c.title }))}
          products={products.map((p) => ({
            slug: p.slug,
            name: p.name,
            styleNumber: p.styleNumber,
            categorySlug: p.categorySlug,
            categoryTitle: p.categoryTitle,
            composition: p.composition,
            gsm: p.gsm,
            fabricConstruction: p.fabricConstruction,
            featured: p.featured,
            images: p.images.slice(0, 1),
          }))}
        />

        <div className="mesh-dark mt-16 flex flex-col items-start gap-4 overflow-hidden rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold sm:text-2xl">Don&apos;t see your style?</h2>
            <p className="mt-1.5 text-sm text-primary-foreground/75">
              Send a tech pack or a reference garment — we develop it with the right partner factory.
            </p>
          </div>
          <Link href={CONTACT_PATH} className={cn(buttonVariants({ size: "xl" }), "btn-shine bg-accent text-accent-foreground")}>
            Send your brief
            <Icon name="ArrowRight" className="size-4" />
          </Link>
        </div>
      </section>

      <FaqSection faqs={faqs} className="border-t border-border" />
    </>
  );
}
