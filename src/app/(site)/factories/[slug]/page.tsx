import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CountryBadge } from "@/components/country-badge";
import { FaqSection } from "@/components/faq-section";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { LogoPlate } from "@/components/logo-plate";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { factoryEntry } from "@/lib/page-meta";
import {
  getCategory,
  getFactories,
  getFactory,
  getSiteSettings,
  servicesForFactory,
  type FaqView,
} from "@/lib/payload";
import { CONTACT_PATH } from "@/lib/routes";
import { breadcrumbNode, faqNode, graph, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getFactories()).map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [{ site }, f] = await Promise.all([getSiteSettings(), getFactory(slug)]);
  if (!f) return {};
  const e = factoryEntry(site, f);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: f.seo.ogImage ?? site.ogImage,
    ogEyebrow: `Partner factory · ${f.country === "india" ? "India" : "Bangladesh"}`,
  });
}

export default async function FactoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const factory = await getFactory(slug);
  if (!factory) permanentRedirect("/factories/");

  const [{ site }, services, categories] = await Promise.all([
    getSiteSettings(),
    servicesForFactory(factory),
    Promise.all(factory.categories.map((c) => getCategory(c))),
  ]);
  const cats = categories.filter((c): c is NonNullable<typeof c> => Boolean(c));
  const e = factoryEntry(site, factory);
  const crumbs = [
    { label: "Factories", href: "/factories/" },
    { label: factory.name, href: e.path },
  ];
  const faqs: FaqView[] = factory.faqs.length
    ? factory.faqs
    : [
        {
          question: `What does ${factory.name} produce?`,
          answer: `${factory.name} is a partner factory specialising in ${factory.specialty.toLowerCase()}. It runs ${factory.productTypes.join(", ").toLowerCase()} for the programmes ${site.name} manages.`,
        },
        {
          question: `How do I place an order with ${factory.name}?`,
          answer: `Orders are placed through ${site.name}. Send your brief and the team matches your style to the right production unit, then manages sampling, quality control and shipment.`,
        },
        {
          question: "Are the partner factories compliant?",
          answer:
            "We work only with compliant factories that maintain international social and technical standards. Certifications are held across our partner factories — see the compliance page for the full list.",
        },
      ];

  const jsonLd = graph([
    webPageNode(site, { path: e.path, name: e.title, description: e.description, dateModified: e.lastModified }),
    breadcrumbNode(site, e.path, crumbs),
    ...[faqNode(site, e.path, faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader eyebrow="Partner factory" title={e.heading} intro={factory.intro} answer={e.answer}>
        <CountryBadge country={factory.country} location={factory.location} className="mt-6" />
        {factory.logo && (
          <LogoPlate
            image={factory.logo}
            alt={`${factory.name} logo`}
            sizes="256px"
            height={72}
            minWidth={112}
            maxWidth={256}
            priority
            className="mt-4"
          />
        )}
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8 lg:py-20">
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl font-semibold">What it runs</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {factory.productTypes.map((t) => (
                <li key={t}>
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm">{t}</Badge>
                </li>
              ))}
            </ul>
          </section>

          {cats.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold">Categories it supports</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {cats.map((c, i) => (
                  <Reveal as="li" key={c.slug} delay={i * 60}>
                    <Link
                      href={`/products/${c.slug}/`}
                      className="glass group flex items-center gap-3 rounded-2xl p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Icon name={c.icon} className="size-5" />
                      </span>
                      <span className="text-sm font-semibold">{c.title}</span>
                      <Icon name="ArrowRight" className="ml-auto size-4 text-primary transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="mesh-dark overflow-hidden rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold">Match a style to this factory</h2>
            <p className="mt-2 text-sm text-primary-foreground/75">
              Send your brief and we recommend the right partner unit — reply within 24 hours.
            </p>
            <Link href={CONTACT_PATH} className={cn(buttonVariants({ size: "lg" }), "btn-shine mt-5 w-full bg-accent text-accent-foreground")}>
              Request a factory match
              <Icon name="ArrowRight" className="size-4" />
            </Link>
          </div>
          {services.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Related services</h2>
              <ul className="mt-4 space-y-1.5">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}/`}
                      className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/5"
                    >
                      <Icon name={s.icon} className="size-4 text-primary" />
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <FaqSection faqs={faqs} className="border-t border-border" />
    </>
  );
}
