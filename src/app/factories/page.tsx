import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { factories } from "@/content/factories";

export const metadata: Metadata = {
  title: "Partner Factory Network",
  description:
    "Six compliant partner factories in Bangladesh covering knit sportswear, activewear, polos, tees, jackets, woven wear, and denim.",
  keywords: [
    "Bangladesh garment factories",
    "compliant apparel manufacturers Bangladesh",
    "knit composite factory Bangladesh",
    "woven denim factory Bangladesh",
    "BSCI WRAP SEDEX factory Bangladesh",
  ],
  alternates: { canonical: "/factories/" },
};

export default function FactoriesIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Factories", href: "/factories/" }]} />
      <PageHeader
        eyebrow="Factory network"
        title="Our partner factories"
        intro="A vetted base of compliant manufacturers — each chosen for a specialty, so your order runs where it fits best."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal as="div" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {factories.map((f) => (
            <Link
              key={f.slug}
              href={`/factories/${f.slug}/`}
              className="group flex flex-col rounded-xl glass p-6 interact"
            >
              <div className="flex h-12 items-center">
                {f.logo ? (
                  <Image
                    src={f.logo}
                    alt={`${f.name} logo`}
                    width={160}
                    height={48}
                    className="max-h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="grid size-11 place-items-center rounded-lg bg-primary/10 font-display text-lg font-semibold text-primary">
                    {f.name.charAt(0)}
                  </span>
                )}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{f.name}</h2>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{f.specialty}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                View factory
                <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </Reveal>
      </section>
    </>
  );
}
