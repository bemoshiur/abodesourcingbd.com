import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getBuyers, getCategories } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Running Buyers & Brands",
  description:
    "International fashion and workwear brands across Sweden, the UK, Denmark, Germany, and the USA currently in production with ABD Sourcing Bangladesh.",
  keywords: [
    "ABD Sourcing buyers",
    "European apparel brands Bangladesh sourcing",
    "Scandinavian clothing brands Bangladesh",
    "UK workwear brands Bangladesh manufacturer",
  ],
  alternates: { canonical: "/buyers/" },
};

export const revalidate = 60;

export default async function BuyersPage() {
  const [buyers, categories] = await Promise.all([getBuyers(), getCategories()]);

  return (
    <>
      <Breadcrumbs items={[{ label: "Buyers", href: "/buyers/" }]} />
      <PageHeader
        eyebrow="Trusted by"
        title="Running buyers & brands"
        intro="A snapshot of the international brands we currently run production for across Europe and North America."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Per-brand tags */}
        <h2 className="font-display text-2xl font-semibold">All brands</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buyers.map((b) => {
            const cats = b.categories
              .map((c) => categories.find((cat) => cat.slug === c))
              .filter((c): c is NonNullable<typeof c> => Boolean(c));
            return (
              <div key={b.slug} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold">{b.name}</h3>
                  {b.country && (
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">
                      {b.country}
                    </span>
                  )}
                </div>
                {b.note && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{b.note}</p>
                )}
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {cats.map((c) => (
                    <li key={c.slug}>
                      <Badge variant="secondary">{c.title}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
