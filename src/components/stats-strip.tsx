import { factories } from "@/content/factories";
import { exportMarkets, certifications } from "@/content/site";
import { products } from "@/content/products";
import { buyers } from "@/content/buyers";

// Every figure is derived with .length so it can never drift from the content arrays.
const stats = [
  { value: factories.length, label: "Partner factories" },
  { value: exportMarkets.length, label: "Export markets" },
  { value: products.length, label: "Product categories" },
  { value: buyers.length, label: "Running brands" },
  { value: certifications.length, label: "Certifications" },
];

export function StatsStrip({ className }: { className?: string }) {
  return (
    <section className={className} aria-label="ABD Sourcing at a glance">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass interact rounded-2xl px-5 py-6 text-center sm:text-left"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-display text-3xl font-semibold tabular-nums text-gradient sm:text-4xl">
                  {s.value}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
