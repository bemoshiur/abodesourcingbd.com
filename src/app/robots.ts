import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/payload";

export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getSiteSettings();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
