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

/**
 * One FAQ answer on a page. `faqs` is an array, so it cannot go through CHANGES: the row is found by
 * its question and only its answer is replaced, and only while that answer still equals `from`.
 */
interface FaqChange {
  page: string;
  question: string;
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
  // The site now has six categories, so "five categories" is wrong. The Products copy names the
  // garment categories without counting them (a count goes stale the next time one is added).
  {
    page: "products",
    field: "heading",
    from: "Clothing Manufacturer in Bangladesh: Five Product Categories",
    to: "Clothing Manufacturer in Bangladesh: Our Product Range",
  },
  {
    page: "products",
    field: "intro",
    from: "Looking for a clothing manufacturer in Bangladesh? ABD Sourcing Bangladesh is a buying and sourcing office in Dhaka that develops and produces garments through compliant partner factories in five categories: knitwear, woven wear, activewear and performance wear, outerwear and workwear. We manage samples, quality control and shipment for buyers in Europe and North America.",
    to: "Looking for a clothing manufacturer in Bangladesh? ABD Sourcing Bangladesh is a buying and sourcing office in Dhaka that develops and produces garments through compliant partner factories across knitwear, woven wear, activewear and performance wear, outerwear and workwear. We manage samples, quality control and shipment for buyers in Europe and North America.",
  },
  {
    page: "products",
    field: "answer",
    from: "ABD Sourcing Bangladesh manages clothing manufacturing in Bangladesh through compliant partner factories in five categories: knitwear, woven wear, activewear and performance wear, outerwear and workwear. Fabrics range from combed and organic cotton to recycled polyester, developed to the buyer's specification, with seven-step quality control and shipment to Europe and North America.",
    to: "ABD Sourcing Bangladesh manages clothing manufacturing in Bangladesh through compliant partner factories across knitwear, woven wear, activewear and performance wear, outerwear and workwear. Fabrics range from combed and organic cotton to recycled polyester, developed to the buyer's specification, with seven-step quality control and shipment to Europe and North America.",
  },
];

/** Same rule for the FAQ rows that also said "five categories". */
const FAQ_CHANGES: FaqChange[] = [
  {
    page: "home",
    question: "What products can ABD source from Bangladesh?",
    from: "We source five categories: knitwear such as T-shirts, polos and hoodies; woven wear such as chinos and shorts; activewear and performance wear; outerwear including micro fleece and softshell; and workwear including high-visibility layers. Fabrics range from combed and organic cotton to recycled polyester, developed to your specification.",
    to: "We source knitwear such as T-shirts, polos and hoodies; woven wear such as chinos and shorts; activewear and performance wear; outerwear including micro fleece and softshell; and workwear including high-visibility layers. Fabrics range from combed and organic cotton to recycled polyester, developed to your specification.",
  },
  {
    page: "products",
    question: "What clothing can ABD source and produce in Bangladesh?",
    from: "ABD sources five categories through compliant partner factories: knitwear (T-shirts, polos, tank tops, hoodies, sweatshirts, knit shirts), woven wear (pants, chinos, cargo pants, shorts, woven shirts), activewear and performance wear, outerwear (jackets, micro fleece, fleece hoodies, softshell) and workwear (contrast hoodies, full-zips, high-visibility, workwear polos).",
    to: "ABD sources knitwear (T-shirts, polos, tank tops, hoodies, sweatshirts, knit shirts), woven wear (pants, chinos, cargo pants, shorts, woven shirts), activewear and performance wear, outerwear (jackets, micro fleece, fleece hoodies, softshell) and workwear (contrast hoodies, full-zips, high-visibility, workwear polos) through compliant partner factories.",
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

type Faq = { id?: string; question: string; answer: string };
for (const c of FAQ_CHANGES) {
  const label = `${c.page}.faqs["${c.question}"]`;
  const faqs = (current[c.page]?.faqs as Faq[] | undefined) ?? [];
  const row = faqs.find((f) => f.question === c.question);
  if (!row) {
    skipped++;
    console.log(`! ${label} not found — skipped`);
    continue;
  }
  if (row.answer === c.to) {
    console.log(`= ${label} already set`);
    continue;
  }
  if (row.answer !== c.from) {
    skipped++;
    console.log(`! ${label} was edited since this change was written — left alone`);
    console.log(`    now: ${String(row.answer).slice(0, 160)}`);
    continue;
  }
  console.log(`${apply ? "set" : "would set"} ${label}\n    -> ${c.to}`);
  // Write the whole page group back (as the scalar path does), swapping only this row's answer.
  const page = (patch[c.page] as Record<string, unknown>) ?? { ...current[c.page] };
  page.faqs = ((page.faqs as Faq[] | undefined) ?? faqs).map((f) => (f.question === c.question ? { ...f, answer: c.to } : f));
  patch[c.page] = page;
}

if (apply && Object.keys(patch).length) {
  await payload.updateGlobal({ slug: "page-content", data: patch as never, context: { disableRevalidate: true } });
  console.log("\npage-content updated.");
} else if (!apply) {
  console.log("\nDry run — add the word apply to write.");
}
process.exit(skipped ? 2 : 0);
