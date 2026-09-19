import type { MetadataRoute } from "next";
import { getProducts, getSiteSettings } from "@/lib/payload";
import { getSitePages } from "@/lib/site-pages";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ site }, entries, products] = await Promise.all([
    getSiteSettings(),
    getSitePages(),
    getProducts(),
  ]);

  // lastmod must be a real, useful signal. If nearly every record shares one date
  // (everything was published in a single batch and nothing edited since) the
  // signal is noise, so it is omitted until real edits differentiate the pages —
  // the same heuristic search-quality audits apply.
  const day = (iso?: string) => iso?.slice(0, 10);
  const counts = new Map<string, number>();
  for (const e of entries) {
    const d = day(e.lastModified);
    if (d) counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  const dated = [...counts.values()].reduce((a, b) => a + b, 0);
  const top = Math.max(0, ...counts.values());
  const uniform = dated >= 10 && top / dated > 0.85;

  const images = new Map(
    products.map((p) => [`/products/${p.categorySlug}/${p.slug}/`, p.images.map((i) => absoluteUrl(site, i.url))]),
  );

  return entries.map((e) => ({
    url: absoluteUrl(site, e.path),
    ...(e.lastModified && !uniform ? { lastModified: e.lastModified } : {}),
    ...(images.has(e.path) ? { images: images.get(e.path) } : {}),
  }));
}
