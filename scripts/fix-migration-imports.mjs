// Payload's generated migrations import types as values, which plain Node ESM
// rejects. Rewrite them to `import type` so `payload migrate` runs everywhere
// (local, CI, Vercel build). Safe to run repeatedly.
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("migrations");
for (const f of fs.readdirSync(dir).filter((x) => /^\d.*\.ts$/.test(x))) {
  const file = path.join(dir, f);
  const src = fs.readFileSync(file, "utf8");
  const fixed = src.replace(
    /import \{\s*(MigrateUpArgs,\s*MigrateDownArgs,\s*sql)\s*\} from '@payloadcms\/db-postgres'/,
    "import { sql } from '@payloadcms/db-postgres'\nimport type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'",
  );
  if (fixed !== src) {
    fs.writeFileSync(file, fixed);
    console.log("fixed imports in", f);
  }
}
