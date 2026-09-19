import type { Metadata } from "next";
import type { ImageView, SiteInfo } from "@/lib/payload";

/**
 * Head builder. Every page goes through buildMetadata() so titles/descriptions
 * are length-safe, the canonical is always the page's own trailing-slash URL,
 * and og:image / twitter:image are never missing (Next replaces — not merges —
 * a page's `openGraph` object, which silently drops the layout's image).
 */

const BRAND_SHORT = "ABD Sourcing";
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** Cut at a word boundary so we never end mid-word. */
function clamp(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max - 1).replace(/[,;:\-–—\s]+$/, "")}…`;
}

/** "<keyword phrase> | ABD Sourcing" — the brand suffix is dropped rather than exceed 60 chars. */
export function withBrand(title: string): string {
  const base = title.replace(/\s+/g, " ").trim();
  if (base.toLowerCase().includes(BRAND_SHORT.toLowerCase())) return clamp(base, TITLE_MAX);
  const full = `${base} | ${BRAND_SHORT}`;
  return full.length <= TITLE_MAX ? full : clamp(base, TITLE_MAX);
}

export function clampDescription(text: string): string {
  return clamp(text, DESCRIPTION_MAX);
}

export function absoluteUrl(site: Pick<SiteInfo, "url">, path: string): string {
  const base = site.url.replace(/\/$/, "");
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Dynamic share card (see src/app/og/route.tsx). `img` must be a same-site media path. */
export function ogImageUrl(opts: { title: string; eyebrow?: string; img?: string }): string {
  const q = new URLSearchParams({ title: opts.title });
  if (opts.eyebrow) q.set("eyebrow", opts.eyebrow);
  if (opts.img) q.set("img", opts.img);
  return `/og/?${q.toString()}`;
}

export interface PageMetaInput {
  site: SiteInfo;
  /** Path with leading and trailing slash, e.g. "/products/knitwear/". */
  path: string;
  /** Final <title> (brand suffix added if it fits). */
  title: string;
  description: string;
  /** CMS override image; falls back to a generated share card. */
  image?: ImageView;
  ogEyebrow?: string;
  /** Same-site media path shown inside the generated share card (products). */
  ogPhoto?: string;
  type?: "website" | "article";
  keywords?: string[];
  noindex?: boolean;
}

export function buildMetadata(input: PageMetaInput): Metadata {
  const { site, path } = input;
  const title = withBrand(input.title);
  const description = clampDescription(input.description);
  const url = absoluteUrl(site, path);
  const imageUrl = input.image
    ? absoluteUrl(site, input.image.url)
    : absoluteUrl(site, ogImageUrl({ title: input.title, eyebrow: input.ogEyebrow, img: input.ogPhoto }));
  const images = [{ url: imageUrl, width: 1200, height: 630, alt: input.title }];

  return {
    title: { absolute: title },
    description,
    keywords: input.keywords,
    alternates: { canonical: path },
    robots: input.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: input.type ?? "website",
      siteName: site.name,
      title,
      description,
      url,
      locale: "en_US",
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  };
}
