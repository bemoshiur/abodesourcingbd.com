import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not advertise the stack. withPayload also skips its own "X-Powered-By: Next.js, Payload"
  // header when this is explicitly false (see @payloadcms/next/withPayload).
  poweredByHeader: false,
  // Site and CMS admin are separate root layouts, so unmatched URLs need a global 404.
  experimental: { globalNotFound: true },
  // sharp loads libvips (a native shared library) via dlopen, which Next's file tracer cannot see —
  // without this, Vercel's Linux functions fail with "libvips-cpp.so … cannot open shared object file"
  // and every Payload route (admin, media, on-demand revalidation) returns 500. The macOS/arm64 globs
  // exist only so the same rule can be verified in a local build.
  outputFileTracingIncludes: {
    "/**/*": [
      "./node_modules/@img/sharp-libvips-linux-x64/**/*",
      "./node_modules/@img/sharp-linux-x64/**/*",
      "./node_modules/@img/sharp-libvips-linux-arm64/**/*",
      "./node_modules/@img/sharp-linux-arm64/**/*",
      "./node_modules/@img/sharp-libvips-darwin-arm64/**/*",
      "./node_modules/@img/sharp-darwin-arm64/**/*",
    ],
  },
  // WordPress-style permalinks: every route ends in a trailing slash.
  trailingSlash: true,
  images: {
    // Media is served through Payload (private Blob store) or directly from a public Blob store.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  // The buyers/brands page was retired — send its indexed URL to products.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [{ source: "/buyers", destination: "/products/", permanent: true }];
  },
};

export default withPayload(nextConfig);
