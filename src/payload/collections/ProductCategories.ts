import type { CollectionConfig } from "payload";
import { revalidateHooks } from "../hooks/revalidate.ts";
import { faqsField, seoField } from "../fields/seo.ts";
import { answerField } from "../fields/answer.ts";
import { slugField } from "../fields/slug.ts";

export const ProductCategories: CollectionConfig = {
  slug: "product-categories",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "order"],
  },
  defaultSort: "order",
  hooks: revalidateHooks,
  fields: [
    slugField("knitwear"),
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
    { name: "image", type: "upload", relationTo: "media", label: "Cover image (optional)" },
    {
      name: "order",
      type: "number",
      defaultValue: 100,
      admin: { position: "sidebar", description: "Lower numbers appear first." },
    },
    answerField,
    faqsField,
    seoField,
  ],
};
