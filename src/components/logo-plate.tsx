import Image from "next/image";
import type { ImageView } from "@/lib/payload";
import { cn } from "@/lib/utils";

/**
 * An official logo on a white plate. Certification, membership and factory marks are drawn
 * for a light ground, so they never sit directly on a tinted or dark surface. `fill` +
 * `object-contain` keeps any aspect ratio (tall badge or wide wordmark) inside the box —
 * a percentage height on a plain <img> does not, and tall marks spill out of the plate.
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
}) {
  const style = height
    ? {
        height,
        width: Math.round(
          Math.min(maxWidth, Math.max(minWidth, (image.width / image.height) * (height - pad * 2) + pad * 2)),
        ),
      }
    : undefined;
  return (
    <span
      style={style}
      className={cn("relative block shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-border", className)}
    >
      <Image
        src={image.cardUrl}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={height ? { padding: pad } : undefined}
        className={cn("object-contain", !height && "p-1.5")}
      />
    </span>
  );
}
