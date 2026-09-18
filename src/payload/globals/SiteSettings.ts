import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    description: "Company identity, contact details, mission and vision.",
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "tagline", type: "text", required: true },
    { name: "oneLiner", type: "textarea", required: true },
    { name: "domain", type: "text", required: true },
    { name: "url", type: "text", required: true },
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
          label: "Geo coordinates (JSON-LD)",
          fields: [
            { name: "lat", type: "number", required: true },
            { name: "lng", type: "number", required: true },
          ],
        },
      ],
    },
    {
      name: "phones",
      type: "array",
      required: true,
      labels: { singular: "Phone", plural: "Phones" },
      fields: [{ name: "number", type: "text", required: true }],
    },
    {
      name: "emails",
      type: "array",
      required: true,
      labels: { singular: "Email", plural: "Emails" },
      fields: [{ name: "address", type: "email", required: true }],
    },
    { name: "payment", type: "textarea", required: true },
    { name: "mission", type: "textarea", required: true },
    { name: "vision", type: "textarea", required: true },
  ],
};
