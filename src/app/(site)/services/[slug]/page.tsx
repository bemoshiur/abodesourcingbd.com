import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CountryBadge } from "@/components/country-badge";
import { FaqSection } from "@/components/faq-section";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { serviceEntry } from "@/lib/page-meta";
import {
  factoriesForCategory,
  getCategory,
  getService,
  getServices,
  getSiteContent,
  getSiteSettings,
} from "@/lib/payload";
import { CONTACT_PATH } from "@/lib/routes";
import { breadcrumbNode, faqNode, graph, serviceNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import type { FaqView } from "@/lib/payload";
import { cn } from "@/lib/utils";

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [{ site }, s] = await Promise.all([getSiteSettings(), getService(slug)]);
  if (!s) return {};
  const e = serviceEntry(site, s);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: s.seo.ogImage ?? site.ogImage,
    ogEyebrow: "Service · Bangladesh sourcing",
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) permanentRedirect("/services/");

  const [{ site }, content, allServices, categories] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
    getServices(),
    Promise.all(service.relatedCategories.map((c) => getCategory(c))),
  ]);
  const related = categories.filter((c): c is NonNullable<typeof c> => Boolean(c));
  const relatedFactories = Array.from(
    new Map(
      (await Promise.all(service.relatedCategories.map((c) => factoriesForCategory(c))))
        .flat()
        .map((f) => [f.slug, f]),
    ).values(),
  );
  const others = allServices.filter((s) => s.slug !== service.slug);

  const e = serviceEntry(site, service);
  const crumbs = [
    { label: "Services", href: "/services/" },
    { label: service.title, href: e.path },
  ];

  // CMS FAQs, else questions answered strictly from this service's own covers/how text.
  const faqs: FaqView[] = service.faqs.length
    ? service.faqs
    : [
        {
          question: `What does ${service.title.toLowerCase()} cover?`,
          answer: `${service.covers.slice(0, 5).join("; ")}.`,
        },
        {
          question: `How does ABD Sourcing Bangladesh deliver ${service.title.toLowerCase()}?`,
          answer: `${service.how.slice(0, 3).join(" ")}`,
        },
        {
          question: `How do I start with ${service.title.toLowerCase()}?`,
          answer:
            "Send a tech pack or reference garment with your target quantity and market through the contact form. The team replies within 24 hours with a clear next step.",
        },
      ];

  const jsonLd = graph([
    webPageNode(site, { path: e.path, name: e.title, description: e.description, dateModified: e.lastModified }),
    breadcrumbNode(site, e.path, crumbs),
    serviceNode(site, {
      path: e.path,
      name: service.title,
      description: e.description,
      areaServed: content.exportMarkets.map((m) => m.name),
    }),
    ...[faqNode(site, e.path, faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader eyebrow="Service" title={e.heading} intro={service.intro} answer={e.answer} />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8 lg:py-20">
        <div className="space-y-14">
          <section>
            <h2 className="font-display text-2xl font-semibold">What it covers</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {service.covers.map((c, i) => (
                <Reveal as="li" key={c} delay={(i % 2) * 60} className="glass flex items-start gap-3 rounded-xl p-4 text-sm">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon name="Check" className="size-4" />
                  </span>
                  <span className="pt-0.5 font-medium">{c}</span>
                </Reveal>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">How ABD does it</h2>
            <ol className="relative mt-6 space-y-4 before:absolute before:bottom-3 before:left-[1.15rem] before:top-3 before:w-0.5 before:bg-gradient-to-b before:from-primary/40 before:to-accent/50">
              {service.how.map((h, i) => (
                <Reveal as="li" key={h} delay={i * 60} className="relative flex items-start gap-4">
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 border-primary/30 bg-card font-display text-sm font-semibold tabular-nums text-primary shadow-[var(--shadow-soft)]">
                    {i + 1}
                  </span>
                  <p className="glass flex-1 rounded-xl p-4 text-sm text-muted-foreground">{h}</p>
                </Reveal>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="mesh-dark overflow-hidden rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold">Start with a brief</h2>
            <p className="mt-2 text-sm text-primary-foreground/75">
              Share your tech pack or reference — we reply within 24 hours with a clear next step.
            </p>
            <Link href={CONTACT_PATH} className={cn(buttonVariants({ size: "lg" }), "btn-shine mt-5 w-full bg-accent text-accent-foreground")}>
              Request a quote
              <Icon name="ArrowRight" className="size-4" />
            </Link>
          </div>

          {related.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Related categories</h2>
              <ul className="mt-4 space-y-1.5">
                {related.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/products/${c.slug}/`}
                      className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/5"
                    >
                      {c.title}
                      <Icon name="ChevronRight" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedFactories.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Partner factories</h2>
              <ul className="mt-4 space-y-1.5">
                {relatedFactories.map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/factories/${f.slug}/`}
                      className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/5"
                    >
                      <span>
                        {f.name}
                        <CountryBadge country={f.country} location={f.location} className="ml-2 align-middle" />
                      </span>
                      <Icon name="ChevronRight" className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <FaqSection faqs={faqs} className="border-t border-border" />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading eyebrow="More services" title="Other ways we help" href="/services/" cta="All services" />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}/`}
                className="glass group flex items-center gap-3 rounded-2xl p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <span className="text-sm font-semibold">{s.title}</span>
                <Icon name="ArrowRight" className="ml-auto size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
