import Link from "next/link";
import { Icon } from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import { CONTACT_PATH } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Compact inquiry CTA band — reused above the footer on every page. */
export function CtaBand() {
  return (
    <section className="mesh-dark relative overflow-hidden text-primary-foreground">
      <div aria-hidden className="orb float-slow -right-16 -top-20 size-72 bg-accent/25" />
      <div aria-hidden className="orb float-slower -bottom-24 left-1/4 size-64 bg-primary/40" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Start a conversation</p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Ready to source your next apparel program in Bangladesh?
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/80 sm:text-base">
            Send us your tech pack or reference — we reply within 24 hours with a clear next step.
          </p>
        </div>
        <Link
          href={CONTACT_PATH}
          className={cn(buttonVariants({ size: "xl" }), "btn-shine bg-accent text-accent-foreground shadow-soft [a]:hover:bg-accent/90")}
        >
          Request a Quote
          <Icon name="ArrowRight" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
