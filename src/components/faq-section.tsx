import type { FaqView } from "@/lib/payload";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

/**
 * Accessible FAQ accordion (native <details>: keyboard + screen-reader friendly,
 * works without JS). The same array feeds the page's FAQPage JSON-LD, so the
 * visible text and the structured data can never disagree.
 */
export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  eyebrow = "FAQ",
  intro,
  className,
}: {
  faqs: FaqView[];
  title?: string;
  eyebrow?: string;
  intro?: string;
  className?: string;
}) {
  if (!faqs.length) return null;
  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20", className)}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-sm">
          {faqs.map((f) => (
            <details key={f.question} name="faq" className="faq-item group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium marker:hidden hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
                <span>{f.question}</span>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-open:rotate-180">
                  <Icon name="ChevronDown" className="size-4" />
                </span>
              </summary>
              <div className="faq-body px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {f.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
