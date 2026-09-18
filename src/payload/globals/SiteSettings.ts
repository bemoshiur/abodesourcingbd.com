import type { GlobalConfig } from "payload";
import { globalAfterChangeRevalidate } from "../hooks/revalidate.ts";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    description: "Company identity, public contact details, mission, vision and site-wide imagery.",
  },
  hooks: { afterChange: [globalAfterChangeRevalidate] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "tagline", type: "text", required: true },
            { name: "oneLiner", type: "textarea", required: true },
            { name: "domain", type: "text", required: true },
            { name: "url", type: "text", required: true },
            { name: "mission", type: "textarea", required: true },
            { name: "vision", type: "textarea", required: true },
            { name: "payment", type: "textarea", required: true },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "emails",
              type: "array",
              required: true,
              labels: { singular: "Email", plural: "Public emails" },
              admin: { description: "Shown in the footer and on the Contact page. Public inbox only — no personal addresses." },
              fields: [{ name: "address", type: "email", required: true }],
            },
            {
              name: "address",
              type: "group",
              fields: [
                { name: "line1", type: "text", required: true },
                { name: "line2", type: "text", required: true },
                { name: "city", type: "text", required: true },
                { name: "country", type: "text", required: true },
                {
                  name: "geo",
                  type: "group",
                  label: "Geo coordinates (structured data)",
                  fields: [
                    { name: "lat", type: "number", required: true },
                    { name: "lng", type: "number", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Imagery",
          fields: [
            {
              name: "officeImage",
              type: "upload",
              relationTo: "media",
              label: "Showroom / office photo",
              admin: { description: "Shown in the “Who we are” sections on Home and About." },
            },
            {
              name: "ogImage",
              type: "upload",
              relationTo: "media",
              label: "Default social share image",
            },
          ],
        },
        {
          label: "Search & profiles",
          fields: [
            {
              name: "foundingYear",
              type: "number",
              admin: { description: "Optional. Only fill in a year you can stand behind — it appears in structured data." },
            },
            {
              name: "sameAs",
              type: "array",
              label: "Official profile links",
              labels: { singular: "Profile", plural: "Official profile links" },
              admin: { description: "LinkedIn, Facebook, etc. Used as entity signals for search and AI engines." },
              fields: [{ name: "url", type: "text", required: true }],
            },
            {
              name: "keywords",
              type: "array",
              label: "Site-wide keywords",
              labels: { singular: "Keyword", plural: "Site-wide keywords" },
              fields: [{ name: "keyword", type: "text", required: true }],
            },
          ],
        },
      ],
    },
  ],
};
