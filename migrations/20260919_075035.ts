import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_factories_country" AS ENUM('bangladesh', 'india');
  CREATE TYPE "public"."enum_site_content_memberships_relation" AS ENUM('member', 'registered', 'none');
  CREATE TABLE "site_content_memberships" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"full_name" varchar NOT NULL,
  	"relation" "enum_site_content_memberships_relation" DEFAULT 'member',
  	"id_label" varchar,
  	"id_value" varchar,
  	"url" varchar,
  	"logo_id" integer
  );
  
  ALTER TABLE "factories" ADD COLUMN "country" "enum_factories_country" DEFAULT 'bangladesh' NOT NULL;
  ALTER TABLE "factories" ADD COLUMN "location" varchar;
  ALTER TABLE "factories" ADD COLUMN "order" numeric DEFAULT 100;
  ALTER TABLE "site_content_memberships" ADD CONSTRAINT "site_content_memberships_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_content_memberships" ADD CONSTRAINT "site_content_memberships_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_content_memberships_order_idx" ON "site_content_memberships" USING btree ("_order");
  CREATE INDEX "site_content_memberships_parent_id_idx" ON "site_content_memberships" USING btree ("_parent_id");
  CREATE INDEX "site_content_memberships_logo_idx" ON "site_content_memberships" USING btree ("logo_id");
  CREATE INDEX "factories_country_idx" ON "factories" USING btree ("country");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_content_memberships" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_content_memberships" CASCADE;
  DROP INDEX "factories_country_idx";
  ALTER TABLE "factories" DROP COLUMN "country";
  ALTER TABLE "factories" DROP COLUMN "location";
  ALTER TABLE "factories" DROP COLUMN "order";
  DROP TYPE "public"."enum_factories_country";
  DROP TYPE "public"."enum_site_content_memberships_relation";`)
}
