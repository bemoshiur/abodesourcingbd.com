import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    mimeTypes: ["image/*"],
  },
  admin: {
    useAsTitle: "filename",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Descriptive alt text (SEO + accessibility)." },
    },
  ],
};
