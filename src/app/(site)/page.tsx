import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { AnswerBlock } from "@/components/answer-block";
import { CountUp } from "@/components/count-up";
import { ExportMarkets } from "@/components/export-markets";
import { FaqSection } from "@/components/faq-section";
import { Headline } from "@/components/headline";
import { MembershipsBand } from "@/components/memberships-band";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Spotlight } from "@/components/spotlight";
import { WhyChooseUs } from "@/components/why-choose-us";
import { buttonVariants } from "@/components/ui/button";
import { homeFaqs } from "@/lib/default-faqs";
import { homeEntry } from "@/lib/page-meta";
import {
  featuredProducts,
  getCategories,
  getPageMeta,
  getProducts,
  getServices,
  getSiteContent,
  getSiteSettings,
  getFactories,
} from "@/lib/payload";
import { CONTACT_PATH } from "@/lib/routes";
import { faqNode, graph, organizationNode, webPageNode, websiteNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getFaqContext } from "@/lib/site-pages";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, pc] = await Promise.all([getSiteSettings(), getPageMeta("home")]);
  const e = homeEntry(site, pc);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: site.ogImage,
    ogEyebrow: "Garments buying & sourcing · Dhaka",
    keywords: site.keywords,
  });
}

export default async function HomePage() {
  const [{ site, mission }, pc, services, categories, products, featured, content, factories, faqCtx] =
    await Promise.all([
      getSiteSettings(),
      getPageMeta("home"),
      getServices(),
      getCategories(),
      getProducts(),
      featuredProducts(),
      getSiteContent(),
      getFactories(),
      getFaqContext(),
    ]);

  const e = homeEntry(site, pc);
  const faqs = pc.faqs.length ? pc.faqs : homeFaqs(faqCtx);

  const heroCards = featured.slice(0, 3);
  const stats = [
    { value: factories.length, label: "Partner factories" },
    { value: content.exportMarkets.length, label: "Export markets" },
    { value: categories.length, label: "Product categories" },
    { value: content.certifications.length, label: "Certifications" },
  ];

  const byCategory = new Map<string, typeof products>();
  for (const p of products) byCategory.set(p.categorySlug, [...(byCategory.get(p.categorySlug) ?? []), p]);

  const jsonLd = graph([
    organizationNode(site, {
      areaServed: content.exportMarkets.map((m) => m.name),
      knowsAbout: categories.map((c) => c.title),
      memberOf: content.memberships
        .filter((m) => m.relation === "member")
        .map((m) => ({ name: m.fullName, url: m.url, membershipNumber: m.idValue })),
    }),
    websiteNode(site),
    webPageNode(site, { path: e.path, name: e.title, description: e.description, breadcrumb: false }),
    ...[faqNode(site, e.path, faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ───────── Hero ───────── */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <div aria-hidden className="mesh-light absolute inset-0 -z-10" />
        <div aria-hidden className="hero-aurora" />
        <div aria-hidden className="orb float-slow -right-32 top-10 -z-10 size-96 bg-accent/20" />
        <div aria-hidden className="orb float-slower -left-32 bottom-0 -z-10 size-80 bg-primary/15" />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink backdrop-blur">
              <span className="size-1.5 rounded-full bg-accent" />
              Garments buying &amp; sourcing office · Dhaka
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-[4rem]">
              <Headline text={e.heading} />
            </h1>
            <p className="mt-4 font-display text-xl font-medium text-foreground/80 sm:text-2xl">{site.tagline}</p>
            <AnswerBlock text={e.answer} className="mt-6" />

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={CONTACT_PATH} className={cn(buttonVariants({ size: "xl" }), "btn-shine ring-spin rounded-lg")}>
                Get a Quote
                <Icon name="ArrowRight" className="size-4" />
              </Link>
              <Link href="/products/" className={cn(buttonVariants({ variant: "outline", size: "xl" }), "bg-card/70 backdrop-blur")}>
                Browse all styles
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                { icon: "Clock", text: "Reply within 24 hours" },
                { icon: "ShieldCheck", text: `${content.qcSteps.length}-step quality control` },
                { icon: "BadgeCheck", text: `${content.certifications.length} certifications across partners` },
              ].map((t) => (
                <li key={t.text} className="inline-flex items-center gap-2">
                  <Icon name={t.icon} className="size-4 text-primary" />
                  {t.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Product peek + live stats */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {heroCards.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {heroCards.slice(0, 2).map((p, i) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.categorySlug}/${p.slug}/`}
                    className={cn(
                      "glass group relative block overflow-hidden rounded-3xl p-2.5 transition-transform duration-500 hover:-translate-y-1.5",
                      i === 1 ? "mt-8 float-slower" : "float-slow",
                    )}
                  >
                    <span className="photo-stage relative block aspect-[4/5] overflow-hidden rounded-2xl">
                      <Image
                        src={p.images[0].cardUrl}
                        alt={p.images[0].alt}
                        width={p.images[0].width}
                        height={p.images[0].height}
                        priority={i === 0}
                        sizes="(max-width: 1024px) 45vw, 22vw"
                        className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-2 px-1 pb-0.5 text-xs">
                      <span className="truncate font-medium">{p.categoryTitle}</span>
                      {p.styleNumber && <span className="shrink-0 tabular-nums text-primary">{p.styleNumber}</span>}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <dl className={cn("grid grid-cols-2 gap-3 sm:gap-4", heroCards.length > 0 && "mt-4")}>
              {stats.map((s) => (
                <div key={s.label} className="glass interact rounded-2xl px-5 py-5">
                  <dt className="text-sm text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 font-display text-4xl font-semibold tabular-nums text-gradient">
                    <CountUp value={s.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ───────── Who we are ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className={cn("grid gap-12 lg:items-center", site.officeImage && "lg:grid-cols-[1.1fr_0.9fr]")}>
          <Reveal className="reveal-left">
            <SectionHeading
              eyebrow="Who we are"
              title="Your apparel sourcing partner on the ground in Bangladesh"
            />
            <p className="mt-5 text-muted-foreground">{mission}</p>
            <p className="mt-4 text-muted-foreground">
              From product development to shipment, we manage the full sourcing journey across a vetted network of
              compliant knit and woven factories — so your order arrives on time, on quality, and on cost.
            </p>
            <Link href="/about/" className="link-grow mt-6 inline-flex items-center gap-1.5 pb-0.5 text-sm font-medium text-primary">
              More about ABD Sourcing
              <Icon name="ArrowRight" className="size-4" />
            </Link>
          </Reveal>
          {site.officeImage && (
            <Reveal className="reveal-right">
              <div className="ring-gradient relative overflow-hidden rounded-3xl p-1.5">
                <Image
                  src={site.officeImage.url}
                  alt={site.officeImage.alt}
                  width={site.officeImage.width}
                  height={site.officeImage.height}
                  sizes="(max-width: 1024px) 100vw, 44vw"
                  className="h-auto w-full rounded-[1.25rem] object-cover"
                />
                <span className="glass absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
                  <Icon name="MapPin" className="size-3.5 text-primary" />
                  Uttara, Dhaka
                </span>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ───────── Services ───────── */}
      <section className="border-y border-border bg-muted/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What we do"
            title="End-to-end sourcing services"
            intro="Six services that take an order from tech pack to shipment."
            href="/services/"
            cta="All services"
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 70}>
                <Spotlight className="glass group h-full rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none">
                  <Link href={`/services/${s.slug}/`} className="flex h-full flex-col p-6">
                    <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/20 text-primary">
                      <Icon name={s.icon} className="size-6" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Learn more
                      <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Spotlight>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Product categories ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="What we make"
          title="Product categories"
          intro={`Running styles across ${categories.length} categories — each with its style reference, fibre composition and fabric weight.`}
          href="/products/"
          cta="All products"
        />
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const items = byCategory.get(c.slug) ?? [];
            return (
              <Reveal as="li" key={c.slug} delay={i * 70}>
                <Spotlight className="glass group h-full overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none">
                  <Link href={`/products/${c.slug}/`} className="flex h-full flex-col">
                  <span className="grid grid-cols-3 gap-px bg-border/60">
                    {items.slice(0, 3).map((p) => (
                      <span key={p.slug} className="photo-stage relative block aspect-square">
                        <Image
                          src={p.images[0].thumbUrl}
                          alt={p.images[0].alt}
                          width={p.images[0].width}
                          height={p.images[0].height}
                          sizes="(max-width: 768px) 30vw, 12vw"
                          className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        />
                      </span>
                    ))}
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Icon name={c.icon} className="size-5" />
                      </span>
                      <span>
                        <h3 className="text-lg font-semibold leading-tight">{c.title}</h3>
                        <span className="text-xs font-medium text-accent-ink">Running styles</span>
                      </span>
                    </span>
                    <span className="mt-3 flex-1 text-sm text-muted-foreground">{c.summary}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Explore {c.title.toLowerCase()}
                      <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                  </Link>
                </Spotlight>
              </Reveal>
            );
          })}
          <Reveal as="li" delay={categories.length * 70}>
            <Link
              href={CONTACT_PATH}
              className="mesh-dark group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-white/15 text-accent">
                <Icon name="Sparkles" className="size-5" />
              </span>
              <span>
                <span className="block font-display text-xl font-semibold">Have your own tech pack?</span>
                <span className="mt-1.5 block text-sm text-primary-foreground/75">
                  We develop custom styles with the right partner factory.
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Send your brief
                  <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          </Reveal>
        </ul>
      </section>

      {/* ───────── Featured styles ───────── */}
      {featured.length > 0 && (
        <section className="border-t border-border bg-muted/40 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="In production"
              title="A few of the styles we run"
              href="/products/"
              cta="View all styles"
            />
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {featured.slice(0, 8).map((p, i) => (
                <Reveal key={p.slug} delay={(i % 4) * 70}>
                  <ProductCard product={p} sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── Process ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="How an order runs"
          title="From first brief to shipment"
          intro="Every order follows the same transparent production flow."
          align="center"
        />
        <ol className="relative mt-12 grid gap-6 sm:grid-cols-3 lg:grid-cols-9 lg:gap-2">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-5 hidden h-0.5 bg-gradient-to-r from-primary/10 via-primary/50 to-accent/60 lg:block"
          />
          {content.productionFlow.map((step, i) => (
            <Reveal as="li" key={step} delay={i * 60} className="relative flex items-start gap-3 lg:flex-col lg:items-center lg:gap-3 lg:text-center">
              <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 border-primary/30 bg-card font-display text-sm font-semibold tabular-nums text-primary shadow-[var(--shadow-soft)]">
                {i + 1}
              </span>
              <span className="pt-2 text-sm font-medium leading-snug lg:pt-0">{step}</span>
            </Reveal>
          ))}
        </ol>
      </section>

      <WhyChooseUs className="border-t border-border bg-muted/40 py-16 lg:py-24" />

      <ExportMarkets className="py-16 lg:py-24" />

      <MembershipsBand className="border-t border-border py-14 lg:py-20" />

      <FaqSection faqs={faqs} className="border-t border-border" />

    </>
  );
}
