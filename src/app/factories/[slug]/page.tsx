import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTACT_PATH } from "@/lib/routes";
import {
  getFactories,
  getFactory,
  getCategory,
  servicesForFactory,
  getSiteSettings,
  getSiteContent,
} from "@/lib/payload";

export const revalidate = 60;

export async function generateStaticParams() {
  const factories = await getFactories();
  return factories.map((f) => ({ slug: f.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = await getFactory(slug);
  if (!f) return {};
  const { site } = await getSiteSettings();
  return {
    title: `${f.name} — Partner Factory`,
    description: `${f.name}: ${f.specialty}. A compliant ABD Sourcing partner factory in Bangladesh.`,
    keywords: [
      f.name,
      f.specialty,
      "Bangladesh garment factory",
      "compliant apparel manufacturer Bangladesh",
      ...f.productTypes.map((t) => `${t} factory Bangladesh`),
    ],
    alternates: { canonical: `/factories/${f.slug}/` },
    openGraph: {
      title: `${f.name} — Partner Factory · ${site.name}`,
      description: `${f.name}: ${f.specialty}.`,
      url: `${site.url}/factories/${f.slug}/`,
    },
  };
}

export default async function FactoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const f = await getFactory(slug);
  if (!f) notFound();

  const [{ certifications }, relatedServices] = await Promise.all([
    getSiteContent(),
    servicesForFactory(f),
  ]);
  const cats = (
    await Promise.all(f.categories.map((c) => getCategory(c)))
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const host = f.website ? new URL(f.website).host.replace(/^www\./, "") : "";

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Factories", href: "/factories/" },
          { label: f.name, href: `/factories/${f.slug}/` },
        ]}
      />
      <PageHeader eyebrow="Partner factory" title={f.name} intro={f.intro}>
        {f.logo && (
          <div className="mt-6 inline-flex items-center rounded-lg border border-border bg-card px-5 py-3">
            <Image
              src={f.logo}
              alt={`${f.name} logo`}
              width={180}
              height={56}
              className="max-h-12 w-auto object-contain"
            />
          </div>
        )}
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl font-semibold">Product types</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {f.productTypes.map((t) => (
                <li key={t}>
                  <Badge variant="outline">{t}</Badge>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Certifications held</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              All ABD partner factories maintain international social and technical
              standards.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {certifications.map((c) => (
                <li
                  key={c.name}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3 text-sm"
                >
                  <Icon name="ShieldCheck" className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium text-foreground">{c.name}</span>
                    <span className="block text-xs text-muted-foreground">{c.full}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {cats.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-semibold">Related categories</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {cats.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/products/${c.slug}/`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {c.title}
                      <Icon name="ChevronRight" className="size-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {relatedServices.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-semibold">How we support this factory</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {relatedServices.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}/`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Icon name={s.icon} className="size-3.5 text-primary" />
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
              Factory website
            </h2>
            <a
              href={f.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Icon name="ExternalLink" className="size-4" />
              {host}
            </a>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="font-display text-lg font-semibold">Run your order here</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ll match your product to the right factory and manage it end to end.
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
