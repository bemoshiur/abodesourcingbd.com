import path from "path";
import { fileURLToPath } from "url";

import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { privateBlobStorage } from "./storage/private-blob.ts";
import sharp from "sharp";

import { Users } from "./collections/Users.ts";
import { Media } from "./collections/Media.ts";
import { Services } from "./collections/Services.ts";
import { ProductCategories } from "./collections/ProductCategories.ts";
import { Products } from "./collections/Products.ts";
import { Factories } from "./collections/Factories.ts";
import { SiteSettings } from "./globals/SiteSettings.ts";
import { SiteContent } from "./globals/SiteContent.ts";
import { PageContent } from "./globals/PageContent.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    importMap: {
      baseDir: path.resolve(dirname, "../app/(payload)"),
    },
    meta: {
      titleSuffix: "— ABD Sourcing Bangladesh",
    },
  },
  collections: [Users, Media, Services, ProductCategories, Products, Factories],
  globals: [SiteSettings, SiteContent, PageContent],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  // Public REST/GraphQL surface is not used by the site (pages read through the
  // Local API), so GraphQL is switched off to keep the attack surface small.
  graphQL: { disable: true },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      max: 5,
    },
    // Schema changes ship as committed migrations (run at build time), never auto-push.
    push: false,
    migrationDir: path.resolve(dirname, "../../migrations"),
  }),
  sharp,
  plugins: [
    // A private Blob store is served through /api/media/file/* (custom adapter);
    // a public store (BLOB_ACCESS=public) uses the official adapter with direct CDN URLs.
    // With no token (local dev) uploads stay on disk.
    process.env.BLOB_ACCESS === "public"
      ? vercelBlobStorage({
          enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
          collections: { media: { disablePayloadAccessControl: true } },
          token: process.env.BLOB_READ_WRITE_TOKEN || "",
        })
      : privateBlobStorage({
          token: process.env.BLOB_READ_WRITE_TOKEN,
          collections: ["media"],
        }),
  ],
});
