/**
 * Seed script — imports the original file-based content (src/content/*) into
 * Payload CMS. Idempotent: existing docs (matched by slug / filename) are
 * skipped, so it is safe to re-run.
 *
 * Usage: npm run seed   (requires DATABASE_URL, PAYLOAD_SECRET and, for
 * uploads to Vercel Blob, BLOB_READ_WRITE_TOKEN in .env.local)
 */
import fs from "node:fs";
import path from "node:path";

// Load .env.local / .env before touching Payload.
for (const f of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(f);
  } catch {
    // file missing — fine
  }
}

import { getPayload } from "payload";
import config from "../src/payload/payload.config";

import { services } from "../src/content/services";
import { products, productShots } from "../src/content/products";
import { factories } from "../src/content/factories";
import { buyers } from "../src/content/buyers";
import {
  site,
  mission,
  vision,
  whyChooseUs,
  exportMarkets,
  certifications,
  qcSteps,
  productionFlow,
} from "../src/content/site";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;

/** Upload a file from /public into Media, or return the existing doc. */
async function ensureMedia(payload: PayloadClient, publicPath: string, alt: string) {
  const filename = path.basename(publicPath);
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs.length > 0) return existing.docs[0].id;

  const abs = path.join(PUBLIC_DIR, publicPath);
  const buffer = fs.readFileSync(abs);
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data: buffer,
      mimetype: MIME[path.extname(filename).toLowerCase()] ?? "application/octet-stream",
      name: filename,
      size: buffer.length,
    },
  });
  console.log(`  uploaded ${filename}`);
  return doc.id;
}

async function main() {
  const payload = await getPayload({ config });
  console.log("Seeding…");

  // 1. Product categories (referenced by everything else)
  const categoryIds = new Map<string, number>();
  for (const c of products) {
    const existing = await payload.find({
      collection: "product-categories",
      where: { slug: { equals: c.slug } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs.length > 0) {
      categoryIds.set(c.slug, existing.docs[0].id);
      continue;
    }
    const doc = await payload.create({
      collection: "product-categories",
      data: {
        slug: c.slug,
        title: c.title,
        icon: c.icon,
        summary: c.summary,
        intro: c.intro,
        subItems: c.subItems.map((item) => ({ item })),
      },
    });
    categoryIds.set(c.slug, doc.id);
    console.log(`  category ${c.slug}`);
  }
  const catId = (slug: string) => {
    const id = categoryIds.get(slug);
    if (!id) throw new Error(`Unknown category slug in seed data: ${slug}`);
    return id;
  };

  // 2. Buyers
  const buyerIds = new Map<string, number>();
  for (const b of buyers) {
    const existing = await payload.find({
      collection: "buyers",
      where: { slug: { equals: b.slug } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs.length > 0) {
      buyerIds.set(b.slug, existing.docs[0].id);
      continue;
    }
    const logoId = b.logo ? await ensureMedia(payload, b.logo, `${b.name} logo`) : undefined;
    const doc = await payload.create({
      collection: "buyers",
      data: {
        name: b.name,
        slug: b.slug,
        country: b.country,
        note: b.note,
        categories: b.categories.map(catId),
        ...(logoId ? { logo: logoId } : {}),
      },
    });
    buyerIds.set(b.slug, doc.id);
    console.log(`  buyer ${b.slug}`);
  }

  // 3. Factories
  for (const f of factories) {
    const existing = await payload.find({
      collection: "factories",
      where: { slug: { equals: f.slug } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs.length > 0) continue;
    const logoId = f.logo ? await ensureMedia(payload, f.logo, `${f.name} logo`) : undefined;
    await payload.create({
      collection: "factories",
      data: {
        slug: f.slug,
        name: f.name,
        specialty: f.specialty,
        productTypes: f.productTypes.map((item) => ({ item })),
        categories: f.categories.map(catId),
        website: f.website,
        ...(logoId ? { logo: logoId } : {}),
        intro: f.intro,
      },
    });
    console.log(`  factory ${f.slug}`);
  }

  // 4. Services
  for (const s of services) {
    const existing = await payload.find({
      collection: "services",
      where: { slug: { equals: s.slug } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs.length > 0) continue;
    await payload.create({
      collection: "services",
      data: {
        slug: s.slug,
        title: s.title,
        icon: s.icon,
        summary: s.summary,
        intro: s.intro,
        covers: s.covers.map((item) => ({ item })),
        how: s.how.map((item) => ({ item })),
        relatedCategories: s.relatedCategories.map(catId),
      },
    });
    console.log(`  service ${s.slug}`);
  }

  // 5. Product shots (image per shot)
  for (const shot of productShots) {
    const filename = path.basename(shot.src);
    const existingMedia = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    });
    const mediaId =
      existingMedia.docs.length > 0
        ? existingMedia.docs[0].id
        : await ensureMedia(payload, shot.src, shot.alt);

    const duplicate = await payload.find({
      collection: "product-shots",
      where: { image: { equals: mediaId } },
      limit: 1,
      depth: 0,
    });
    if (duplicate.docs.length > 0) continue;

    await payload.create({
      collection: "product-shots",
      data: {
        image: mediaId,
        brandName: shot.brandName,
        brand: buyerIds.get(shot.brandSlug),
        category: catId(shot.category),
        alt: shot.alt,
        featured: Boolean(shot.featured),
      },
    });
    console.log(`  shot ${filename}`);
  }

  // 6. Globals
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      name: site.name,
      tagline: site.tagline,
      oneLiner: site.oneLiner,
      domain: site.domain,
      url: site.url,
      address: {
        line1: site.address.line1,
        line2: site.address.line2,
        city: site.address.city,
        country: site.address.country,
        geo: { lat: site.address.geo.lat, lng: site.address.geo.lng },
      },
      phones: site.phones.map((number) => ({ number })),
      emails: site.emails.map((address) => ({ address })),
      payment: site.payment,
      mission,
      vision,
    },
  });
  console.log("  global site-settings");

  await payload.updateGlobal({
    slug: "site-content",
    data: {
      whyChooseUs: whyChooseUs.map((i) => ({ title: i.title, icon: i.icon })),
      exportMarkets: exportMarkets.map((m) => ({ name: m.name, code: m.code })),
      certifications: certifications.map((c) => ({ name: c.name, full: c.full })),
      qcSteps: qcSteps.map((s) => ({ step: s.step, detail: s.detail })),
      productionFlow: productionFlow.map((stage) => ({ stage })),
    },
  });
  console.log("  global site-content");

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
