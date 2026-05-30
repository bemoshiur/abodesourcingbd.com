import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { StatsStrip } from "@/components/stats-strip";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Reveal } from "@/components/reveal";
import { LogoWall } from "@/components/logo-wall";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTACT_PATH } from "@/lib/routes";
import { site, mission } from "@/content/site";
import { services } from "@/content/services";
import { products, featuredShots } from "@/content/products";
import { factories } from "@/content/factories";
import { buyers } from "@/content/buyers";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/logos/abd-logo.png`,
  description: site.oneLiner,
  email: site.emails[0],
  telephone: site.phones[0],
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: "Dhaka",
    postalCode: "1230",
    addressCountry: "BD",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  image: `${site.url}/logos/abd-logo.png`,
  url: site.url,
  telephone: site.phones,
  email: site.emails,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: "Dhaka",
    postalCode: "1230",
    addressCountry: "BD",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.address.geo.lat,
    longitude: site.address.geo.lng,
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[orgJsonLd, localBusinessJsonLd]} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="hero-aurora" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
            Garments buying & sourcing office · Dhaka, Bangladesh
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            ABD Sourcing{" "}
            <span className="text-gradient">Bangladesh</span>
          </h1>
          <p className="mt-5 max-w-2xl font-display text-xl font-medium text-foreground/85 sm:text-2xl">
            {site.tagline}
          </p>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {site.oneLiner}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={CONTACT_PATH} className={cn(buttonVariants({ size: "xl" }))}>
              Get a Quote
              <Icon name="ArrowRight" className="size-4" />
            </Link>
            <Link
              href="/services/"
              className={cn(buttonVariants({ variant: "outline", size: "xl" }))}
            >
              Explore our services
            </Link>
          </div>
        </div>
      </section>

      <StatsStrip className="-mt-8 pb-4" />

      {/* Condensed about */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
              Who we are
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              Your apparel sourcing partner on the ground in Bangladesh
            </h2>
            <p className="mt-4 text-muted-foreground">{mission}</p>
            <p className="mt-4 text-muted-foreground">
              From product development to shipment, we manage the full sourcing
              journey across a vetted network of compliant knit and woven
              factories — so your order arrives on time, on quality, and on cost.
            </p>
            <Link
              href="/about/"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              More about ABD Sourcing
              <Icon name="ArrowRight" className="size-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
            <Image
              src="/office/dhaka-office-3.jpg"
              alt="ABD Sourcing Bangladesh office in Uttara, Dhaka — meeting and sampling area"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="border-y border-border bg-muted/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What we do"
            title="End-to-end sourcing services"
            href="/services/"
            cta="All services"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}/`}
                className="group flex flex-col rounded-xl glass p-6 interact"
              >
                <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Learn more
                  <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="What we make"
          title="Product categories"
          href="/products/"
          cta="All products"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}/`}
              className="group flex items-start gap-4 rounded-xl glass p-6 interact"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent-foreground">
                <Icon name={p.icon} className="size-5" />
              </span>
              <span>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.summary}</p>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured running products */}
      <section className="border-t border-border bg-muted/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="In production"
            title="A few of the products we run"
            href="/products/"
            cta="See all categories"
          />
          <Reveal as="div" className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredShots().map((shot) => (
              <figure
                key={shot.src}
                className="group overflow-hidden rounded-xl glass"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover img-zoom"
                  />
                </div>
                <figcaption className="px-3 py-2.5 text-xs font-medium text-muted-foreground">
                  {shot.brandName}
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Buyers logo wall teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Trusted by"
          title="Brands in production with ABD"
          href="/buyers/"
          cta="All buyers"
        />
        <Reveal className="mt-8">
          <LogoWall buyers={buyers} />
        </Reveal>
      </section>

      {/* Factories + Compliance teasers */}
      <section className="border-t border-border bg-muted/40 py-16 lg:py-20">
        <Reveal as="div" className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <TeaserCard
            eyebrow="Factory network"
            title={`${factories.length} compliant partner factories`}
            body="Knit sportswear, activewear, polos, tees, jackets, woven and denim — a vetted base built for quality and flexible MOQs."
            href="/factories/"
            cta="Explore factories"
            icon="Factory"
          />
          <TeaserCard
            eyebrow="Compliance"
            title="Audited, certified, ethical"
            body="Our partner factories hold BSCI, SEDEX, WRAP, ISO, OEKO-TEX, GOTS, GRS and Recycled OEKO-TEX, backed by a 7-step QC process."
            href="/compliance/"
            cta="See compliance"
            icon="ShieldCheck"
          />
        </Reveal>
      </section>

      <WhyChooseUs className="py-16 lg:py-20" />
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        {cta}
        <Icon name="ArrowRight" className="size-4" />
      </Link>
    </div>
  );
}

function TeaserCard({
  eyebrow,
  title,
  body,
  href,
  cta,
  icon,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl glass p-8 interact"
    >
      <span className="grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon name={icon} className="size-6" />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
        {eyebrow}
      </p>
      <h3 className="mt-1.5 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        {cta}
        <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
