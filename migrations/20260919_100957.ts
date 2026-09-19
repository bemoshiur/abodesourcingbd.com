import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "guides_sections_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "guides_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "guides_sections_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "guides_sections_table_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "guides_sections_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "guides_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"table_caption" varchar
  );
  
  CREATE TABLE "guides_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "guides_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "guides_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "guides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" varchar DEFAULT 'Lightbulb' NOT NULL,
  	"summary" varchar NOT NULL,
  	"reading_minutes" numeric,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 100,
  	"answer" varchar,
  	"seo_heading" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "guides_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer,
  	"services_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "guides_id" integer;
  ALTER TABLE "guides_sections_body" ADD CONSTRAINT "guides_sections_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_sections_bullets" ADD CONSTRAINT "guides_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_sections_table_columns" ADD CONSTRAINT "guides_sections_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_sections_table_rows_cells" ADD CONSTRAINT "guides_sections_table_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides_sections_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_sections_table_rows" ADD CONSTRAINT "guides_sections_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_sections" ADD CONSTRAINT "guides_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_takeaways" ADD CONSTRAINT "guides_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_sources" ADD CONSTRAINT "guides_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_faqs" ADD CONSTRAINT "guides_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "guides_sections_body_order_idx" ON "guides_sections_body" USING btree ("_order");
  CREATE INDEX "guides_sections_body_parent_id_idx" ON "guides_sections_body" USING btree ("_parent_id");
  CREATE INDEX "guides_sections_bullets_order_idx" ON "guides_sections_bullets" USING btree ("_order");
  CREATE INDEX "guides_sections_bullets_parent_id_idx" ON "guides_sections_bullets" USING btree ("_parent_id");
  CREATE INDEX "guides_sections_table_columns_order_idx" ON "guides_sections_table_columns" USING btree ("_order");
  CREATE INDEX "guides_sections_table_columns_parent_id_idx" ON "guides_sections_table_columns" USING btree ("_parent_id");
  CREATE INDEX "guides_sections_table_rows_cells_order_idx" ON "guides_sections_table_rows_cells" USING btree ("_order");
  CREATE INDEX "guides_sections_table_rows_cells_parent_id_idx" ON "guides_sections_table_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "guides_sections_table_rows_order_idx" ON "guides_sections_table_rows" USING btree ("_order");
  CREATE INDEX "guides_sections_table_rows_parent_id_idx" ON "guides_sections_table_rows" USING btree ("_parent_id");
  CREATE INDEX "guides_sections_order_idx" ON "guides_sections" USING btree ("_order");
  CREATE INDEX "guides_sections_parent_id_idx" ON "guides_sections" USING btree ("_parent_id");
  CREATE INDEX "guides_takeaways_order_idx" ON "guides_takeaways" USING btree ("_order");
  CREATE INDEX "guides_takeaways_parent_id_idx" ON "guides_takeaways" USING btree ("_parent_id");
  CREATE INDEX "guides_sources_order_idx" ON "guides_sources" USING btree ("_order");
  CREATE INDEX "guides_sources_parent_id_idx" ON "guides_sources" USING btree ("_parent_id");
  CREATE INDEX "guides_faqs_order_idx" ON "guides_faqs" USING btree ("_order");
  CREATE INDEX "guides_faqs_parent_id_idx" ON "guides_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "guides_slug_idx" ON "guides" USING btree ("slug");
  CREATE INDEX "guides_seo_seo_og_image_idx" ON "guides" USING btree ("seo_og_image_id");
  CREATE INDEX "guides_updated_at_idx" ON "guides" USING btree ("updated_at");
  CREATE INDEX "guides_created_at_idx" ON "guides" USING btree ("created_at");
  CREATE INDEX "guides_rels_order_idx" ON "guides_rels" USING btree ("order");
  CREATE INDEX "guides_rels_parent_idx" ON "guides_rels" USING btree ("parent_id");
  CREATE INDEX "guides_rels_path_idx" ON "guides_rels" USING btree ("path");
  CREATE INDEX "guides_rels_product_categories_id_idx" ON "guides_rels" USING btree ("product_categories_id");
  CREATE INDEX "guides_rels_services_id_idx" ON "guides_rels" USING btree ("services_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_guides_id_idx" ON "payload_locked_documents_rels" USING btree ("guides_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "guides_sections_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_sections_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_sections_table_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_sections_table_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_sections_table_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "guides_sections_body" CASCADE;
  DROP TABLE "guides_sections_bullets" CASCADE;
  DROP TABLE "guides_sections_table_columns" CASCADE;
  DROP TABLE "guides_sections_table_rows_cells" CASCADE;
  DROP TABLE "guides_sections_table_rows" CASCADE;
  DROP TABLE "guides_sections" CASCADE;
  DROP TABLE "guides_takeaways" CASCADE;
  DROP TABLE "guides_sources" CASCADE;
  DROP TABLE "guides_faqs" CASCADE;
  DROP TABLE "guides" CASCADE;
  DROP TABLE "guides_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_guides_fk";
  
  DROP INDEX "payload_locked_documents_rels_guides_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "guides_id";`)
}
