import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { AddToInquiry } from "@/components/inquiry/add-to-inquiry";
import { AnswerBlock } from "@/components/answer-block";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqSection } from "@/components/faq-section";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductStickyBar } from "@/components/product-sticky-bar";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { productFaqs } from "@/lib/default-faqs";
import { productEntry } from "@/lib/page-meta";
import {
  adjacentProducts,
  getCategory,
  getProduct,
  getProducts,
  getSiteContent,
  getSiteSettings,
  productsForCategory,
} from "@/lib/payload";
import { CONTACT_PATH, productPath } from "@/lib/routes";
import { breadcrumbNode, faqNode, graph, productNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.categorySlug, product: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}): Promise<Metadata> {
  const { slug, product } = await params;
  const [{ site }, p] = await Promise.all([getSiteSettings(), getProduct(slug, product)]);
  if (!p) return {};
  const e = productEntry(site, p);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: p.seo.ogImage,
    ogEyebrow: `${p.categoryTitle}${p.styleNumber ? ` · ${p.styleNumber}` : ""}`,
    ogPhoto: p.images[0]?.url,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}) {
  const { slug, product } = await params;
  const p = await getProduct(slug, product);
  if (!p) {
    const cat = await getCategory(slug);
    permanentRedirect(cat ? `/products/${cat.slug}/` : "/products/");
  }

  const [{ site }, content, siblings, adj] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
    productsForCategory(p.categorySlug),
    adjacentProducts(p),
  ]);
  const e = productEntry(site, p);
  const crumbs = [
    { label: "Products", href: "/products/" },
    { label: p.categoryTitle, href: `/products/${p.categorySlug}/` },
    { label: p.name, href: e.path },
  ];
  const spec = [p.composition, p.gsm, p.fabricConstruction].filter(Boolean).join(", ");
  const faqs = productFaqs({
    name: p.name,
    styleNumber: p.styleNumber,
    spec,
    certifications: content.certifications.map((c) => c.name),
  });
  const item = {
    slug: p.slug,
    categorySlug: p.categorySlug,
    name: p.name,
    styleNumber: p.styleNumber,
    image: p.images[0].thumbUrl,
  };
  const more = siblings.filter((s) => s.slug !== p.slug).slice(0, 4);
  const specRows = [
    p.styleNumber && ["Style reference", p.styleNumber],
    ["Category", p.categoryTitle],
    p.composition && ["Composition", p.composition],
    p.gsm && ["Fabric weight", p.gsm],
    p.fabricConstruction && ["Fabric construction", p.fabricConstruction],
    ...p.specs.map((s) => [s.label, s.value]),
  ].filter(Boolean) as [string, string][];
  const mailto = `mailto:${site.emails[0]}?subject=${encodeURIComponent(`Inquiry: ${p.name}${p.styleNumber ? ` (${p.styleNumber})` : ""}`)}`;

  const jsonLd = graph([
    webPageNode(site, {
      path: e.path,
      name: e.title,
      description: e.description,
      type: "ItemPage",
      dateModified: e.lastModified,
      primaryImage: p.images[0],
      mainEntity: { "@id": `${site.url.replace(/\/$/, "")}${e.path}#product` },
    }),
    breadcrumbNode(site, e.path, crumbs),
    productNode(site, p, e.path, e.answer),
    ...[faqNode(site, e.path, faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />

      <section className="relative overflow-hidden">
        <div aria-hidden className="mesh-light absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-14">
          <ProductGallery
            name={p.name}
            images={p.images.map((i) => ({
              url: i.url,
              thumbUrl: i.thumbUrl,
              alt: i.alt,
              width: i.width,
              height: i.height,
              view: i.view,
            }))}
          />

          <div className="lg:pt-2">
            <Link
              href={`/products/${p.categorySlug}/`}
              className="link-grow inline-flex items-center gap-1.5 pb-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink"
            >
              <Icon name="ArrowLeft" className="size-3.5" />
              {p.categoryTitle}
            </Link>
            <h1 className="mt-3 font-display text-[clamp(1.75rem,4.6vw,2.75rem)] font-semibold leading-[1.08] tracking-tight">
              {p.name}
            </h1>
            {p.styleNumber && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-sm font-semibold tabular-nums text-primary">
                <Icon name="ClipboardCheck" className="size-4" />
                Style {p.styleNumber}
              </p>
            )}

            <AnswerBlock text={e.answer} className="mt-6" />

            <dl className="glass mt-6 divide-y divide-border/70 overflow-hidden rounded-2xl">
              {specRows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[9rem_1fr] gap-3 px-4 py-3 text-sm sm:grid-cols-[11rem_1fr] sm:px-5">
                  <dt className="font-medium text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 hidden flex-wrap items-center gap-3 md:flex">
              <AddToInquiry item={item} />
              <Link href={CONTACT_PATH} className={cn(buttonVariants({ variant: "outline", size: "xl" }), "bg-card/70")}>
                Go to inquiry form
                <Icon name="ArrowRight" className="size-4" />
              </Link>
            </div>
            <p className="mt-3 hidden text-sm text-muted-foreground md:block">
              Or email{" "}
              <a href={mailto} className="link-grow font-medium text-primary">
                {site.emails[0]}
              </a>{" "}
              quoting style {p.styleNumber ?? p.name}.
            </p>

            <ul className="mt-7 grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                { icon: "Clock", text: "Quotation reply within 24 hours" },
                { icon: "Lightbulb", text: "Customisable from your tech pack" },
                { icon: "ShieldCheck", text: `${content.qcSteps.length}-step quality control on every order` },
                { icon: "Factory", text: "Made in compliant partner factories" },
              ].map((t) => (
                <li key={t.text} className="flex items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon name={t.icon} className="size-4" />
                  </span>
                  {t.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {(adj.prev || adj.next) && (
        <nav aria-label="More styles in this category" className="border-y border-border bg-muted/40">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            {adj.prev ? (
              <Link href={productPath(adj.prev.categorySlug, adj.prev.slug)} className="group inline-flex min-w-0 items-center gap-2 text-sm">
                <Icon name="ChevronLeft" className="size-4 shrink-0 text-primary transition-transform group-hover:-translate-x-0.5" />
                <span className="truncate"><span className="text-muted-foreground">Previous · </span>{adj.prev.name}</span>
              </Link>
            ) : <span />}
            {adj.next && (
              <Link href={productPath(adj.next.categorySlug, adj.next.slug)} className="group inline-flex min-w-0 items-center gap-2 text-right text-sm">
                <span className="truncate"><span className="text-muted-foreground">Next · </span>{adj.next.name}</span>
                <Icon name="ChevronRight" className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </nav>
      )}

      {more.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Keep exploring"
            title={`More ${p.categoryTitle.toLowerCase()} styles`}
            href={`/products/${p.categorySlug}/`}
            cta={`All ${p.categoryTitle.toLowerCase()}`}
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {more.map((m, i) => (
              <Reveal key={m.slug} delay={i * 70}>
                <ProductCard product={m} sizes="(max-width: 640px) 46vw, 22vw" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <FaqSection faqs={faqs} title="Questions about this style" className="border-t border-border" />

      <ProductStickyBar item={item} />
    </>
  );
}
