import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqSection } from "@/components/faq-section";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { guideEntry } from "@/lib/page-meta";
import { getCategory, getGuide, getGuides, getService, getSiteSettings, type GuideSection } from "@/lib/payload";
import { CONTACT_PATH } from "@/lib/routes";
import { articleNode, breadcrumbNode, faqNode, graph, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getGuides()).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [{ site }, g] = await Promise.all([getSiteSettings(), getGuide(slug)]);
  if (!g) return {};
  const e = guideEntry(site, g);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: g.seo.ogImage ?? site.ogImage,
    ogEyebrow: "Sourcing guide",
  });
}

/** Total words across the body — real content length for the Article node, never a guess. */
const guideWordCount = (sections: GuideSection[]) =>
  sections.reduce(
    (n, s) =>
      n +
      [s.heading, ...s.body, ...s.bullets.map((b) => `${b.label ?? ""} ${b.text}`)]
        .join(" ")
        .split(/\s+/)
        .filter(Boolean).length,
    0,
  );

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) permanentRedirect("/guides/");

  const [{ site }, categories, services] = await Promise.all([
    getSiteSettings(),
    Promise.all(guide.relatedCategories.map((c) => getCategory(c))),
    Promise.all(guide.relatedServices.map((s) => getService(s))),
  ]);
  const cats = categories.filter((c): c is NonNullable<typeof c> => Boolean(c));
  const svcs = services.filter((s): s is NonNullable<typeof s> => Boolean(s));
  const e = guideEntry(site, guide);
  const crumbs = [
    { label: "Guides", href: "/guides/" },
    { label: guide.title, href: e.path },
  ];

  const jsonLd = graph([
    webPageNode(site, { path: e.path, name: e.title, description: e.description, dateModified: guide.updatedAt }),
    articleNode(site, {
      path: e.path,
      headline: e.heading,
      description: e.description,
      dateModified: guide.updatedAt,
      image: guide.seo.ogImage ?? site.ogImage,
      wordCount: guideWordCount(guide.sections),
      about: guide.relatedCategories.length ? cats.map((c) => c.title) : undefined,
    }),
    breadcrumbNode(site, e.path, crumbs),
    ...[faqNode(site, e.path, guide.faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  const toc = guide.sections.map((s) => ({ id: slugifyHeading(s.heading), heading: s.heading }));

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader eyebrow="Sourcing guide" title={e.heading} intro={guide.summary} answer={guide.answer}>
        {guide.readingMinutes ? (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Icon name="Clock" className="size-3.5 text-primary" />
            About {guide.readingMinutes} min read
          </p>
        ) : null}
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_16rem] lg:gap-14 lg:px-8 lg:py-20">
        <article className="min-w-0">
          {guide.takeaways.length > 0 && (
            <section className="ring-gradient rounded-2xl p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Icon name="Sparkles" className="size-4 text-accent-ink" />
                Key takeaways
              </h2>
              <ul className="mt-4 space-y-2.5">
                {guide.takeaways.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm">
                    <Icon name="Check" className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {guide.sections.map((s, i) => (
            <Reveal as="section" key={s.heading} delay={(i % 3) * 50} className="mt-12 scroll-mt-28" id={slugifyHeading(s.heading)}>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{s.heading}</h2>
              {s.body.map((para) => (
                <p key={para.slice(0, 40)} className="mt-4 leading-relaxed text-foreground/85">
                  {para}
                </p>
              ))}
              {s.bullets.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {s.bullets.map((b) => (
                    <li key={b.text.slice(0, 40)} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent" />
                      <span className="text-foreground/85">
                        {b.label ? <strong className="font-semibold text-foreground">{b.label}: </strong> : null}
                        {b.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {s.table && (
                <figure className="mt-6">
                  <div className="overflow-x-auto rounded-2xl border border-border">
                    <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                      <thead className="bg-muted/60">
                        <tr>
                          {s.table.columns.map((c) => (
                            <th key={c} scope="col" className="border-b border-border px-4 py-3 font-semibold">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.rows.map((row, ri) => (
                          <tr key={ri} className="odd:bg-card even:bg-muted/25">
                            {row.map((cell, ci) => (
                              <td key={ci} className="border-b border-border px-4 py-3 align-top text-foreground/85">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {s.table.caption && <figcaption className="mt-2 text-xs text-muted-foreground">{s.table.caption}</figcaption>}
                </figure>
              )}
            </Reveal>
          ))}

          {guide.sources.length > 0 && (
            <section className="mt-14 border-t border-border pt-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Sources</h2>
              <ul className="mt-4 space-y-2">
                {guide.sources.map((s) => (
                  <li key={s.url} className="text-sm">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-grow inline-flex items-start gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="ExternalLink" className="mt-0.5 size-3.5 shrink-0" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {toc.length > 2 && (
            <nav aria-label="On this page" className="glass rounded-2xl p-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em]">On this page</h2>
              <ul className="mt-3 space-y-1.5">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground">
                      {t.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="mesh-dark overflow-hidden rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold">Talk it through</h2>
            <p className="mt-2 text-sm text-primary-foreground/75">
              Send your brief and the team replies within 24 hours with a clear next step.
            </p>
            <Link href={CONTACT_PATH} className={cn(buttonVariants({ size: "lg" }), "btn-shine mt-5 w-full bg-accent text-accent-foreground")}>
              Get a Quote
              <Icon name="ArrowRight" className="size-4" />
            </Link>
          </div>

          {(svcs.length > 0 || cats.length > 0) && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em]">Related on this site</h2>
              <ul className="mt-3 space-y-1.5">
                {svcs.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}/`} className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-primary/5">
                      <Icon name={s.icon} className="size-4 text-primary" />
                      {s.title}
                    </Link>
                  </li>
                ))}
                {cats.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/products/${c.slug}/`} className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-primary/5">
                      <Icon name={c.icon} className="size-4 text-primary" />
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <FaqSection faqs={guide.faqs} className="border-t border-border" />
    </>
  );
}

/** Stable anchor ids for the table of contents. */
function slugifyHeading(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
