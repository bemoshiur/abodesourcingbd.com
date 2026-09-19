import type { Field } from "payload";

/** Per-document SEO overrides. Blank = the page falls back to its generated defaults. */
export const seoField: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  admin: {
    description:
      "Search-result overrides. Leave blank to use the automatic title and description.",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      label: "Page heading (H1)",
      admin: { description: "Optional keyword-rich H1. Blank = the record's own title." },
    },
    {
      name: "metaTitle",
      type: "text",
      maxLength: 70,
      admin: { description: "≤ 60 characters is ideal. Put the main keyword first." },
    },
    {
      name: "metaDescription",
      type: "textarea",
      maxLength: 170,
      admin: { description: "≤ 155 characters is ideal. Include the main keyword and a call to action." },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      label: "Social share image",
    },
  ],
};

/** Question/answer pairs — rendered as an FAQ block plus FAQPage structured data (answer engines). */
export const faqsField: Field = {
  name: "faqs",
  type: "array",
  label: "FAQs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    description:
      "Questions buyers really ask. Keep each answer factual and 40–60 words — search and AI answer engines quote these directly.",
  },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
  ],
};
