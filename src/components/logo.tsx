import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getSiteSettings } from "@/lib/payload";

/**
 * Brand lockup — the silver "A" monogram (transparent vector art extracted
 * from the source Illustrator file) on a small dark tile, paired with the
 * "ABD Sourcing / Bangladesh" wordmark as live text. The horizontal layout
 * fills the header naturally and keeps the wordmark crisp at every size.
 * The mark sits on its own dark tile so the metallic art always reads.
 * `tone="invert"` switches the wordmark to light for dark surfaces.
 */
export async function Logo({
  className,
  markClassName = "size-9",
  tone = "default",
}: {
  className?: string;
  /** Tailwind size utility for the square mark tile. */
  markClassName?: string;
  /** "default" = dark wordmark (light surfaces); "invert" = light wordmark (dark surfaces). */
  tone?: "default" | "invert";
}) {
  const { site } = await getSiteSettings();
  const invert = tone === "invert";
  return (
    <Link
      href="/"
      aria-label={`${site.name} — homepage`}
      className={cn(
        "group/logo inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#2e3236] p-1.5 ring-1 ring-white/10 transition-transform duration-300 group-hover/logo:-translate-y-px",
          markClassName,
        )}
      >
        <Image
          src="/logos/abd-mark.png"
          alt={site.name}
          width={400}
          height={345}
          priority
          className="h-full w-full object-contain"
          sizes="48px"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[0.98rem] font-semibold uppercase tracking-tight",
            invert ? "text-primary-foreground" : "text-foreground",
          )}
        >
          ABD Sourcing
        </span>
        <span
          className={cn(
            "mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em]",
            invert ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          Bangladesh
        </span>
      </span>
    </Link>
  );
}
