import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqSection } from "@/components/faq-section";
import { Icon } from "@/components/icon";
import { InquiryForm } from "@/components/inquiry-form";
import { JsonLd } from "@/components/jsonld";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { WhyChooseUs } from "@/components/why-choose-us";
import { contactEntry } from "@/lib/page-meta";
import { getCategories, getPageMeta, getSiteContent, getSiteSettings } from "@/lib/payload";
import { breadcrumbNode, faqNode, graph, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, pc] = await Promise.all([getSiteSettings(), getPageMeta("contact")]);
  const e = contactEntry(site, pc);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: site.ogImage,
    ogEyebrow: "Contact · Request a quote",
  });
}

const steps = [
  { icon: "Send", title: "Share your brief", text: "Tech pack, reference garment or style refs, target quantity and market." },
  { icon: "ClipboardCheck", title: "We quote within 24 hours", text: "A clear next step: costing, sample plan or the questions we still need answered." },
  { icon: "Factory", title: "Samples & production", text: "Sampling, quality control and shipment managed through the right partner factory." },
];

export default async function ContactPage() {
  const [{ site }, pc, content, categories] = await Promise.all([
    getSiteSettings(),
    getPageMeta("contact"),
    getSiteContent(),
    getCategories(),
  ]);
  const e = contactEntry(site, pc);
  const crumbs = [{ label: "Contact", href: e.path }];
  const email = site.emails[0];

  const jsonLd = graph([
    webPageNode(site, { path: e.path, name: e.title, description: e.description, type: "ContactPage" }),
    breadcrumbNode(site, e.path, crumbs),
    ...[faqNode(site, e.path, pc.faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader
        eyebrow="Get a quote"
        title={e.heading}
        intro={pc.intro ?? "Send your tech pack or reference, target quantity and market — we reply within 24 hours."}
        answer={e.answer}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:px-8 lg:py-16">
        <div className="space-y-8">
          <Reveal className="glass rounded-3xl p-6 sm:p-7">
            <h2 className="font-display text-xl font-semibold">Office</h2>
            <p className="mt-4 flex items-start gap-3 text-muted-foreground">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon name="MapPin" className="size-4" />
              </span>
              <span>
                {site.address.line1}
                <br />
                {site.address.line2}, {site.address.city}
                <br />
                {site.address.country}
              </span>
            </p>
            {email && (
              <a
                href={`mailto:${email}`}
                className="link-grow mt-4 inline-flex items-center gap-3 pb-0.5 font-medium text-foreground"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon name="Mail" className="size-4" />
                </span>
                {email}
              </a>
            )}
            <p className="mt-5 flex items-center gap-2 rounded-xl bg-accent/12 px-3.5 py-2.5 text-sm">
              <Icon name="Clock" className="size-4 shrink-0 text-accent-ink" />
              We reply within 24 hours.
            </p>
          </Reveal>

          <div>
            <h2 className="font-display text-xl font-semibold">What happens next</h2>
            <ol className="mt-5 space-y-3">
              {steps.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 80} className="glass flex items-start gap-4 rounded-2xl p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/25 text-primary">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">
                      <span className="mr-1.5 tabular-nums text-accent-ink">{i + 1}.</span>
                      {s.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{s.text}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>

          <p className="rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">{site.payment}</p>

          {/* Office location map — Uttara, Sector-04, Dhaka */}
          <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]">
            <iframe
              title="ABD Sourcing Bangladesh office location — Uttara Sector-04, Dhaka"
              src="https://www.google.com/maps?q=Uttara+Sector-4,+Dhaka+1230,+Bangladesh&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-60 w-full border-0"
            />
          </div>
        </div>

        {/* Inquiry form — the conversion core */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <InquiryForm markets={content.exportMarkets} categories={categories} />
        </div>
      </div>

      {pc.faqs.length > 0 && <FaqSection faqs={pc.faqs} className="border-t border-border" />}
      <WhyChooseUs className="border-t border-border bg-muted/40 py-14 lg:py-20" />
    </>
  );
}
