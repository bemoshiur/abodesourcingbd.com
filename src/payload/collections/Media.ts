import type { CollectionConfig } from "payload";
import { revalidateHooks } from "../hooks/revalidate.ts";

/**
 * All site imagery. Uploads are converted to WebP and resized into three
 * ready-made variants so pages never ship a multi-megabyte original.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  hooks: revalidateHooks,
  upload: {
    mimeTypes: ["image/*"],
    adminThumbnail: "thumb",
        formatOptions: { format: "webp", options: { quality: 82 } },
    imageSizes: [
      // Width-only variants keep the original aspect ratio — garment photos vary
      // from portrait to landscape and must never be cropped.
      { name: "thumb", width: 240, withoutEnlargement: true },
      { name: "card", width: 720, withoutEnlargement: true },
      { name: "detail", width: 1400, withoutEnlargement: true },
    ],
  },
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "alt", "createdAt"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Describe what the image shows (style, fabric, view). Used for SEO and screen readers. Never include client or buyer brand names.",
      },
    },
  ],
};
