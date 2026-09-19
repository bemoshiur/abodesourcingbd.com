import type { CollectionConfig } from "payload";
import { revalidateHooks } from "../hooks/revalidate.ts";
import { faqsField, seoField } from "../fields/seo.ts";
import { answerField } from "../fields/answer.ts";
import { slugField } from "../fields/slug.ts";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug"],
  },
  hooks: revalidateHooks,
  fields: [
    slugField("merchandising-support"),
    { name: "title", type: "text", required: true },
    {
      name: "icon",
      type: "text",
      required: true,
      admin: { description: "lucide-react icon name, e.g. ClipboardList." },
    },
    { name: "summary", type: "textarea", required: true },
    { name: "intro", type: "textarea", required: true },
    {
      name: "covers",
      type: "array",
      required: true,
      labels: { singular: "Bullet", plural: "What it covers" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "how",
      type: "array",
      required: true,
      labels: { singular: "Bullet", plural: "How ABD does it" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "relatedCategories",
      type: "relationship",
      relationTo: "product-categories",
      hasMany: true,
    },
    answerField,
    faqsField,
    seoField,
  ],
};
