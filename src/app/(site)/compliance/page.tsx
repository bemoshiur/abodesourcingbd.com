import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CertificationsBand } from "@/components/certifications-band";
import { FaqSection } from "@/components/faq-section";
import { MembershipsBand } from "@/components/memberships-band";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { LogoPlate } from "@/components/logo-plate";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Spotlight } from "@/components/spotlight";
import { complianceFaqs } from "@/lib/default-faqs";
import { complianceEntry } from "@/lib/page-meta";
import { getPageMeta, getSiteContent, getSiteSettings } from "@/lib/payload";
import { breadcrumbNode, faqNode, graph, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getFaqContext } from "@/lib/site-pages";

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, pc] = await Promise.all([getSiteSettings(), getPageMeta("compliance")]);
  const e = complianceEntry(site, pc);
  return buildMetadata({
    site,
    path: e.path,
    title: e.title,
    description: e.description,
    image: site.ogImage,
    ogEyebrow: "Compliance · Certified partner factories",
  });
}

export default async function CompliancePage() {
  const [{ site }, pc, content, faqCtx] = await Promise.all([
    getSiteSettings(),
    getPageMeta("compliance"),
    getSiteContent(),
    getFaqContext(),
  ]);
  const e = complianceEntry(site, pc);
  const crumbs = [{ label: "Compliance", href: e.path }];
  const faqs = pc.faqs.length ? pc.faqs : complianceFaqs(faqCtx);

  const jsonLd = graph([
    webPageNode(site, { path: e.path, name: e.title, description: e.description }),
    breadcrumbNode(site, e.path, crumbs),
    ...[faqNode(site, e.path, faqs)].filter((n): n is NonNullable<typeof n> => Boolean(n)),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <PageHeader
        eyebrow="Trust & quality"
        title={e.heading}
        intro={
          pc.intro ??
          "We work only with compliant factories that maintain international social and technical standards — and we verify quality at every stage."
        }
        answer={e.answer}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <section>
          <SectionHeading
            eyebrow="Certifications"
            title={`${content.certifications.length} standards held across our partner factories`}
            intro="Certifications are carried by the factories we place orders with. Ask the team which apply to your programme."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.certifications.map((c, i) => (
              <Reveal as="li" key={c.name} delay={(i % 3) * 60}>
                <Spotlight className="glass h-full rounded-2xl">
                  <div className="flex h-full items-start gap-4 p-5">
                    {c.logo ? (
                      <LogoPlate image={c.logo} alt={`${c.name} logo`} sizes="112px" className="h-20 w-28" />
                    ) : (
                      <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/25 text-primary">
                        <Icon name="BadgeCheck" className="size-6" />
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold leading-tight">{c.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{c.full}</p>
                    </div>
                  </div>
                </Spotlight>
              </Reveal>
            ))}
          </ul>
        </section>

        <MembershipsBand className="mt-20 border-t border-border pt-14 [&>div]:px-0 sm:[&>div]:px-0 lg:[&>div]:px-0" />

        <section className="mt-20 border-t border-border pt-14">
          <SectionHeading
            eyebrow="Quality control"
            title={`Our ${content.qcSteps.length}-step quality control process`}
            intro="Goods ship only after every gate has passed."
          />
          <ol className="relative mt-10 space-y-4 before:absolute before:bottom-4 before:left-[1.4rem] before:top-4 before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:to-accent/60">
            {content.qcSteps.map((q, i) => (
              <Reveal as="li" key={q.step} delay={i * 50} className="relative flex items-start gap-5">
                <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-2 border-primary/30 bg-card font-display text-base font-semibold tabular-nums text-primary shadow-[var(--shadow-soft)]">
                  {i + 1}
                </span>
                <div className="glass flex-1 rounded-2xl p-5">
                  <h3 className="font-semibold">{q.step}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{q.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="mt-20 border-t border-border pt-14">
          <SectionHeading eyebrow="Production flow" title="From development to shipment" />
          <ol className="mt-8 flex flex-wrap items-center gap-2">
            {content.productionFlow.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="glass rounded-xl px-4 py-2.5 text-sm font-medium">{step}</span>
                {i < content.productionFlow.length - 1 && <Icon name="ArrowRight" className="size-4 text-muted-foreground" />}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-8 lg:p-10">
          <h2 className="font-display text-2xl font-semibold">Ethical sourcing</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Compliance is not a checkbox for us — it is how we protect both the people who make your garments and the
            brands who sell them. Our partner factories are audited against leading social and technical standards, and
            we favour recycled and organic-certified inputs wherever a program allows. That is what &ldquo;Building
            Trust&rdquo; means in practice.
          </p>
        </section>
      </div>

      <FaqSection faqs={faqs} className="border-t border-border" />
      <CertificationsBand />
    </>
  );
}
