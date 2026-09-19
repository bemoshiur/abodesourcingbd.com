import Link from "next/link";
import { Icon } from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/payload";
import { CONTACT_PATH } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Three quiet facts that set expectations before the click — nothing here is a new claim. */
const CUES = [
  { icon: "Clock", text: "Reply within 24 hours" },
  { icon: "ClipboardList", text: "Tech pack or reference garment welcome" },
  { icon: "Factory", text: "Partner factories in Bangladesh and India" },
];

/** Compact inquiry CTA band — reused above the footer on every page. */
export async function CtaBand() {
  const { site } = await getSiteSettings();
  const email = site.emails[0];

  return (
    <section data-cta-band="" className="mesh-dark cta-surface relative overflow-hidden text-primary-foreground">
      <div aria-hidden className="orb float-slow -right-20 -top-24 size-72 bg-accent/25" />
      <div aria-hidden className="orb float-slower -bottom-28 left-[22%] size-64 bg-primary/40" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-7 px-4 py-11 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-10 lg:px-8 lg:py-14">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.87_0.125_95)]">
            <Icon name="MessagesSquare" className="size-3.5" />
            Start a conversation
          </p>
          <h2 className="mt-2.5 font-display text-2xl font-semibold leading-[1.14] sm:text-3xl lg:text-4xl">
            Ready to source your next apparel program in{" "}
            <span className="text-gradient-gold">Bangladesh &amp; India</span>?
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/85 sm:text-base">
            Send us your tech pack or reference — we reply within 24 hours with a clear next step.
          </p>
          {/* The per-item classes live on the list so the markup below stays small — this band ships
              inside every page's footer. */}
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary-foreground/80 [&>li]:inline-flex [&>li]:items-center [&>li]:gap-1.5 [&_svg]:size-3.5 [&_svg]:text-accent">
            {CUES.map((c) => (
              <li key={c.text}>
                <Icon name={c.icon} />
                {c.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start gap-3 md:w-auto md:items-end">
          <Link
            data-cta-primary=""
            href={CONTACT_PATH}
            className={cn(
              buttonVariants({ size: "xl" }),
              "btn-shine btn-gold w-full justify-center rounded-xl text-accent-foreground sm:w-auto",
            )}
          >
            Request a Quote
            <Icon name="ArrowRight" className="size-4" />
          </Link>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 text-sm leading-7 text-primary-foreground/80 transition-colors hover:text-accent"
          >
            <Icon name="Mail" className="size-4 text-accent" />
            Or email {email}
          </a>
        </div>
      </div>
    </section>
  );
}
