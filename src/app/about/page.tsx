import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { WhyChooseUs } from "@/components/why-choose-us";
import { ExportMarkets } from "@/components/export-markets";
import { Icon } from "@/components/icon";
import { getSiteSettings } from "@/lib/payload";

export const metadata: Metadata = {
  title: "About ABD Sourcing Bangladesh",
  description:
    "ABD Sourcing Bangladesh is a Dhaka-based garments buying & sourcing office serving global fashion brands — our mission, vision, and export markets.",
  keywords: [
    "about ABD Sourcing Bangladesh",
    "garments buying office Dhaka",
    "apparel sourcing partners Bangladesh",
    "Bangladesh clothing export company",
  ],
  alternates: { canonical: "/about/" },
};

export const revalidate = 60;

export default async function AboutPage() {
  const { site, mission, vision } = await getSiteSettings();

  return (
    <>
      <Breadcrumbs items={[{ label: "About", href: "/about/" }]} />
      <PageHeader
        eyebrow="Who we are"
        title="A Bangladesh-based Apparel Buying and Sourcing Office"
        intro={site.oneLiner}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Intro + office image */}
        <section className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="space-y-4 text-muted-foreground">
            <p>
              ABD Sourcing Bangladesh is a garments buying and sourcing office based
              in Uttara, Dhaka. We act as the on-the-ground partner for global fashion
              and workwear brands — managing development, sourcing, quality, and
              shipment across a vetted network of compliant factories.
            </p>
            <p>
              Our running base spans knitwear, woven wear, sportswear, outerwear, and
              customized apparel for buyers across Europe and North America.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
            <Image
              src="/office/dhaka-office-2.jpg"
              alt="ABD Sourcing Bangladesh office in Uttara, Dhaka — product display and workspace"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Mission / Vision */}
        <section className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8">
            <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon name="PackageCheck" className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold">Mission</h2>
            <p className="mt-2 text-sm text-muted-foreground">{mission}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <span className="grid size-11 place-items-center rounded-lg bg-accent/15 text-accent-foreground">
              <Icon name="Globe" className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold">Vision</h2>
            <p className="mt-2 text-sm text-muted-foreground">{vision}</p>
          </div>
        </section>

        {/* Export markets */}
        <ExportMarkets className="mt-16 border-t border-border pt-12" />
      </div>

      <WhyChooseUs className="border-t border-border bg-muted/40 py-16 lg:py-20" />
    </>
  );
}
