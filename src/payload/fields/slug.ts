import type { TextField } from "payload";
import { slugify } from "../lib/slugify.ts";

/**
 * URL slug field. Editors may type a plain name ("Fair Trade bags and towels"); it is stored
 * as "fair-trade-bags-and-towels" — a raw slug with spaces or capitals produces broken page
 * URLs and an invalid sitemap entry.
 */
export function slugField(example: string): TextField {
  return {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    index: true,
    hooks: {
      beforeValidate: [({ value }) => (typeof value === "string" ? slugify(value) : value)],
    },
    admin: {
      description: `URL slug, e.g. ${example}. Typed text is converted to lowercase-with-hyphens. Changing it changes the page URL.`,
    },
  };
}
