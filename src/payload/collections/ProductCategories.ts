import type { CollectionConfig } from "payload";

export const ProductCategories: CollectionConfig = {
  slug: "product-categories",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug"],
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL slug, e.g. knitwear. Changing it changes the page URL." },
    },
    { name: "title", type: "text", required: true },
    {
      name: "icon",
      type: "text",
      required: true,
      admin: { description: "lucide-react icon name, e.g. Shirt." },
    },
    { name: "summary", type: "textarea", required: true },
    { name: "intro", type: "textarea", required: true },
    {
      name: "subItems",
      type: "array",
      required: true,
      labels: { singular: "Sub-item", plural: "Sub-items" },
      fields: [{ name: "item", type: "text", required: true }],
    },
  ],
};
