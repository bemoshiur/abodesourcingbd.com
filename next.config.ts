import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WordPress-style permalinks: every route ends in a trailing slash.
  trailingSlash: true,
  images: {
    // All product photos are local under /public; no remote patterns needed.
    formats: ["image/avif", "image/webp"],
  },
  // The buyers/brands page was retired — send its indexed URL to products.
  async redirects() {
    return [{ source: "/buyers", destination: "/products/", permanent: true }];
  },
};

export default nextConfig;
