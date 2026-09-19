import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqSection } from "@/components/faq-section";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Spotlight } from "@/components/spotlight";
import { servicesFaqs } from "@/lib/default-faqs";
import { servicesEntry } from "@/lib/page-meta";
import { getPageMeta, getServices, getSiteContent, getSiteSettings } from "@/lib/payload";
import { breadcrumbNode, faqNode, graph, itemListNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getFaqContext } from "@/lib/site-pages";

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, pc] = await Promise.all([getSiteSettings(), getPageMeta("services")]);
  const e = servicesEntry(site, pc);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: site.ogImage,
    ogEyebrow: "Services · Bangladesh sourcing",
  });
}

export default async function ServicesPage() {
  const [{ site }, pc, services, content, faqCtx] = await Promise.all([
    getSiteSettings(),
    getPageMeta("services"),
    getServices(),
    getSiteContent(),
    getFaqContext(),
  ]);
  const e = servicesEntry(site, pc);
  const crumbs = [{ label: "Services", href: e.path }];
  const faqs = pc.faqs.length ? pc.faqs : servicesFaqs(faqCtx);

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
      name: "Sourcing services",
      items: services.map((s) => ({ name: s.title, url: `/services/${s.slug}/` })),
    }),
    ...[faqNode(site, e.path, faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader
        eyebrow="What we do"
        title={e.heading}
        intro={pc.intro ?? "Six services that take an order from tech pack to shipment."}
        answer={e.answer}
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 3) * 70}>
              <Spotlight className="glass group h-full rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none">
                <Link href={`/services/${s.slug}/`} className="flex h-full flex-col p-6">
                  <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/20 text-primary">
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <h2 className="mt-5 text-xl font-semibold">{s.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                  <ul className="mt-4 flex-1 space-y-1.5">
                    {s.covers.slice(0, 3).map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-foreground/85">
                        <Icon name="Check" className="mt-0.5 size-4 shrink-0 text-primary" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Learn more
                    <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Spotlight>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-muted/40 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it fits together"
            title="One production flow, start to finish"
            intro="The services plug into the same flow every order follows."
          />
          <ol className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {content.productionFlow.map((step, i) => (
              <Reveal as="li" key={step} delay={i * 50} className="glass flex items-center gap-3 rounded-xl p-3.5 lg:flex-col lg:text-center">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold tabular-nums text-primary">
                  {i + 1}
                </span>
                <span className="text-sm font-medium leading-snug">{step}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <FaqSection faqs={faqs} />
    </>
  );
}
