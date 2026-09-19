/**
 * Repairs URL slugs that are not URL-safe (spaces, capitals, punctuation) — e.g. a category typed as
 * "Fair Trade bags and towels" — by converting them to lowercase-with-hyphens. Idempotent.
 *
 *   npm run fix:slugs            # dry run: prints what would change
 *   npm run fix:slugs -- apply   # writes the changes (a positional word: the payload CLI drops --flags)
 *
 * Product URLs are /products/<category-slug>/<product-slug>/, so renaming a category moves its products' URLs too.
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
import { slugify } from "../src/payload/lib/slugify.ts";

const apply = process.argv.includes("apply") || process.env.APPLY === "1";
const payload = await getPayload({ config });
const collections = ["product-categories", "services", "factories", "products"] as const;
let changes = 0;
let conflicts = 0;

for (const collection of collections) {
  const { docs } = await payload.find({ collection, limit: 1000, depth: 0, pagination: false });
  const taken = new Set(docs.map((d) => (d as { slug?: string | null }).slug).filter(Boolean) as string[]);
  for (const doc of docs) {
    const slug = (doc as { slug?: string | null }).slug ?? "";
    const fixed = slugify(slug);
    if (!slug || fixed === slug) continue;
    if (!fixed || taken.has(fixed)) {
      conflicts++;
      console.log(`  ! ${collection}/${doc.id}: "${slug}" -> "${fixed}" clashes with an existing slug — fix by hand in the CMS`);
      continue;
    }
    changes++;
    console.log(`  ${apply ? "fixed" : "would fix"} ${collection}/${doc.id}: "${slug}" -> "${fixed}"`);
    if (apply) {
      await payload.update({ collection, id: doc.id, data: { slug: fixed } as never, context: { disableRevalidate: true } });
      taken.add(fixed);
    }
  }
}
console.log(`\n${changes} slug(s) ${apply ? "fixed" : "to fix (dry run — add the word apply)"}, ${conflicts} conflict(s).`);
process.exit(conflicts ? 1 : 0);
