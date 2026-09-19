import type { Field, GlobalConfig } from "payload";
import { globalAfterChangeRevalidate } from "../hooks/revalidate.ts";
import { faqsField } from "../fields/seo.ts";
import { answerField } from "../fields/answer.ts";

/** One tab per page: the search title/description, the H1, an intro line and its FAQs. */
function pageTab(label: string, name: string, extra: Field[] = []) {
  return {
    label,
    name,
    fields: [
      {
        name: "metaTitle",
        type: "text",
        maxLength: 70,
        admin: { description: "≤ 60 characters. Main keyword first, brand last." },
      },
      {
        name: "metaDescription",
        type: "textarea",
        maxLength: 170,
        admin: { description: "≤ 155 characters. Include the main keyword and a call to action." },
      },
      { name: "heading", type: "text", label: "Page heading (H1)" },
      { name: "intro", type: "textarea", label: "Intro paragraph" },
      answerField,
      ...extra,
      faqsField,
    ] as Field[],
  };
}

export const PageContent: GlobalConfig = {
  slug: "page-content",
  label: "Page SEO & FAQs",
  admin: {
    description:
      "Search titles, descriptions, headings and FAQs for every main page. Blank fields use the built-in defaults.",
  },
  hooks: { afterChange: [globalAfterChangeRevalidate] },
  fields: [
    {
      type: "tabs",
      tabs: [
        pageTab("Home", "home"),
        pageTab("About", "about"),
        pageTab("Services", "services"),
        pageTab("Products", "products"),
        pageTab("Factories", "factories"),
        pageTab("Compliance", "compliance"),
        pageTab("Contact", "contact"),
      ],
    },
  ],
};
