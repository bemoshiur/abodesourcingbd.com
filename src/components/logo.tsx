import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

/**
 * Brand lockup — the silver "A" mark + "ABD SOURCING BANGLADESH" wordmark,
 * extracted as transparent vector art from the source Illustrator file.
 * Metallic art reads sharpest on a dark backdrop, so the default `tone`
 * wraps it in a subtle dark tile (right for the light header); pass
 * `tone="bare"` on dark surfaces (footer/CTA) to drop the tile.
 * Sized via `imgClassName` (height-driven; width follows the ~1.6:1 aspect).
 */
export function Logo({
  className,
  imgClassName = "h-9",
  tone = "tile",
}: {
  className?: string;
  /** Tailwind height utility for the logo image; width follows aspect ratio. */
  imgClassName?: string;
  /** "tile" = dark rounded backdrop (light surfaces); "bare" = transparent (dark surfaces). */
  tone?: "tile" | "bare";
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — homepage`}
      className={cn(
        "group/logo inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center transition-transform duration-300 group-hover/logo:-translate-y-px",
          tone === "tile" &&
            "rounded-lg bg-[#2e3236] px-2.5 py-1.5 ring-1 ring-white/10",
        )}
      >
        <Image
          src="/logos/abd-logo-clear-2x.png"
          alt={site.name}
          width={1200}
          height={737}
          priority
          className={cn("w-auto", imgClassName)}
          sizes="(max-width: 640px) 170px, 260px"
        />
      </span>
    </Link>
  );
}
