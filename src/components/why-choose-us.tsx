import { Icon } from "@/components/icon";
import { getSiteContent } from "@/lib/payload";

/** Reusable "Why Choose Us" band — 9 differentiators, reused on Home/About/Contact. */
export async function WhyChooseUs({
  className,
  heading = "Why brands choose ABD Sourcing",
}: {
  className?: string;
  heading?: string;
}) {
  const { whyChooseUs } = await getSiteContent();

  return (
    <section className={className} aria-labelledby="why-choose-us">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
          Why choose us
        </p>
        <h2
          id="why-choose-us"
          className="mt-2 max-w-2xl font-display text-2xl font-semibold sm:text-3xl"
        >
          {heading}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item) => (
            <li
              key={item.title}
              className="glass interact flex items-start gap-3 rounded-xl p-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <Icon name={item.icon} className="size-5" />
              </span>
              <span className="pt-1.5 text-sm font-medium text-foreground">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
