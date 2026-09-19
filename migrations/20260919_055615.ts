import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" ADD COLUMN "seo_heading" varchar;
  ALTER TABLE "product_categories" ADD COLUMN "seo_heading" varchar;
  ALTER TABLE "products" ADD COLUMN "seo_heading" varchar;
  ALTER TABLE "factories" ADD COLUMN "seo_heading" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" DROP COLUMN "seo_heading";
  ALTER TABLE "product_categories" DROP COLUMN "seo_heading";
  ALTER TABLE "products" DROP COLUMN "seo_heading";
  ALTER TABLE "factories" DROP COLUMN "seo_heading";`)
}
