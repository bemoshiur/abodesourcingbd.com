/**
 * Applies the "network & credentials" content to an existing database without
 * touching anything an editor may have changed since launch:
 *
 *   - factories: sets country / location / order on the existing units, creates the
 *     Indian partner factories, attaches any logo that is still missing
 *   - certifications: adds the missing marks (SA 8000:2014, Fairtrade, RCS) and attaches
 *     the official logo to every mark that has none (existing wording is kept)
 *   - memberships: BGBA and the Department of Textiles, with their logos
 *   - page copy: only the Factories and Compliance page blocks in scripts/data/seo-content.json
 *
 *   npm run seed:network
 *
 * Logos live in scripts/data/logos/ (cert-<slug>.png, membership-<slug>.png; factory logos in
 * public/factories/). A missing file is reported, never faked — the site falls back to a text badge.
 * Requires DATABASE_URL, PAYLOAD_SECRET and BLOB_READ_WRITE_TOKEN in .env.local.
 */
import fs from "node:fs";
import path from "node:path";

for (const f of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(f);
  } catch {
    // file missing — fine
  }
}

import { getPayload } from "payload";

const { default: config } = await import("../src/payload/payload.config.ts");
import { factories } from "../src/content/factories.ts";
import { certifications, memberships } from "../src/content/site.ts";

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;

const ROOT = process.cwd();
const LOGO_DIR = path.join(ROOT, "scripts", "data", "logos");
// A fresh context per call — a shared object makes the storage plugin skip every upload after the first.
const ctx = () => ({ disableRevalidate: true });
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const missing: string[] = [];

async function ensureMedia(payload: PayloadClient, file: string, filename: string, alt: string): Promise<number | undefined> {
  if (!fs.existsSync(file)) return undefined;
  const stem = filename.replace(/\.[a-z]+$/i, "");
  // Payload rewrites the extension (WebP conversion), so match on the stem.
  const existing = await payload_findMedia(payload, stem);
  if (existing) return existing;
  const buffer = fs.readFileSync(file);
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    file: { data: buffer, mimetype: "image/png", name: filename, size: buffer.length },
    context: ctx(),
  });
  console.log(`  uploaded ${filename} (${Math.round(buffer.length / 1024)} KB)`);
  return doc.id;
}

async function payload_findMedia(payload: PayloadClient, stem: string): Promise<number | undefined> {
  const r = await payload.find({ collection: "media", where: { filename: { like: `${stem}.` } }, limit: 5, depth: 0 });
  return r.docs.find((d) => d.filename?.replace(/\.[a-z]+$/i, "") === stem)?.id;
}

const idOf = (v: unknown): number | undefined =>
  typeof v === "number" ? v : v && typeof v === "object" && "id" in v ? (v as { id: number }).id : undefined;

async function seedFactories(payload: PayloadClient) {
  console.log("\n[factories]");
  const cats = await payload.find({ collection: "product-categories", limit: 50, depth: 0 });
  const catId = (slug: string) => {
    const c = cats.docs.find((d) => d.slug === slug);
    if (!c) throw new Error(`Unknown category slug: ${slug}`);
    return c.id;
  };

  for (const f of factories) {
    const found = await payload.find({ collection: "factories", where: { slug: { equals: f.slug } }, limit: 1, depth: 0 });
    const doc = found.docs[0];
    const logoFile = f.logo ? path.join(ROOT, "public", f.logo) : undefined;
    if (f.logo && logoFile && !fs.existsSync(logoFile)) missing.push(`factory logo ${f.slug}`);
    const logoId = logoFile ? await ensureMedia(payload, logoFile, path.basename(f.logo!), `${f.name} logo`) : undefined;

    if (!doc) {
      await payload.create({
        collection: "factories",
        data: {
          slug: f.slug,
          name: f.name,
          country: f.country,
          ...(f.location ? { location: f.location } : {}),
          order: f.order,
          specialty: f.specialty,
          productTypes: f.productTypes.map((item) => ({ item })),
          categories: f.categories.map(catId),
          website: f.website,
          ...(logoId ? { logo: logoId } : {}),
          intro: f.intro,
        },
        context: ctx(),
      });
      console.log(`  created ${f.slug} (${f.country})`);
      continue;
    }
    // Existing unit: only the new fields, plus a logo when it has none.
    await payload.update({
      collection: "factories",
      id: doc.id,
      data: {
        country: f.country,
        order: f.order,
        ...(f.location && !doc.location ? { location: f.location } : {}),
        ...(logoId && !idOf(doc.logo) ? { logo: logoId } : {}),
      },
      context: ctx(),
    });
    console.log(`  updated ${f.slug} (${f.country}${logoId && !idOf(doc.logo) ? ", logo attached" : ""})`);
  }
}

