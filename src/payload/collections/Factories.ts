import type { CollectionConfig } from "payload";
import { revalidateHooks } from "../hooks/revalidate.ts";
import { faqsField, seoField } from "../fields/seo.ts";
import { answerField } from "../fields/answer.ts";
import { slugField } from "../fields/slug.ts";

export const Factories: CollectionConfig = {
  slug: "factories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "country", "specialty", "order"],
  },
  defaultSort: "order",
  hooks: revalidateHooks,
  fields: [
    slugField("liz-fashion"),
    { name: "name", type: "text", required: true },
    {
      name: "country",
      type: "select",
      required: true,
      defaultValue: "bangladesh",
      index: true,
      options: [
        { label: "Bangladesh", value: "bangladesh" },
        { label: "India", value: "india" },
      ],
      admin: {
        position: "sidebar",
        description: "Where the factory is. Drives the “Factory in Bangladesh / Factory in India” grouping.",
      },
    },
    {
      name: "location",
      type: "text",
      admin: { position: "sidebar", description: "City / state, only if the factory states it publicly." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 100,
      admin: { position: "sidebar", description: "Lower numbers appear first within a country." },
    },
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
