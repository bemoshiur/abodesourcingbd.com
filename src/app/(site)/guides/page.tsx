import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Spotlight } from "@/components/spotlight";
import { guidesEntry } from "@/lib/page-meta";
import { getGuides, getPageMeta, getSiteSettings } from "@/lib/payload";
import { CONTACT_PATH } from "@/lib/routes";
import { breadcrumbNode, graph, itemListNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, pc] = await Promise.all([getSiteSettings(), getPageMeta("guides")]);
  const e = guidesEntry(site, pc);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: site.ogImage,
    ogEyebrow: "Sourcing guides",
  });
}

export default async function GuidesPage() {
  const [{ site }, pc, guides] = await Promise.all([getSiteSettings(), getPageMeta("guides"), getGuides()]);
  const e = guidesEntry(site, pc);
  const crumbs = [{ label: "Guides", href: e.path }];

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
      name: "Sourcing guides",
      items: guides.map((g) => ({ name: g.title, url: `/guides/${g.slug}/` })),
    }),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader
        eyebrow="Buyer guides"
        title={e.heading}
        intro={
          pc.intro ??
          "Plain answers to the questions buyers ask before placing an apparel order in Bangladesh or India — written by the team that runs the orders."
        }
        answer={e.answer}
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((g, i) => (
            <Reveal as="li" key={g.slug} delay={(i % 3) * 70}>
              <Spotlight className="glass group h-full rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none">
                <Link href={`/guides/${g.slug}/`} className="flex h-full flex-col p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.55_0.1_155)] text-primary-foreground shadow-md">
                    <Icon name={g.icon} className="size-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold leading-snug">{g.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{g.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read the guide
                    <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Spotlight>
            </Reveal>
          ))}
        </ul>

        <div className="mesh-dark mt-12 flex flex-col items-start gap-4 overflow-hidden rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold sm:text-2xl">Still weighing up your options?</h2>
            <p className="mt-1.5 text-sm text-primary-foreground/75">
              Send your brief and we reply within 24 hours with a clear next step.
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
