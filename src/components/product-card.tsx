import Image from "next/image";
import Link from "next/link";
import { AddToInquiry } from "@/components/inquiry/add-to-inquiry";
import type { ImageView, ProductView } from "@/lib/payload";
import { productPath } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** The subset of a product a card needs — lets client components receive light props. */
export type ProductCardData = Pick<
  ProductView,
  "slug" | "name" | "styleNumber" | "categorySlug" | "composition" | "gsm" | "featured"
> & { images: ImageView[] };

/**
 * Product tile: studio-white photo stage (never cropped), name, style ref and a
 * one-line spec. The whole card is one stretched link; the "Add to inquiry"
 * button sits above it (a link may not contain a button).
 */
export function ProductCard({
  product: p,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className,
}: {
  product: ProductCardData;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const img = p.images[0];
  const spec = [p.composition, p.gsm].filter(Boolean).join(" · ");
  const href = productPath(p.categorySlug, p.slug);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none",
        className,
      )}
    >
      <div className="photo-stage relative aspect-[4/5] overflow-hidden">
        <Image
          src={img.cardUrl}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes={sizes}
          priority={priority}
          className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none sm:p-4"
        />
        <div className="absolute right-2.5 top-2.5 z-20">
          <AddToInquiry
            variant="compact"
            item={{
              slug: p.slug,
              categorySlug: p.categorySlug,
              name: p.name,
              styleNumber: p.styleNumber,
              image: img.thumbUrl,
            }}
          />
        </div>
        {p.featured && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-accent/90 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-accent-foreground">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-border/70 p-3.5 sm:p-4">
        {/* A <p>, not a heading: a grid of styles is a list of links, and one heading per card put
            dozens of same-level headings on a page with little prose between them. The link is still
            the card's accessible name, so heading-free navigation is unaffected. */}
        <p className="line-clamp-2 text-sm font-semibold leading-snug sm:text-[0.95rem]">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {p.name}
            {p.styleNumber ? <span className="sr-only"> — style {p.styleNumber}</span> : null}
          </Link>
        </p>
        {p.styleNumber && (
          <p className="text-xs font-medium tabular-nums text-primary">{p.styleNumber}</p>
        )}
        {spec && <p className="mt-auto line-clamp-1 pt-1 text-xs text-muted-foreground">{spec}</p>}
      </div>
    </article>
  );
}
