import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Static export needs each metadata route to opt into static rendering.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "ABD Sourcing",
    description: site.oneLiner,
    start_url: "/",
    display: "standalone",
    background_color: "#FBFAF7",
    theme_color: "#1C5340",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
