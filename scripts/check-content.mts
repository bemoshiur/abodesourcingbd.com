/**
 * Content guard — fails loudly (exit 1) if anything published in the CMS breaks the
 * site's hard rules:
 *   1. no client / buyer brand names, anywhere (copy, alt text, filenames)
 *   2. no owner or staff personal names
 *   3. no phone numbers, and no email other than the single public inbox
 *
 * Runs as part of `npm run build`, so a violation blocks the deploy instead of going live.
 *   npm run check:content
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

const PUBLIC_EMAIL = "info@abodesourcingbd.com";

/** [label, regex] — kept specific to avoid false positives on ordinary words. */
const RULES: [string, RegExp][] = [
  ["buyer/brand name", /\b(tri[\s-]?dri|asquith|alligo|stadium[\s-]outlet|swedemount|x-?trail|nimbus|ny[\s-]form|ralateam|ralawise|sprayway|ronhill|l-?shop(?:team)?|sebago|le[\s-]don[\s-]de[\s-]vie|lddv|ryds|appear\s*\/\s*json)\b/i],
  ["owner/staff name", /\b(afzalur|shakhawat|taluckder|md\.?\s+shakhawat)\b/i],
  ["phone number", /(\+\s?880[\s\d-]{8,}|\btel:|\b01[3-9]\d{8}\b|\+\d{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4})/],
];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

const payload = await getPayload({ config });
const hits: string[] = [];

function scan(where: string, value: unknown) {
  const text = JSON.stringify(value);
  for (const [label, re] of RULES) {
    const m = text.match(re);
    if (m) hits.push(`${where}: ${label} "${m[0]}"`);
  }
  for (const email of text.match(EMAIL) ?? []) {
    if (email.toLowerCase() !== PUBLIC_EMAIL) hits.push(`${where}: email "${email}" (only ${PUBLIC_EMAIL} may be public)`);
  }
}

// Only the fields that can reach the public site (not internal ids/timestamps/auth data).
const collections = ["services", "product-categories", "products", "factories", "media"] as const;
for (const slug of collections) {
  const { docs } = await payload.find({ collection: slug, limit: 2000, depth: 0, pagination: false });
  for (const d of docs as unknown as Record<string, unknown>[]) {
    const { id, createdAt, updatedAt, ...rest } = d;
    void id; void createdAt; void updatedAt;
    scan(`${slug}/${String(d.slug ?? d.filename ?? d.id)}`, rest);
  }
}
for (const slug of ["site-settings", "site-content", "page-content"] as const) {
  const g = await payload.findGlobal({ slug, depth: 0 });
  scan(`global/${slug}`, g);
}

if (hits.length) {
  console.error(`\n✗ Content guard failed — ${hits.length} problem(s):\n`);
  hits.forEach((h) => console.error("  - " + h));
  console.error("\nFix these in the CMS (or the seed data) and rebuild.\n");
  process.exit(1);
}
console.log("✓ Content guard passed — no buyer names, personal names, phone numbers or extra emails in published content.");
process.exit(0);
