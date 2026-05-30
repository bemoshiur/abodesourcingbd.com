import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WordPress-style permalinks: every route ends in a trailing slash.
  trailingSlash: true,
  images: {
    // All product photos are local under /public; no remote patterns needed.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
