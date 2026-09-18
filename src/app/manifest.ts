import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/payload";

// Static export needs each metadata route to opt into static rendering.
export const dynamic = "force-static";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { site } = await getSiteSettings();
  return {
    name: site.name,
    short_name: "ABD Sourcing",
    description: site.oneLiner,
    start_url: "/",
    display: "standalone",
    background_color: "#FBFAF7",
    theme_color: "#1C5340",
    icons: [
      { src: "/icon.png", type: "image/png", sizes: "512x512" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
