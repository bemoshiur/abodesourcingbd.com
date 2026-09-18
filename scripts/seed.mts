/**
 * Seed script — loads content into Payload CMS. Idempotent: documents are matched
 * by slug / filename / style number and skipped (or updated where noted), so it
 * is safe to re-run.
 *
 *   npm run seed              # everything
 *   npm run seed -- base      # categories, services, factories, site settings, certifications
 *   npm run seed -- products  # products + photos from Website_images/ (needs scripts/data/catalog.json)
 *   npm run seed -- seo       # page titles/descriptions/FAQs (needs .work/research/seo-content.json)
 *
 * Requires DATABASE_URL, PAYLOAD_SECRET and BLOB_READ_WRITE_TOKEN in .env.local.
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

import sharp from "sharp";
import { getPayload } from "payload";

// Imported after the env files are loaded (static imports are hoisted above them).
const { default: config } = await import("../src/payload/payload.config.ts");

import { services } from "../src/content/services.ts";
import { products as categories } from "../src/content/products.ts";
import { factories } from "../src/content/factories.ts";
import {
  site,
  mission,
  vision,
  whyChooseUs,
  exportMarkets,
  certifications,
  qcSteps,
  productionFlow,
} from "../src/content/site.ts";

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const IMAGES_DIR = path.join(ROOT, "Website_images");
const WORK_DIR = path.join(ROOT, ".work", "research");
const CTX = { disableRevalidate: true };

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

/** Upload an image buffer into Media (matched by filename), returning its id. */
async function ensureMedia(
  payload: PayloadClient,
  filename: string,
  buffer: Buffer,
  mimetype: string,
  alt: string,
): Promise<number> {
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs.length > 0) return existing.docs[0].id;
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    file: { data: buffer, mimetype, name: filename, size: buffer.length },
    context: CTX,
  });
  console.log(`  uploaded ${filename} (${Math.round(buffer.length / 1024)} KB)`);
  return doc.id;
}

/** Upload a file that lives under /public (factory logos etc.) as-is. */
async function ensurePublicMedia(payload: PayloadClient, publicPath: string, alt: string) {
  const buffer = fs.readFileSync(path.join(PUBLIC_DIR, publicPath));
  const ext = path.extname(publicPath).toLowerCase();
  return ensureMedia(payload, path.basename(publicPath), buffer, MIME[ext] ?? "application/octet-stream", alt);
}

/**
 * Optimise a raw source photo (up to 8 MB PNG) before upload: auto-rotate,
 * limit to 2000px on the long side, encode as WebP. Payload then derives the
 * card/thumb variants from this.
 */
export async function optimiseImage(file: string): Promise<Buffer> {
  return sharp(file)
    .rotate()
    // A few source PNGs have a transparent background — flatten onto white so every
    // product tile matches (transparent WebP would show the card colour through).
    .flatten({ background: "#ffffff" })
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer();
}

async function findBySlug(payload: PayloadClient, collection: "product-categories" | "factories" | "services", slug: string) {
  const r = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  return r.docs[0];
}

// ---------------------------------------------------------------------------
// base: categories, factories, services, globals
// ---------------------------------------------------------------------------
async function seedBase(payload: PayloadClient) {
  console.log("\n[base] categories");
  const categoryIds = new Map<string, number>();
  for (const [i, c] of categories.entries()) {
    let doc = await findBySlug(payload, "product-categories", c.slug);
    if (!doc) {
      doc = await payload.create({
        collection: "product-categories",
        data: {
          slug: c.slug,
          title: c.title,
          icon: c.icon,
          summary: c.summary,
          intro: c.intro,
          subItems: c.subItems.map((item) => ({ item })),
          order: (i + 1) * 10,
        },
        context: CTX,
      });
      console.log(`  category ${c.slug}`);
    }
    categoryIds.set(c.slug, doc.id);
  }
  const catId = (slug: string) => {
    const id = categoryIds.get(slug);
    if (!id) throw new Error(`Unknown category slug in seed data: ${slug}`);
    return id;
  };

  console.log("[base] factories");
  for (const f of factories) {
    if (await findBySlug(payload, "factories", f.slug)) continue;
    const logoId = f.logo ? await ensurePublicMedia(payload, f.logo, `${f.name} logo`) : undefined;
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
      context: CTX,
    });
    console.log(`  factory ${f.slug}`);
  }

  console.log("[base] services");
  for (const s of services) {
    if (await findBySlug(payload, "services", s.slug)) continue;
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
      context: CTX,
    });
    console.log(`  service ${s.slug}`);
  }

  console.log("[base] globals");
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
      emails: site.emails.map((address) => ({ address })),
      payment: site.payment,
      mission,
      vision,
    },
    context: CTX,
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
    context: CTX,
  });
  console.log("  global site-content");
}

