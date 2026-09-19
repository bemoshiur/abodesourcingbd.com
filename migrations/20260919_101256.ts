import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_content_guides_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  ALTER TABLE "page_content" ADD COLUMN "guides_meta_title" varchar;
  ALTER TABLE "page_content" ADD COLUMN "guides_meta_description" varchar;
  ALTER TABLE "page_content" ADD COLUMN "guides_heading" varchar;
  ALTER TABLE "page_content" ADD COLUMN "guides_intro" varchar;
  ALTER TABLE "page_content" ADD COLUMN "guides_answer" varchar;
  ALTER TABLE "page_content_guides_faqs" ADD CONSTRAINT "page_content_guides_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "page_content_guides_faqs_order_idx" ON "page_content_guides_faqs" USING btree ("_order");
  CREATE INDEX "page_content_guides_faqs_parent_id_idx" ON "page_content_guides_faqs" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "page_content_guides_faqs" CASCADE;
  ALTER TABLE "page_content" DROP COLUMN "guides_meta_title";
  ALTER TABLE "page_content" DROP COLUMN "guides_meta_description";
  ALTER TABLE "page_content" DROP COLUMN "guides_heading";
  ALTER TABLE "page_content" DROP COLUMN "guides_intro";
  ALTER TABLE "page_content" DROP COLUMN "guides_answer";`)
}
