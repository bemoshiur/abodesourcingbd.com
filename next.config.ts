import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WordPress-style permalinks: every route ends in a trailing slash.
  trailingSlash: true,
  images: {
    // Product/factory/buyer images are served from Vercel Blob via Payload Media.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  // The buyers/brands page was retired — send its indexed URL to products.
  async redirects() {
    return [{ source: "/buyers", destination: "/products/", permanent: true }];
  },
};

export default withPayload(nextConfig);
