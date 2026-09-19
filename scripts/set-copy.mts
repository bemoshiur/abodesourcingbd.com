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

/** A field on one record of a collection. `from: null` means "only fill this when it is still empty". */
interface DocChange {
  collection: "product-categories" | "services" | "factories" | "products" | "guides";
  slug: string;
  /** Dotted path, e.g. "seo.metaTitle". */
  field: string;
  from: string | null;
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
    page: "home",
    field: "metaTitle",
    from: "Garment Sourcing Agent Bangladesh | ABD Sourcing Bangladesh",
    to: "Garment Sourcing Agent in Bangladesh | ABD Sourcing",
  },
];

const DOC_CHANGES: DocChange[] = [
  // The owner added this category in the CMS with no SEO fields, so its title was generated and
  // truncated ("Fair Trade bags and towels Manufacturer & Sourcing in…") and its description read
  // as a fragment. These only apply while the fields are still empty.
  { collection: "product-categories", slug: "fair-trade-bags-and-towels", field: "summary", from: null, to: "Fairtrade-certified cotton bags and towels sourced through our partner factories in Bangladesh and India." },
  { collection: "product-categories", slug: "fair-trade-bags-and-towels", field: "seo.heading", from: null, to: "Fairtrade Cotton Bags & Towels Sourcing" },
  { collection: "product-categories", slug: "fair-trade-bags-and-towels", field: "seo.metaTitle", from: null, to: "Fairtrade Bags & Towels Sourcing | ABD Sourcing" },
  { collection: "product-categories", slug: "fair-trade-bags-and-towels", field: "seo.metaDescription", from: null, to: "Fairtrade-certified cotton bags and towels sourced through compliant partner factories in Bangladesh and India. Request a quote from ABD Sourcing." },
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
}

const get = (obj: Record<string, unknown>, path: string) =>
  path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);

for (const c of DOC_CHANGES) {
  const found = await payload.find({ collection: c.collection, where: { slug: { equals: c.slug } }, limit: 1, depth: 0 });
  const doc = found.docs[0] as unknown as Record<string, unknown> | undefined;
  if (!doc) {
    console.log(`! ${c.collection}/${c.slug} not found — skipped`);
    skipped++;
    continue;
  }
  const now = get(doc, c.field);
  if (now === c.to) {
    console.log(`= ${c.collection}/${c.slug}.${c.field} already set`);
    continue;
  }
  if (c.from === null ? Boolean(now) : now !== c.from) {
    skipped++;
    console.log(`! ${c.collection}/${c.slug}.${c.field} already has content — left alone`);
    continue;
  }
  console.log(`${apply ? "set" : "would set"} ${c.collection}/${c.slug}.${c.field}\n    -> ${c.to}`);
  if (!apply) continue;
  const [head, ...rest] = c.field.split(".");
  const data = rest.length
    ? { [head]: { ...((doc[head] as Record<string, unknown>) ?? {}), [rest.join(".")]: c.to } }
    : { [head]: c.to };
  await payload.update({ collection: c.collection, id: doc.id as number, data: data as never, context: { disableRevalidate: true } });
}

if (!apply) console.log("\nDry run — add the word apply to write.");
process.exit(skipped ? 2 : 0);
