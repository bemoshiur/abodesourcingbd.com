import path from "path";
import { fileURLToPath } from "url";

import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./collections/Users.ts";
import { Media } from "./collections/Media.ts";
import { Services } from "./collections/Services.ts";
import { ProductCategories } from "./collections/ProductCategories.ts";
import { ProductShots } from "./collections/ProductShots.ts";
import { Factories } from "./collections/Factories.ts";
import { Buyers } from "./collections/Buyers.ts";
import { SiteSettings } from "./globals/SiteSettings.ts";
import { SiteContent } from "./globals/SiteContent.ts";

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
  collections: [Users, Media, Services, ProductCategories, ProductShots, Factories, Buyers],
  globals: [SiteSettings, SiteContent],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      // Disabled locally when no token is present — uploads then stay on disk.
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
