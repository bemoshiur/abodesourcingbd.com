import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_content_license" AS ENUM('none', 'CC-BY-4.0');
  ALTER TABLE "services" ADD COLUMN "answer" varchar;
  ALTER TABLE "product_categories" ADD COLUMN "answer" varchar;
  ALTER TABLE "factories" ADD COLUMN "answer" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "content_license" "enum_site_settings_content_license" DEFAULT 'none';
  ALTER TABLE "page_content" ADD COLUMN "home_answer" varchar;
  ALTER TABLE "page_content" ADD COLUMN "about_answer" varchar;
  ALTER TABLE "page_content" ADD COLUMN "services_answer" varchar;
  ALTER TABLE "page_content" ADD COLUMN "products_answer" varchar;
  ALTER TABLE "page_content" ADD COLUMN "factories_answer" varchar;
  ALTER TABLE "page_content" ADD COLUMN "compliance_answer" varchar;
  ALTER TABLE "page_content" ADD COLUMN "contact_answer" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" DROP COLUMN "answer";
  ALTER TABLE "product_categories" DROP COLUMN "answer";
  ALTER TABLE "factories" DROP COLUMN "answer";
  ALTER TABLE "site_settings" DROP COLUMN "content_license";
  ALTER TABLE "page_content" DROP COLUMN "home_answer";
  ALTER TABLE "page_content" DROP COLUMN "about_answer";
  ALTER TABLE "page_content" DROP COLUMN "services_answer";
  ALTER TABLE "page_content" DROP COLUMN "products_answer";
  ALTER TABLE "page_content" DROP COLUMN "factories_answer";
  ALTER TABLE "page_content" DROP COLUMN "compliance_answer";
  ALTER TABLE "page_content" DROP COLUMN "contact_answer";
  DROP TYPE "public"."enum_site_settings_content_license";`)
}
