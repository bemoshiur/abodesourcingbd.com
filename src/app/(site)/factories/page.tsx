import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CountryBadge } from "@/components/country-badge";
import { FaqSection } from "@/components/faq-section";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { LogoPlate } from "@/components/logo-plate";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Spotlight } from "@/components/spotlight";
import { Badge } from "@/components/ui/badge";
import { factoriesFaqs } from "@/lib/default-faqs";
import { factoriesEntry } from "@/lib/page-meta";
import { getCategories, getFactories, getPageMeta, getSiteSettings, type FactoryView } from "@/lib/payload";
import { breadcrumbNode, faqNode, graph, itemListNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getFaqContext } from "@/lib/site-pages";

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, pc] = await Promise.all([getSiteSettings(), getPageMeta("factories")]);
  const e = factoriesEntry(site, pc);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: site.ogImage,
    ogEyebrow: "Partner factory network · Bangladesh & India",
  });
}

export default async function FactoriesPage() {
  const [{ site }, pc, factories, categories, faqCtx] = await Promise.all([
    getSiteSettings(),
    getPageMeta("factories"),
    getFactories(),
    getCategories(),
    getFaqContext(),
  ]);
  const e = factoriesEntry(site, pc);
  const crumbs = [{ label: "Factories", href: e.path }];
  const faqs = pc.faqs.length ? pc.faqs : factoriesFaqs(faqCtx);
  const catTitle = new Map(categories.map((c) => [c.slug, c.title]));
  const groups = [
    {
      country: "bangladesh" as const,
      eyebrow: "Factory in Bangladesh",
      title: "Partner factories in Bangladesh",
      intro: "Our core knit and woven base, close to the Dhaka office and the Chattogram port.",
      factories: factories.filter((f) => f.country === "bangladesh"),
    },
    {
      country: "india" as const,
      eyebrow: "Factory in India",
      title: "Partner factories in India",
      intro: "Extended capacity for programmes that call for an Indian production base.",
      factories: factories.filter((f) => f.country === "india"),
    },
  ].filter((g) => g.factories.length > 0);

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
      name: "Partner factories",
      items: factories.map((f) => ({ name: f.name, url: `/factories/${f.slug}/` })),
    }),
    ...[faqNode(site, e.path, faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader
        eyebrow="Our network"
        title={e.heading}
        intro="Vetted knit and woven units, matched to each style by product type."
        answer={e.answer}
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {groups.map((g, gi) => (
          <div key={g.country} className={gi > 0 ? "mt-16" : undefined}>
            <SectionHeading eyebrow={g.eyebrow} title={g.title} intro={g.intro} />
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {g.factories.map((f, i) => (
                <FactoryCard key={f.slug} factory={f} index={i} catTitle={catTitle} />
              ))}
            </ul>
          </div>
        ))}

        <p className="mt-10 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground">
          <Icon name="ShieldCheck" className="mt-0.5 size-5 shrink-0 text-primary" />
          <span>
            Certifications are held across our partner factories, and every order also passes our own quality control
            process.{" "}
            <Link href="/compliance/" className="link-grow font-medium text-primary">
              See compliance and certifications
            </Link>
            .
          </span>
        </p>
      </section>

      <FaqSection faqs={faqs} className="border-t border-border" />
    </>
  );
}

function FactoryCard({
  factory: f,
  index,
  catTitle,
}: {
  factory: FactoryView;
  index: number;
  catTitle: Map<string, string>;
}) {
  return (
    <Reveal as="li" delay={(index % 3) * 70}>
      <Spotlight className="glass group h-full rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none">
        <Link href={`/factories/${f.slug}/`} className="flex h-full flex-col p-6">
          <span className="flex h-16 items-center">
            {f.logo ? (
              <LogoPlate image={f.logo} alt={`${f.name} logo`} sizes="224px" height={64} minWidth={96} maxWidth={224} />
            ) : (
              <span className="grid size-14 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/20 font-display text-lg font-semibold text-primary">
                {f.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
            )}
          </span>
          <CountryBadge country={f.country} location={f.location} className="mt-4 self-start" />
          <h3 className="mt-3 text-lg font-semibold leading-snug">{f.name}</h3>
          <p className="mt-1 text-sm font-medium text-primary">{f.specialty}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {f.productTypes.map((t) => (
              <li key={t}>
                <Badge variant="secondary">{t}</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex-1 text-sm text-muted-foreground">
            {f.categories.length > 0
              ? `Covers ${f.categories.map((c) => catTitle.get(c) ?? c).join(", ").toLowerCase()}.`
              : "Ask the team which styles this unit runs."}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            View factory
            <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </Spotlight>
    </Reveal>
  );
}
