import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { getServices } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Apparel Sourcing Services",
  description:
    "Six end-to-end garment sourcing services — product development, material & trims sourcing, merchandising, quality assurance, production monitoring, and logistics support.",
  keywords: [
    "garment sourcing services Bangladesh",
    "apparel product development",
    "merchandising support Bangladesh",
    "garment quality assurance",
    "production monitoring Bangladesh",
    "apparel logistics support",
  ],
  alternates: { canonical: "/services/" },
};

export const revalidate = 60;

export default async function ServicesIndexPage() {
  const services = await getServices();

  return (
    <>
      <Breadcrumbs items={[{ label: "Services", href: "/services/" }]} />
      <PageHeader
        eyebrow="What we do"
        title="End-to-end apparel sourcing services"
        intro="From a first sketch to a shipped order, ABD manages every stage of the garment sourcing journey in Bangladesh."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal as="div" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}/`}
              className="group flex flex-col rounded-xl glass p-6 interact"
            >
              <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon name={s.icon} className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Learn more
                <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </Reveal>
      </section>
    </>
  );
}
