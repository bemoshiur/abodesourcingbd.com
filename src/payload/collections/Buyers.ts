import type { CollectionConfig } from "payload";

export const Buyers: CollectionConfig = {
  slug: "buyers",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "country"],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    { name: "country", type: "text" },
    {
      name: "note",
      type: "text",
      admin: { description: "Extra context (sub-brands, retail group) where applicable." },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "product-categories",
      hasMany: true,
    },
    { name: "logo", type: "upload", relationTo: "media" },
  ],
};
