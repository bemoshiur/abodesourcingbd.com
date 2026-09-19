import type { CollectionConfig } from "payload";
import { revalidateHooks } from "../hooks/revalidate.ts";
import { faqsField, seoField } from "../fields/seo.ts";
import { answerField } from "../fields/answer.ts";

export const Factories: CollectionConfig = {
  slug: "factories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "specialty"],
  },
  hooks: revalidateHooks,
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL slug, e.g. liz-fashion. Changing it changes the page URL." },
    },
    { name: "name", type: "text", required: true },
    { name: "specialty", type: "text", required: true },
    {
      name: "productTypes",
      type: "array",
      required: true,
      labels: { singular: "Product type", plural: "Product types" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "product-categories",
      hasMany: true,
    },
    { name: "website", type: "text" },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "intro", type: "textarea", required: true },
    answerField,
    faqsField,
    seoField,
  ],
};
