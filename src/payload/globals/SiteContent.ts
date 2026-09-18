import type { GlobalConfig } from "payload";

export const SiteContent: GlobalConfig = {
  slug: "site-content",
  label: "Site Content",
  admin: {
    description: "Reusable content lists shown across the site.",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Why Choose Us",
          fields: [
            {
              name: "whyChooseUs",
              type: "array",
              required: true,
              labels: { singular: "Differentiator", plural: "Differentiators" },
              fields: [
                { name: "title", type: "text", required: true },
                {
                  name: "icon",
                  type: "text",
                  required: true,
                  admin: { description: "lucide-react icon name, e.g. Headset." },
                },
              ],
            },
          ],
        },
        {
          label: "Export Markets",
          fields: [
            {
              name: "exportMarkets",
              type: "array",
              required: true,
              labels: { singular: "Market", plural: "Export markets" },
              fields: [
                { name: "name", type: "text", required: true },
                {
                  name: "code",
                  type: "text",
                  required: true,
                  admin: { description: "ISO country code, e.g. SE, GB, US." },
                },
              ],
            },
          ],
        },
        {
          label: "Certifications",
          fields: [
            {
              name: "certifications",
              type: "array",
              required: true,
              labels: { singular: "Certification", plural: "Certifications" },
              fields: [
                { name: "name", type: "text", required: true },
                { name: "full", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "QC Process",
          fields: [
            {
              name: "qcSteps",
              type: "array",
              required: true,
              labels: { singular: "Step", plural: "QC steps" },
              fields: [
                { name: "step", type: "text", required: true },
                { name: "detail", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Production Flow",
          fields: [
            {
              name: "productionFlow",
              type: "array",
              required: true,
              labels: { singular: "Stage", plural: "Production stages" },
              fields: [{ name: "stage", type: "text", required: true }],
            },
          ],
        },
      ],
    },
  ],
};
