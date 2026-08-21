import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { InquiryForm } from "@/components/inquiry-form";
import { WhyChooseUs } from "@/components/why-choose-us";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact & Request a Quote",
  description:
    "Request a quote from ABD Sourcing Bangladesh. Office in Uttara, Dhaka. We reply within 24 hours — your details stay private.",
  keywords: [
    "contact ABD Sourcing Bangladesh",
    "request apparel quote Bangladesh",
    "garment sourcing inquiry Dhaka",
    "Uttara buying office contact",
  ],
  alternates: { canonical: "/contact/" },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  image: `${site.url}/logos/abd-logo.png`,
  url: `${site.url}/contact/`,
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

export default function ContactPage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
      <Breadcrumbs items={[{ label: "Contact", href: "/contact/" }]} />
      <PageHeader
        eyebrow="Get a quote"
        title="Let's source your next program"
        intro="Send your tech pack or reference, target quantity, and market — we reply within 24 hours."
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        {/* Contact info */}
        <div className="space-y-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Office</h2>
            <p className="mt-3 flex items-start gap-2.5 text-sm text-muted-foreground">
              <Icon name="MapPin" className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                {site.address.line1}
                <br />
                {site.address.line2}, {site.address.city}
                <br />
                {site.address.country}
              </span>
            </p>
            <div className="mt-4 space-y-2 text-sm">
              {site.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p}`}
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Icon name="Phone" className="size-4 text-primary" />
                  <span className="tabular-nums">{p}</span>
                </a>
              ))}
              {site.emails.map((e) => (
                <a
                  key={e}
                  href={`mailto:${e}`}
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Icon name="Mail" className="size-4 text-primary" />
                  {e}
                </a>
              ))}
            </div>
          </div>

          <p className="rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
            {site.payment}
          </p>

          {/* Office location map — Uttara, Sector-04, Dhaka */}
          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              title="ABD Sourcing Bangladesh office location — Uttara Sector-04, Dhaka"
              src="https://www.google.com/maps?q=Uttara+Sector-4,+Dhaka+1230,+Bangladesh&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-56 w-full border-0"
            />
          </div>
        </div>

        {/* Inquiry form — the conversion core */}
        <InquiryForm />
      </div>

      <WhyChooseUs className="border-t border-border bg-muted/40 py-16 lg:py-20" />
    </>
  );
}
