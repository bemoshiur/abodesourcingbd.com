/**
 * Re-upload any Media files that exist in the database but are missing from
 * Blob storage (and verify every upload afterwards).
 *
 *   npm run media:repair              # repair everything that is missing
 *   npm run media:repair -- <substr>  # only media whose filename contains <substr>
 *
 * Product photos are rebuilt from Website_images/ via scripts/data/catalog.json;
 * factory logos from public/factories/, certification and membership logos from scripts/data/logos/.
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

import sharp from "sharp";
import { list } from "@vercel/blob";
import { getPayload } from "payload";

const { default: config } = await import("../src/payload/payload.config.ts");

const ROOT = process.cwd();
const only = process.argv[2];
const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not set");

async function blobKeys(): Promise<Set<string>> {
  const keys = new Set<string>();
  let cursor: string | undefined;
  do {
    const r = await list({ token, cursor, limit: 1000 });
    r.blobs.forEach((b) => keys.add(b.pathname));
    cursor = r.cursor;
  } while (cursor);
  return keys;
}

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/data/catalog.json"), "utf8")) as {
  category: string;
  styleNumber: string;
  images: { file: string }[];
}[];

/** filename in the DB → original source file on disk + how to prepare it. */
function sourceFor(filename: string): { file: string; optimise: boolean; mime: string } | null {
  const stem = filename.replace(/\.[a-z]+$/i, "");
  const p = catalog.find((c) => `${c.category}-${c.styleNumber.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` === stem);
  if (p) return { file: path.join(ROOT, "Website_images", p.images[0].file), optimise: true, mime: "image/webp" };
  if (stem === "abd-sourcing-showroom-uttara-dhaka")
    return { file: path.join(ROOT, "Website_images", "D2C1119D-E5A5-44FD-BDDD-9B20CA505683.jpg"), optimise: true, mime: "image/webp" };
  for (const dir of [path.join(ROOT, "public", "factories"), path.join(ROOT, "scripts", "data", "logos")]) {
    for (const ext of [".png", ".jpg", ".jpeg", ".webp"]) {
      const f = path.join(dir, stem + ext);
      if (fs.existsSync(f)) return { file: f, optimise: false, mime: ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg" };
    }
  }
  return null;
}

async function prepare(src: { file: string; optimise: boolean }): Promise<Buffer> {
  if (!src.optimise) return fs.readFileSync(src.file);
  return sharp(src.file)
    .rotate()
    .flatten({ background: "#ffffff" })
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer();
}

const payload = await getPayload({ config });
const docs = (await payload.find({ collection: "media", limit: 1000, depth: 0, pagination: false })).docs;
let keys = await blobKeys();
console.log(`Blob objects: ${keys.size} · media docs: ${docs.length}`);

const expected = (d: (typeof docs)[number]) =>
  [d.filename, d.sizes?.thumb?.filename, d.sizes?.card?.filename, d.sizes?.detail?.filename].filter(Boolean) as string[];

const broken = docs.filter((d) => d.filename && (!only || d.filename.includes(only)) && expected(d).some((f) => !keys.has(f)));
console.log(`Docs needing repair: ${broken.length}`);

let fixed = 0;
const failed: string[] = [];
for (const d of broken) {
  const src = sourceFor(d.filename!);
  if (!src || !fs.existsSync(src.file)) {
    failed.push(`${d.filename} (no source file)`);
    continue;
  }
  try {
    const data = await prepare(src);
    await payload.update({
      collection: "media",
      id: d.id,
      data: { alt: d.alt },
      file: { data, mimetype: src.mime, name: d.filename!, size: data.length },
      overwriteExistingFiles: true,
      context: { disableRevalidate: true },
    });
    // verify — do not trust that "no error" means "uploaded"
    keys = await blobKeys();
    const after = await payload.findByID({ collection: "media", id: d.id, depth: 0 });
    const still = expected(after).filter((f) => !keys.has(f));
    if (still.length) failed.push(`${d.filename} → still missing: ${still.join(", ")}`);
    else {
      fixed++;
      console.log(`  ok ${d.filename}`);
    }
  } catch (err) {
    failed.push(`${d.filename}: ${err instanceof Error ? err.message : String(err)}`);
  }
}
console.log(`\nRepaired: ${fixed} · Failed: ${failed.length}`);
failed.forEach((f) => console.log("  ✗", f));
process.exit(failed.length ? 1 : 0);
