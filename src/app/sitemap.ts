import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/payload";
import { allRoutes } from "@/lib/routes";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site } = await getSiteSettings();
  const now = new Date();
  const routes = await allRoutes();
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/contact/" ? 0.9 : 0.7,
  }));
}
