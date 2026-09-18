import Link from "next/link";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

/** Eyebrow + title (+ optional "see all" link). `tone="invert"` for dark mesh bands. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  href,
  cta,
  tone = "default",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  href?: string;
  cta?: string;
  tone?: "default" | "invert";
  align?: "left" | "center";
  className?: string;
}) {
  const invert = tone === "invert";
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        align === "center" && "justify-center text-center",
        className,
      )}
    >
      <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
        {eyebrow && (
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.18em]",
              invert ? "text-accent" : "text-accent-ink",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl lg:text-4xl">{title}</h2>
        {intro && (
          <p
            className={cn(
              "mt-3 max-w-2xl text-sm sm:text-base",
              invert ? "text-primary-foreground/75" : "text-muted-foreground",
              align === "center" && "mx-auto",
            )}
          >
            {intro}
          </p>
        )}
      </div>
      {href && cta && (
        <Link
          href={href}
          className={cn(
            "link-grow inline-flex items-center gap-1.5 pb-0.5 text-sm font-medium",
            invert ? "text-accent" : "text-primary",
          )}
        >
          {cta}
          <Icon name="ArrowRight" className="size-4" />
        </Link>
      )}
    </div>
  );
}
