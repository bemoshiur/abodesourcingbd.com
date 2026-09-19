import type { CollectionConfig } from "payload";
import { revalidateHooks } from "../hooks/revalidate.ts";
import { faqsField, seoField } from "../fields/seo.ts";
import { answerField } from "../fields/answer.ts";
import { slugField } from "../fields/slug.ts";

/**
 * Evergreen buyer guides — the site's editorial surface. Every competitor that ranks for
 * "best garment sourcing in Bangladesh" ranks with a long-form article, not a homepage.
 *
 * House rules for this collection (the build's content guard enforces the first three):
 *   - never name a client or buyer brand, a person, a phone number or a second email address
 *   - never state how many styles the catalogue holds
 *   - never claim ABD is "the best" — the superlative may only appear as the reader's question
 *   - a third-party company may be named only as neutral, sourced fact, never as endorsement
 */
export const Guides: CollectionConfig = {
  slug: "guides",
  labels: { singular: "Guide", plural: "Guides" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "published", "order"],
    description: "Long-form buyer guides published under /guides/.",
  },
  defaultSort: "order",
  hooks: revalidateHooks,
  fields: [
    slugField("how-to-choose-a-garment-sourcing-agent-in-bangladesh"),
    { name: "title", type: "text", required: true, admin: { description: "Shown on the hub card and used as the <title> when no SEO override is set." } },
    {
      name: "icon",
      type: "text",
      required: true,
      defaultValue: "Lightbulb",
      admin: { description: "lucide-react icon name, e.g. Lightbulb." },
    },
    { name: "summary", type: "textarea", required: true, admin: { description: "One or two sentences for the hub card." } },
    {
      name: "readingMinutes",
      type: "number",
      admin: { position: "sidebar", description: "Optional. Shown on the guide; leave blank to hide." },
    },
    {
      name: "sections",
      type: "array",
      required: true,
      labels: { singular: "Section", plural: "Sections" },
      admin: { description: "Each section becomes an <h2> with its paragraphs, optional bullets and optional table." },
      fields: [
        { name: "heading", type: "text", required: true },
        {
          name: "body",
          type: "array",
          labels: { singular: "Paragraph", plural: "Paragraphs" },
          fields: [{ name: "text", type: "textarea", required: true }],
        },
        {
          name: "bullets",
          type: "array",
          labels: { singular: "Bullet", plural: "Bullets" },
          fields: [
            { name: "label", type: "text", admin: { description: "Optional bold lead-in." } },
            { name: "text", type: "textarea", required: true },
          ],
        },
        {
          name: "table",
          type: "group",
          admin: { description: "Optional comparison table. Leave the columns empty to hide it." },
          fields: [
            { name: "caption", type: "text" },
            {
              name: "columns",
              type: "array",
              labels: { singular: "Column", plural: "Columns" },
              fields: [{ name: "label", type: "text", required: true }],
            },
            {
              name: "rows",
              type: "array",
              labels: { singular: "Row", plural: "Rows" },
              fields: [
                {
                  name: "cells",
                  type: "array",
                  labels: { singular: "Cell", plural: "Cells" },
                  fields: [{ name: "text", type: "text", required: true }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "takeaways",
      type: "array",
      labels: { singular: "Takeaway", plural: "Key takeaways" },
      admin: { description: "Short factual lines shown in a summary box and reused in llms-full.txt." },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "sources",
      type: "array",
      labels: { singular: "Source", plural: "Sources" },
      admin: { description: "Public sources for anything a reader could challenge. Shown at the foot of the guide." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "relatedCategories",
      type: "relationship",
      relationTo: "product-categories",
      hasMany: true,
      admin: { description: "Cross-links shown at the end of the guide." },
    },
    {
      name: "relatedServices",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
    },
    { name: "published", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
    { name: "order", type: "number", defaultValue: 100, admin: { position: "sidebar", description: "Lower numbers appear first." } },
    answerField,
    faqsField,
    seoField,
  ],
};
