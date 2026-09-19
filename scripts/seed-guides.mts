/**
 * Loads the evergreen guides in scripts/data/guides.json into the CMS.
 *
 *   npm run seed:guides            # create anything missing, report what already exists
 *   npm run seed:guides -- update  # also overwrite guides that already exist
 *
 * Create-if-missing by default so an owner edit in /admin is never silently overwritten.
 */
for (const f of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(f);
  } catch {
    // file missing — fine
  }
}

import fs from "node:fs";
import path from "node:path";
import { getPayload } from "payload";

const { default: config } = await import("../src/payload/payload.config.ts");

const ROOT = process.cwd();
const file = path.join(ROOT, "scripts", "data", "guides.json");
if (!fs.existsSync(file)) {
  console.log("scripts/data/guides.json not found — nothing to seed.");
  process.exit(0);
}

interface GuideSeed {
  slug: string;
  title: string;
  icon?: string;
  summary: string;
  readingMinutes?: number;
  answer?: string;
  sections: unknown[];
  takeaways?: { item: string }[];
  sources?: { label: string; url: string }[];
  faqs?: { question: string; answer: string }[];
  seo?: Record<string, string>;
  order?: number;
  relatedCategorySlugs?: string[];
  relatedServiceSlugs?: string[];
}

const guides = JSON.parse(fs.readFileSync(file, "utf8")) as GuideSeed[];
const update = process.argv.includes("update");
const payload = await getPayload({ config });

const idsFor = async (collection: "product-categories" | "services", slugs: string[] = []) => {
  const ids: number[] = [];
  for (const slug of slugs) {
    const r = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 });
    if (r.docs[0]) ids.push(r.docs[0].id as number);
    else console.warn(`  ! ${collection}/${slug} not found — link skipped`);
  }
  return ids;
};

let created = 0;
let updated = 0;
let kept = 0;
for (const g of guides) {
  const found = await payload.find({ collection: "guides", where: { slug: { equals: g.slug } }, limit: 1, depth: 0 });
  const existing = found.docs[0];
  if (existing && !update) {
    kept++;
    console.log(`= ${g.slug} already exists — left alone (add "update" to overwrite)`);
    continue;
  }
  const data = {
    slug: g.slug,
    title: g.title,
    icon: g.icon ?? "Lightbulb",
    summary: g.summary,
    ...(g.readingMinutes ? { readingMinutes: g.readingMinutes } : {}),
    ...(g.answer ? { answer: g.answer } : {}),
    sections: g.sections,
    takeaways: g.takeaways ?? [],
    sources: g.sources ?? [],
    faqs: g.faqs ?? [],
    ...(g.seo ? { seo: g.seo } : {}),
    relatedCategories: await idsFor("product-categories", g.relatedCategorySlugs),
    relatedServices: await idsFor("services", g.relatedServiceSlugs),
    published: true,
    order: g.order ?? 100,
  };
  if (existing) {
    await payload.update({ collection: "guides", id: existing.id, data: data as never, context: { disableRevalidate: true } });
    updated++;
    console.log(`~ updated ${g.slug}`);
  } else {
    await payload.create({ collection: "guides", data: data as never, context: { disableRevalidate: true } });
    created++;
    console.log(`+ created ${g.slug}`);
  }
}
console.log(`\n${created} created, ${updated} updated, ${kept} left alone.`);
process.exit(0);
