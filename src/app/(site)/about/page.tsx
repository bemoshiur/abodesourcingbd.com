import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CountUp } from "@/components/count-up";
import { ExportMarkets } from "@/components/export-markets";
import { FaqSection } from "@/components/faq-section";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { WhyChooseUs } from "@/components/why-choose-us";
import { buttonVariants } from "@/components/ui/button";
import { aboutEntry } from "@/lib/page-meta";
import {
  getCategories,
  getFactories,
  getPageMeta,
  getProducts,
  getSiteContent,
  getSiteSettings,
} from "@/lib/payload";
import { CONTACT_PATH } from "@/lib/routes";
import { breadcrumbNode, faqNode, graph, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, pc] = await Promise.all([getSiteSettings(), getPageMeta("about")]);
  const e = aboutEntry(site, pc);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: site.ogImage,
    ogEyebrow: "About · Dhaka buying office",
  });
}

export default async function AboutPage() {
  const [{ site, mission, vision }, pc, content, factories, categories, products] = await Promise.all([
    getSiteSettings(),
    getPageMeta("about"),
    getSiteContent(),
    getFactories(),
    getCategories(),
    getProducts(),
  ]);
  const e = aboutEntry(site, pc);
  const crumbs = [{ label: "About", href: e.path }];
  const stats = [
    { value: factories.length, label: "Partner factories" },
    { value: categories.length, label: "Product categories" },
    { value: products.length, label: "Styles listed" },
    { value: content.exportMarkets.length, label: "Export markets" },
    { value: content.certifications.length, label: "Certifications" },
  ];

  const jsonLd = graph([
    webPageNode(site, { path: e.path, name: e.title, description: e.description, type: "AboutPage" }),
    breadcrumbNode(site, e.path, crumbs),
    ...[faqNode(site, e.path, pc.faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader eyebrow="Who we are" title={e.heading} intro={pc.intro ?? site.oneLiner} answer={e.answer} />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <section className={cn("grid gap-10 lg:items-center", site.officeImage && "lg:grid-cols-[1.2fr_1fr]")}>
          <Reveal className="reveal-left space-y-4 text-muted-foreground">
            <p>
              {site.name} is a garments buying and sourcing office based in Uttara, Dhaka. We act as the on-the-ground
              partner for global fashion and workwear brands — managing development, sourcing, quality, and shipment
              across a vetted network of compliant factories.
            </p>
            <p>
              Our running base spans knitwear, woven wear, activewear, outerwear and workwear for buyers across Europe
              and North America. Production always takes place in partner factories; we are the team that keeps every
              order on time, on quality and on cost.
            </p>
          </Reveal>
          {site.officeImage && (
            <Reveal className="reveal-right">
              <div className="ring-gradient overflow-hidden rounded-3xl p-1.5">
                <Image
                  src={site.officeImage.url}
                  alt={site.officeImage.alt}
                  width={site.officeImage.width}
                  height={site.officeImage.height}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="h-auto w-full rounded-[1.25rem] object-cover"
                />
              </div>
            </Reveal>
          )}
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-2">
          {[
            { title: "Mission", icon: "PackageCheck", text: mission, tint: "from-primary/15 to-primary/5" },
            { title: "Vision", icon: "Globe", text: vision, tint: "from-accent/25 to-accent/5" },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="glass h-full rounded-3xl p-8">
                <span className={cn("grid size-12 place-items-center rounded-xl bg-gradient-to-br text-primary", c.tint)}>
                  <Icon name={c.icon} className="size-6" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold">{c.title}</h2>
                <p className="mt-3 text-muted-foreground">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <dl className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 60} className="glass rounded-2xl px-5 py-6 text-center">
              <dd className="font-display text-4xl font-semibold tabular-nums text-gradient">
                <CountUp value={s.value} />
              </dd>
              <dt className="mt-1 text-sm text-muted-foreground">{s.label}</dt>
            </Reveal>
          ))}
        </dl>

        <section className="mt-20">
          <SectionHeading
            eyebrow="How we work"
            title="A transparent flow for every order"
            intro="From development to shipment, each stage has an owner and a checkpoint."
          />
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.productionFlow.map((step, i) => (
              <Reveal as="li" key={step} delay={(i % 3) * 60} className="glass flex items-center gap-4 rounded-2xl p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 font-display text-base font-semibold tabular-nums text-primary-foreground">
                  {i + 1}
                </span>
                <span className="font-medium">{step}</span>
              </Reveal>
            ))}
          </ol>
        </section>
      </div>

      <ExportMarkets className="border-t border-border py-14 lg:py-20" />
      <WhyChooseUs className="border-t border-border bg-muted/40 py-14 lg:py-20" />
      {pc.faqs.length > 0 && <FaqSection faqs={pc.faqs} />}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mesh-dark flex flex-col items-start gap-4 overflow-hidden rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold sm:text-2xl">Let&apos;s talk about your next program</h2>
            <p className="mt-1.5 text-sm text-primary-foreground/75">Share a tech pack or reference — we reply within 24 hours.</p>
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
