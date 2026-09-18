import type { CollectionConfig } from "payload";
import { slugify } from "../lib/slugify.ts";
import { revalidateHooks } from "../hooks/revalidate.ts";
import { seoField } from "../fields/seo.ts";

/**
 * A running style. Each product gets its own page (/products/<category>/<slug>/)
 * with its photos, style number and composition, plus an "Add to inquiry" action.
 * Buyer / brand names must never be entered here.
 */
export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Product", plural: "Products" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "styleNumber", "category", "featured", "published"],
    listSearchableFields: ["name", "styleNumber", "composition"],
    description:
      "Running styles shown on the Products pages. Never enter client or buyer brand names.",
  },
  defaultSort: "order",
  hooks: {
    ...revalidateHooks,
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data;
        const name = (data.name ?? originalDoc?.name) as string | undefined;
        const style = (data.styleNumber ?? originalDoc?.styleNumber) as string | undefined;
        const typed = typeof data.slug === "string" ? data.slug.trim() : "";
        data.slug = slugify(typed || [name, style].filter(Boolean).join(" "));
        return data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true, admin: { description: "e.g. Men's Short-Sleeve Polo Shirt" } },
    {
      name: "styleNumber",
      type: "text",
      index: true,
      admin: { description: "Your own style / reference number, exactly as on the spec sheet." },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "product-categories",
      required: true,
      index: true,
    },
    { name: "summary", type: "textarea", admin: { description: "One or two sentences shown on the product card." } },
    { name: "description", type: "textarea" },
    {
      type: "row",
      fields: [
        { name: "composition", type: "text", admin: { description: "e.g. 100% Pima Cotton" } },
        { name: "gsm", type: "text", label: "GSM / weight", admin: { description: "e.g. 170 GSM" } },
        { name: "fabricConstruction", type: "text", label: "Fabric / construction", admin: { description: "e.g. Interlock" } },
      ],
    },
    {
      name: "specs",
      type: "array",
      label: "Extra specifications",
      labels: { singular: "Specification", plural: "Extra specifications" },
      fields: [
        { type: "row", fields: [
          { name: "label", type: "text", required: true },
          { name: "value", type: "text", required: true },
        ] },
      ],
    },
    {
      name: "images",
      type: "array",
      minRows: 1,
      labels: { singular: "Photo", plural: "Photos" },
      admin: { description: "The first photo is the main image and the card cover." },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        {
          name: "view",
          type: "select",
          defaultValue: "front",
          options: [
            { label: "Front", value: "front" },
            { label: "Back", value: "back" },
            { label: "Side", value: "side" },
            { label: "Detail", value: "detail" },
            { label: "Other", value: "other" },
          ],
        },
      ],
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "Generated from name + style number. Changing it changes the page URL." },
    },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar", description: "Show on the Home page strip." } },
    { name: "published", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
    { name: "order", type: "number", defaultValue: 100, admin: { position: "sidebar", description: "Lower numbers appear first." } },
    seoField,
  ],
};
