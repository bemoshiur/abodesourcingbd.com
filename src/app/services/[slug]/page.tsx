import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTACT_PATH } from "@/lib/routes";
import {
  getServices,
  getService,
  getCategory,
  factoriesForCategory,
  getSiteSettings,
} from "@/lib/payload";

export const revalidate = 60;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  const { site } = await getSiteSettings();
  return {
    title: `${service.title} — Garment Sourcing`,
    description: service.summary,
    keywords: [
      service.title,
      `${service.title} Bangladesh`,
      `${service.title} garment sourcing`,
      "apparel buying office Bangladesh",
      ...service.relatedCategories.map((c) => `${c} sourcing`),
    ],
    alternates: { canonical: `/services/${service.slug}/` },
    openGraph: {
      title: `${service.title} — ${site.name}`,
      description: service.summary,
      url: `${site.url}/services/${service.slug}/`,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const { site } = await getSiteSettings();

  const related = (
    await Promise.all(service.relatedCategories.map((c) => getCategory(c)))
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  // Factories that run any of this service's related categories (deduped).
  const relatedFactories = Array.from(
    new Map(
      (await Promise.all(service.relatedCategories.map((c) => factoriesForCategory(c))))
        .flat()
        .map((f) => [f.slug, f]),
    ).values(),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: "Worldwide",
    url: `${site.url}/services/${service.slug}/`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services/" },
          { label: service.title, href: `/services/${service.slug}/` },
        ]}
      />
      <PageHeader eyebrow="Service" title={service.title} intro={service.intro} />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl font-semibold">What it covers</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.covers.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm">
                  <Icon name="Check" className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">How ABD does it</h2>
            <ul className="mt-4 space-y-3">
              {service.how.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground"
                >
                  <Icon name="ArrowRight" className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          {related.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                Related categories
              </h2>
              <ul className="mt-4 space-y-2">
                {related.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/products/${c.slug}/`}
                      className="group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
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
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                Factories involved
              </h2>
              <ul className="mt-4 space-y-2">
                {relatedFactories.map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/factories/${f.slug}/`}
                      className="group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {f.name}
                      <Icon name="ChevronRight" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="font-display text-lg font-semibold">Need this on your next order?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us about your program — we reply within 24 hours.
            </p>
            <Link href={CONTACT_PATH} className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full")}>
              Get a Quote
              <Icon name="ArrowRight" className="size-4" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
