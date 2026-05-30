import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/logo-mark";

/**
 * Brand lockup — the SVG logomark + wordmark. The mark is self-coloured
 * (forest badge with a gold thread), so it reads on both light and dark chrome.
 */
export function Logo({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "invert";
}) {
  const invert = tone === "invert";
  return (
    <Link
      href="/"
      className={cn(
        "group/logo inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none",
        className,
      )}
    >
      <LogoMark className="size-9 rounded-md transition-transform duration-300 group-hover/logo:-translate-y-px" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[0.95rem] font-semibold tracking-tight",
            invert ? "text-primary-foreground" : "text-foreground",
          )}
        >
          ABD Sourcing
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.62rem] font-medium uppercase tracking-[0.18em]",
            invert ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          Bangladesh
        </span>
      </span>
      <span className="sr-only">homepage</span>
    </Link>
  );
}