async function seedCertifications(payload: PayloadClient) {
  console.log("\n[certifications]");
  const g = await payload.findGlobal({ slug: "site-content", depth: 0 });
  const have = new Map((g.certifications ?? []).map((c) => [c.name, c]));
  const rows = [];
  for (const c of certifications) {
    const cur = have.get(c.name);
    const slug = slugify(c.name);
    let logo = idOf(cur?.logo);
    if (!logo) {
      logo = await ensureMedia(payload, path.join(LOGO_DIR, `cert-${slug}.png`), `cert-${slug}.png`, `${c.name} logo`);
      if (!logo) missing.push(`certification logo ${c.name}`);
    }
    rows.push({ name: c.name, full: cur?.full ?? c.full, ...(logo ? { logo } : {}) });
  }
  // Marks an editor added in the CMS that are not in the seed list stay at the end.
  for (const [name, cur] of have) {
    if (!certifications.some((c) => c.name === name)) rows.push({ name, full: cur.full, ...(idOf(cur.logo) ? { logo: idOf(cur.logo) } : {}) });
  }
  await payload.updateGlobal({ slug: "site-content", data: { certifications: rows }, context: ctx() });
  console.log(`  ${rows.length} certifications, ${rows.filter((r) => r.logo).length} with logo`);
}

async function seedMemberships(payload: PayloadClient) {
  console.log("\n[memberships]");
  const g = await payload.findGlobal({ slug: "site-content", depth: 0 });
  const have = new Map((g.memberships ?? []).map((m) => [m.name, m]));
  const rows = [];
  for (const m of memberships) {
    const cur = have.get(m.name);
    const slug = slugify(m.name);
    let logo = idOf(cur?.logo);
    if (!logo) {
      logo = await ensureMedia(payload, path.join(LOGO_DIR, `membership-${slug}.png`), `membership-${slug}.png`, `${m.fullName} logo`);
      if (!logo) missing.push(`membership logo ${m.name}`);
    }
    rows.push({
      name: m.name,
      fullName: cur?.fullName ?? m.fullName,
      relation: cur?.relation ?? m.relation,
      idLabel: cur?.idLabel ?? ("idLabel" in m ? m.idLabel : undefined),
      idValue: cur?.idValue ?? ("idValue" in m ? m.idValue : undefined),
      url: cur?.url ?? m.url,
      ...(logo ? { logo } : {}),
    });
  }
  await payload.updateGlobal({ slug: "site-content", data: { memberships: rows }, context: ctx() });
  console.log(`  ${rows.length} memberships, ${rows.filter((r) => r.logo).length} with logo`);
}

async function seedPages(payload: PayloadClient) {
  console.log("\n[pages]");
  const file = path.join(ROOT, "scripts", "data", "seo-content.json");
  const seo = JSON.parse(fs.readFileSync(file, "utf8")) as { pages?: Record<string, Record<string, unknown>> };
  const current = (await payload.findGlobal({ slug: "page-content", depth: 0 })) as unknown as Record<string, Record<string, unknown>>;
  const data: Record<string, unknown> = {};
  for (const key of ["factories", "compliance"]) {
    const next = seo.pages?.[key];
    if (!next) continue;
    data[key] = { ...(current[key] ?? {}), ...next };
    console.log(`  page-content.${key}`);
  }
  if (Object.keys(data).length) await payload.updateGlobal({ slug: "page-content", data: data as never, context: ctx() });
}

const payload = await getPayload({ config });
try {
  await seedFactories(payload);
  await seedCertifications(payload);
  await seedMemberships(payload);
  await seedPages(payload);
  console.log("\nNetwork seed complete.");
  if (missing.length) {
    console.log("\nMissing logos (text badge used instead):");
    missing.forEach((m) => console.log("  -", m));
  }
  process.exit(0);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
