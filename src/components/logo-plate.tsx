import Image from "next/image";
import type { ImageView } from "@/lib/payload";
import { cn } from "@/lib/utils";

/**
 * An official logo on a white plate. Certification, membership and factory marks are drawn
 * for a light ground, so they never sit directly on a tinted or dark surface.
 *
 * The plate is a plain block with a definite size and padding, and the image fills its
 * content box with `object-contain`, so any aspect ratio (tall badge, wide wordmark) stays
 * inside. Keep it a block: as a grid/flex item with an auto track a percentage height does
 * not resolve and tall marks spill out. The <img> keeps real width/height attributes (from
 * the media record) so the browser reserves space before it loads.
 *
 * Pass `height` (px) with `minWidth` / `maxWidth` to size the plate to the logo's own
 * proportions (wide wordmarks get a wider plate); otherwise size it with `className`.
 */
export function LogoPlate({
  image,
  alt,
  sizes,
  className,
  height,
  minWidth = 64,
  maxWidth = 224,
  pad = 8,
  priority = false,
  plain = false,
}: {
  image: ImageView;
  alt: string;
  sizes: string;
  className?: string;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  /** Padding in px between the plate edge and the logo (only used with `height`). */
  pad?: number;
  priority?: boolean;
  /**
   * Render a plain <img> instead of next/image. next/image writes a full srcset for every logo, which
   * is pure page weight for a mark that is always a few dozen pixels tall (the footer strip repeats
   * 17 of them twice per page). The source is already a Payload-generated WebP thumbnail.
   */
  plain?: boolean;
}) {
  const style = height
    ? {
        height,
        padding: pad,
        width: Math.round(
          Math.min(maxWidth, Math.max(minWidth, (image.width / image.height) * (height - pad * 2) + pad * 2)),
        ),
      }
    : undefined;
  return (
    <span
      style={style}
      className={cn(
        "block shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-border",
        !height && "p-1.5",
        className,
      )}
    >
      {plain ? (
        // eslint-disable-next-line @next/next/no-img-element -- deliberate: no srcset for a tiny fixed-size mark
        <img
          src={image.thumbUrl}
          alt={alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-contain"
        />
      ) : (
        <Image
          src={image.cardUrl}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="block h-full w-full object-contain"
        />
      )}
    </span>
  );
}