// ---------------------------------------------------------------------------
// products: from scripts/data/catalog.json + Website_images/
// ---------------------------------------------------------------------------
interface CatalogProduct {
  category: string;
  styleNumber: string | null;
  name: string | null;
  composition: string | null;
  gsm: string | null;
  fabricConstruction: string | null;
  description: string | null;
  summary?: string | null;
  otherSpecs?: Record<string, string> | null;
  featured?: boolean;
  exclude?: boolean;
  images: { file: string; role?: string; alt?: string | null }[];
}

async function seedProducts(payload: PayloadClient) {
  const catalogPath = path.join(ROOT, "scripts", "data", "catalog.json");
  if (!fs.existsSync(catalogPath)) {
    console.log("\n[products] scripts/data/catalog.json not found — skipping");
    return;
  }
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8")) as CatalogProduct[];
  console.log(`\n[products] ${catalog.length} products`);

  const catIds = new Map<string, number>();
  for (const c of categories) {
    const doc = await findBySlug(payload, "product-categories", c.slug);
    if (doc) catIds.set(c.slug, doc.id);
  }

  let order = 10;
  for (const p of catalog) {
    if (p.exclude) continue;
    order += 10;
    const catId = catIds.get(p.category);
    if (!catId) throw new Error(`Unknown category "${p.category}" for style ${p.styleNumber}`);
    const name = p.name ?? `${p.category} style ${p.styleNumber}`;

    const existing = p.styleNumber
      ? await payload.find({
          collection: "products",
          where: { and: [{ styleNumber: { equals: p.styleNumber } }, { category: { equals: catId } }] },
          limit: 1,
          depth: 0,
        })
      : { docs: [] };
    if (existing.docs.length > 0) continue;

    const images: { image: number; view: "front" | "back" | "side" | "detail" | "other" }[] = [];
    for (const [i, img] of p.images.entries()) {
      const abs = path.join(IMAGES_DIR, img.file);
      if (!fs.existsSync(abs)) {
        console.warn(`  ! missing image ${img.file}`);
        continue;
      }
      const styleSlug = (p.styleNumber ?? "style").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const filename = `${p.category}-${styleSlug}${i > 0 ? `-${i + 1}` : ""}.webp`;
      const alt =
        img.alt || `${name}${p.styleNumber ? ` (style ${p.styleNumber})` : ""} — ${img.role ?? (i === 0 ? "front" : "view")} view`;
      const mediaId = await ensureMedia(payload, filename, await optimiseImage(abs), "image/webp", alt);
      const view = (["front", "back", "side", "detail"].includes(img.role ?? "") ? img.role : "other") as
        | "front" | "back" | "side" | "detail" | "other";
      images.push({ image: mediaId, view });
    }
    if (images.length === 0) {
      console.warn(`  ! no usable images for ${name} — skipped`);
      continue;
    }

    await payload.create({
      collection: "products",
      data: {
        name,
        styleNumber: p.styleNumber ?? undefined,
        category: catId,
        summary: p.summary ?? undefined,
        description: p.description ?? undefined,
        composition: p.composition ?? undefined,
        gsm: p.gsm ?? undefined,
        fabricConstruction: p.fabricConstruction ?? undefined,
        specs: Object.entries(p.otherSpecs ?? {}).map(([label, value]) => ({ label, value })),
        images,
        featured: Boolean(p.featured),
        published: true,
        order,
      },
      context: CTX,
    });
    console.log(`  product ${p.styleNumber ?? name}`);
  }
}

