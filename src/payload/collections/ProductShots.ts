import type { CollectionConfig } from "payload";

export const ProductShots: CollectionConfig = {
  slug: "product-shots",
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["brandName", "category", "featured"],
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    { name: "brandName", type: "text", required: true },
    {
      name: "brand",
      type: "relationship",
      relationTo: "buyers",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "product-categories",
      required: true,
    },
    {
      name: "alt",
      type: "textarea",
      required: true,
      admin: { description: "Descriptive alt: brand + style + fabric (SEO + a11y)." },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Show on the Home running-product strip." },
    },
  ],
};
