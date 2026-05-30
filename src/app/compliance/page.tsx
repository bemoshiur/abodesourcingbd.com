import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { certifications, qcSteps, productionFlow } from "@/content/site";

export const metadata: Metadata = {
  title: "Compliance, Certifications & Quality",
  description:
    "ABD partner factories hold BSCI, SEDEX, WRAP, ISO, OEKO-TEX, GOTS, GRS and Recycled OEKO-TEX certifications, backed by a 7-step QC process and a transparent production flow.",
  keywords: [
    "BSCI SEDEX WRAP certified factory Bangladesh",
    "OEKO-TEX GOTS GRS apparel Bangladesh",
    "ethical garment sourcing Bangladesh",
    "7-step quality control garments",
    "compliant clothing manufacturer Bangladesh",
  ],
  alternates: { canonical: "/compliance/" },
};

export default function CompliancePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Compliance", href: "/compliance/" }]} />
      <PageHeader
        eyebrow="Trust & quality"
        title="Compliance, certifications & quality control"
        intro="We work only with compliant factories that maintain international social and technical standards — and we verify quality at every stage."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Certifications */}
        <section>
          <h2 className="font-display text-2xl font-semibold">Certifications</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            All <span className="tabular-nums">{certifications.length}</span>{" "}
            certifications below are held across our partner factories.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((c) => (
              <li
                key={c.name}
                className="rounded-xl border border-border bg-card p-5 text-center"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary mx-auto">
                  <Icon name="ShieldCheck" className="size-5" />
                </span>
                <span className="mt-3 block font-semibold">{c.name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{c.full}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 7-step QC */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display text-2xl font-semibold">
            Our 7-step quality control process
          </h2>
          <ol className="mt-6 space-y-3">
            {qcSteps.map((q, i) => (
              <li
                key={q.step}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-semibold tabular-nums text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{q.step}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{q.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Production flow */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display text-2xl font-semibold">Production flow</h2>
          <ol className="mt-6 flex flex-wrap items-center gap-2">
            {productionFlow.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium">
                  {step}
                </span>
                {i < productionFlow.length - 1 && (
                  <Icon name="ArrowRight" className="size-4 text-muted-foreground" />
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Ethical sourcing narrative */}
        <section className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-8">
          <h2 className="font-display text-xl font-semibold">Ethical sourcing</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Compliance is not a checkbox for us — it is how we protect both the
            people who make your garments and the brands who sell them. Our partner
            factories are audited against leading social and technical standards, and
            we favour recycled and organic-certified inputs wherever a program allows.
            That is what &ldquo;Building Trust&rdquo; means in practice.
          </p>
        </section>
      </div>
    </>
  );
}