// ---------------------------------------------------------------------------
// images: showroom photo etc.
// ---------------------------------------------------------------------------
async function seedImagery(payload: PayloadClient) {
  const officeSrc = path.join(IMAGES_DIR, "D2C1119D-E5A5-44FD-BDDD-9B20CA505683.jpg");
  if (!fs.existsSync(officeSrc)) {
    console.log("\n[imagery] showroom photo not found — skipping");
    return;
  }
  console.log("\n[imagery] showroom photo");
  const id = await ensureMedia(
    payload,
    "abd-sourcing-showroom-uttara-dhaka.webp",
    await optimiseImage(officeSrc),
    "image/webp",
    "ABD Sourcing Bangladesh showroom in Uttara, Dhaka — garment samples on display racks",
  );
  await payload.updateGlobal({ slug: "site-settings", data: { officeImage: id }, context: CTX });
  console.log("  linked to site-settings.officeImage");
}

// ---------------------------------------------------------------------------
// seo: page-level titles / descriptions / FAQs + per-document SEO/FAQs
// ---------------------------------------------------------------------------
async function seedSeo(payload: PayloadClient) {
  const file = path.join(WORK_DIR, "seo-content.json");
  if (!fs.existsSync(file)) {
    console.log("\n[seo] seo-content.json not found — skipping");
    return;
  }
  const c = JSON.parse(fs.readFileSync(file, "utf8")) as {
    pages?: Record<string, unknown>;
    categories?: Record<string, { seo?: unknown; faqs?: unknown }>;
    services?: Record<string, { seo?: unknown; faqs?: unknown }>;
    factories?: Record<string, { seo?: unknown; faqs?: unknown }>;
    site?: { keywords?: string[]; sameAs?: string[]; foundingYear?: number };
  };
  console.log("\n[seo] applying");
  if (c.pages) {
    await payload.updateGlobal({ slug: "page-content", data: c.pages as never, context: CTX });
    console.log("  global page-content");
  }
  if (c.site) {
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        ...(c.site.keywords ? { keywords: c.site.keywords.map((keyword) => ({ keyword })) } : {}),
        ...(c.site.sameAs ? { sameAs: c.site.sameAs.map((url) => ({ url })) } : {}),
        ...(c.site.foundingYear ? { foundingYear: c.site.foundingYear } : {}),
      },
      context: CTX,
    });
    console.log("  site-settings keywords/profiles");
  }
  const apply = async (
    collection: "product-categories" | "services" | "factories",
    map: Record<string, { seo?: unknown; faqs?: unknown }> | undefined,
  ) => {
    for (const [slug, v] of Object.entries(map ?? {})) {
      const doc = await findBySlug(payload, collection, slug);
      if (!doc) {
        console.warn(`  ! ${collection}/${slug} not found`);
        continue;
      }
      await payload.update({
        collection,
        id: doc.id,
        data: { ...(v.seo ? { seo: v.seo } : {}), ...(v.faqs ? { faqs: v.faqs } : {}) } as never,
        context: CTX,
      });
      console.log(`  ${collection}/${slug}`);
    }
  };
  await apply("product-categories", c.categories);
  await apply("services", c.services);
  await apply("factories", c.factories);
}

async function main() {
  const only = process.argv[2];
  const payload = await getPayload({ config });
  console.log("Seeding…");
  if (!only || only === "base") await seedBase(payload);
  if (!only || only === "products") await seedProducts(payload);
  if (!only || only === "imagery") await seedImagery(payload);
  if (!only || only === "seo") await seedSeo(payload);
  console.log("\nSeed complete.");
  process.exit(0);
}

// Top-level await: `payload run` only waits for the module to finish loading.
try {
  await main();
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
