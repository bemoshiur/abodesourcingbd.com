/**
 * Create (or reset) the CMS admin login.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='…' npm run admin:create
 *
 * Credentials come from the environment at run time — nothing is stored in the
 * repo. If the email already exists its password is reset to the given value.
 */
for (const f of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(f);
  } catch {
    // file missing — fine
  }
}

import { getPayload } from "payload";

// Imported after the env files are loaded (static imports are hoisted above them).
const { default: config } = await import("../src/payload/payload.config.ts");

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment.");
  }
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");

  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  });

  if (existing.docs.length > 0) {
    await payload.update({
      collection: "users",
      id: existing.docs[0].id,
      data: { password, name: existing.docs[0].name ?? "Site admin" },
    });
    console.log(`Reset password for ${email}`);
  } else {
    await payload.create({
      collection: "users",
      data: { email, password, name: "Site admin" },
    });
    console.log(`Created admin ${email}`);
  }
  process.exit(0);
}

// Top-level await: `payload run` only waits for the module to finish loading.
try {
  await main();
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
