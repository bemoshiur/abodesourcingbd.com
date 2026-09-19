/**
 * Compare-and-set CMS copy. Each change names the value it expects to replace; if the field has been
 * edited since, it is left alone and reported instead of overwritten. Safe to re-run.
 *
 *   npm run set:copy          # dry run
 *   npm run set:copy -- apply # write
 *
 * Use this for every copy change — never re-run the bulk seed over a live database.
 */
for (const f of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(f);
  } catch {
    // file missing — fine
  }
}

import { getPayload } from "payload";

const { default: config } = await import("../src/payload/payload.config.ts");

interface Change {
  page: string;
  field: string;
  from: string;
  to: string;
}

const CHANGES: Change[] = [
  {
    page: "home",
    field: "heading",
    from: "ABD Sourcing is a Garment Sourcing & Buying Office specializing in apparel sourcing and production in Bangladesh and India.",
    to: "Garment Sourcing & Buying Office in Bangladesh and India",
  },
  {
    page: "services",
    field: "heading",
    from: "Apparel Sourcing Services in Bangladesh & India , From Tech Pack to Shipment",
    to: "Apparel Sourcing Services in Bangladesh & India",
  },
  {
    page: "factories",
    field: "heading",
    from: "Compliant Garment Factories in Bangladesh and India: Our Partner Network",
    to: "Compliant Garment Factories in Bangladesh & India",
  },
  {
    // The owner asked for the company name in the H1 (and no underline under "Bangladesh").
    page: "home",
    field: "heading",
    from: "Garment Sourcing & Buying Office in Bangladesh and India",
    to: "ABD Sourcing: Garment Buying & Sourcing Office in Bangladesh & India",
  },
  {
    page: "compliance",
    field: "heading",
    from: "BSCI-Certified Garment Factories in Bangladesh: 7-Step Quality Control",
    to: "Multiple-Certified Garment Factories in Bangladesh: 7-Step Quality Control",
  },
  {
    // The same change for a database that already took the earlier wording of it (an intermediate
    // draft that read "Multiple Certified ... Bangladesh & India"). The owner's exact text wins.
    page: "compliance",
    field: "heading",
    from: "Multiple Certified Garment Factories in Bangladesh & India: 7-Step Quality Control",
    to: "Multiple-Certified Garment Factories in Bangladesh: 7-Step Quality Control",
  },
  {
    page: "home",
    field: "metaTitle",
    from: "Garment Sourcing Agent Bangladesh | ABD Sourcing Bangladesh",
    to: "Garment Sourcing Agent in Bangladesh | ABD Sourcing",
  },
];

const apply = process.argv.includes("apply");
const payload = await getPayload({ config });
const current = (await payload.findGlobal({ slug: "page-content", depth: 0 })) as unknown as Record<
  string,
  Record<string, unknown>
>;

const patch: Record<string, unknown> = {};
let skipped = 0;
for (const c of CHANGES) {
  const now = current[c.page]?.[c.field];
  if (now === c.to) {
    console.log(`= ${c.page}.${c.field} already set`);
    continue;
  }
  if (now !== c.from) {
    skipped++;
    console.log(`! ${c.page}.${c.field} was edited since this change was written — left alone`);
    console.log(`    now: ${String(now).slice(0, 160)}`);
    continue;
  }
  console.log(`${apply ? "set" : "would set"} ${c.page}.${c.field}\n    -> ${c.to}`);
  const page = (patch[c.page] as Record<string, unknown>) ?? { ...current[c.page] };
  page[c.field] = c.to;
  patch[c.page] = page;
}

if (apply && Object.keys(patch).length) {
  await payload.updateGlobal({ slug: "page-content", data: patch as never, context: { disableRevalidate: true } });
  console.log("\npage-content updated.");
} else if (!apply) {
  console.log("\nDry run — add the word apply to write.");
}
process.exit(skipped ? 2 : 0);
