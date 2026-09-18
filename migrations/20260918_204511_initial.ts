import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_images_view" AS ENUM('front', 'back', 'side', 'detail', 'other');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_detail_url" varchar,
  	"sizes_detail_width" numeric,
  	"sizes_detail_height" numeric,
  	"sizes_detail_mime_type" varchar,
  	"sizes_detail_filesize" numeric,
  	"sizes_detail_filename" varchar
  );
  
  CREATE TABLE "services_covers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "services_how" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "services_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer
  );
  
  CREATE TABLE "product_categories_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "product_categories_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"image_id" integer,
  	"order" numeric DEFAULT 100,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "products_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"view" "enum_products_images_view" DEFAULT 'front'
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"style_number" varchar,
  	"category_id" integer NOT NULL,
  	"summary" varchar,
  	"description" varchar,
  	"composition" varchar,
  	"gsm" varchar,
  	"fabric_construction" varchar,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 100,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "factories_product_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "factories_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "factories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"specialty" varchar NOT NULL,
  	"website" varchar,
  	"logo_id" integer,
  	"intro" varchar NOT NULL,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "factories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"services_id" integer,
  	"product_categories_id" integer,
  	"products_id" integer,
  	"factories_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"address" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tagline" varchar NOT NULL,
  	"one_liner" varchar NOT NULL,
  	"domain" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"mission" varchar NOT NULL,
  	"vision" varchar NOT NULL,
  	"payment" varchar NOT NULL,
  	"address_line1" varchar NOT NULL,
  	"address_line2" varchar NOT NULL,
  	"address_city" varchar NOT NULL,
  	"address_country" varchar NOT NULL,
  	"address_geo_lat" numeric NOT NULL,
  	"address_geo_lng" numeric NOT NULL,
  	"office_image_id" integer,
  	"og_image_id" integer,
  	"founding_year" numeric,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_content_why_choose_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_export_markets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"full" varchar NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE "site_content_qc_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar NOT NULL,
  	"detail" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_production_flow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" varchar NOT NULL
  );
  
  CREATE TABLE "site_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_content_home_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "page_content_about_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "page_content_services_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "page_content_products_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "page_content_factories_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "page_content_compliance_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "page_content_contact_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "page_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_meta_title" varchar,
  	"home_meta_description" varchar,
  	"home_heading" varchar,
  	"home_intro" varchar,
  	"about_meta_title" varchar,
  	"about_meta_description" varchar,
  	"about_heading" varchar,
  	"about_intro" varchar,
  	"services_meta_title" varchar,
  	"services_meta_description" varchar,
  	"services_heading" varchar,
  	"services_intro" varchar,
  	"products_meta_title" varchar,
  	"products_meta_description" varchar,
  	"products_heading" varchar,
  	"products_intro" varchar,
  	"factories_meta_title" varchar,
  	"factories_meta_description" varchar,
  	"factories_heading" varchar,
  	"factories_intro" varchar,
  	"compliance_meta_title" varchar,
  	"compliance_meta_description" varchar,
  	"compliance_heading" varchar,
  	"compliance_intro" varchar,
  	"contact_meta_title" varchar,
  	"contact_meta_description" varchar,
  	"contact_heading" varchar,
  	"contact_intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_covers" ADD CONSTRAINT "services_covers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_how" ADD CONSTRAINT "services_how_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_faqs" ADD CONSTRAINT "services_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories_sub_items" ADD CONSTRAINT "product_categories_sub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories_faqs" ADD CONSTRAINT "product_categories_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_specs" ADD CONSTRAINT "products_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "factories_product_types" ADD CONSTRAINT "factories_product_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."factories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "factories_faqs" ADD CONSTRAINT "factories_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."factories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "factories" ADD CONSTRAINT "factories_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "factories" ADD CONSTRAINT "factories_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "factories_rels" ADD CONSTRAINT "factories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."factories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "factories_rels" ADD CONSTRAINT "factories_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_factories_fk" FOREIGN KEY ("factories_id") REFERENCES "public"."factories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_emails" ADD CONSTRAINT "site_settings_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_same_as" ADD CONSTRAINT "site_settings_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_keywords" ADD CONSTRAINT "site_settings_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_office_image_id_media_id_fk" FOREIGN KEY ("office_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_content_why_choose_us" ADD CONSTRAINT "site_content_why_choose_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_export_markets" ADD CONSTRAINT "site_content_export_markets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_certifications" ADD CONSTRAINT "site_content_certifications_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_content_certifications" ADD CONSTRAINT "site_content_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_qc_steps" ADD CONSTRAINT "site_content_qc_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_production_flow" ADD CONSTRAINT "site_content_production_flow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_home_faqs" ADD CONSTRAINT "page_content_home_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_about_faqs" ADD CONSTRAINT "page_content_about_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_services_faqs" ADD CONSTRAINT "page_content_services_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_products_faqs" ADD CONSTRAINT "page_content_products_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_factories_faqs" ADD CONSTRAINT "page_content_factories_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_compliance_faqs" ADD CONSTRAINT "page_content_compliance_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_contact_faqs" ADD CONSTRAINT "page_content_contact_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_detail_sizes_detail_filename_idx" ON "media" USING btree ("sizes_detail_filename");
  CREATE INDEX "services_covers_order_idx" ON "services_covers" USING btree ("_order");
  CREATE INDEX "services_covers_parent_id_idx" ON "services_covers" USING btree ("_parent_id");
  CREATE INDEX "services_how_order_idx" ON "services_how" USING btree ("_order");
  CREATE INDEX "services_how_parent_id_idx" ON "services_how" USING btree ("_parent_id");
  CREATE INDEX "services_faqs_order_idx" ON "services_faqs" USING btree ("_order");
  CREATE INDEX "services_faqs_parent_id_idx" ON "services_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_seo_seo_og_image_idx" ON "services" USING btree ("seo_og_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_product_categories_id_idx" ON "services_rels" USING btree ("product_categories_id");
  CREATE INDEX "product_categories_sub_items_order_idx" ON "product_categories_sub_items" USING btree ("_order");
  CREATE INDEX "product_categories_sub_items_parent_id_idx" ON "product_categories_sub_items" USING btree ("_parent_id");
  CREATE INDEX "product_categories_faqs_order_idx" ON "product_categories_faqs" USING btree ("_order");
  CREATE INDEX "product_categories_faqs_parent_id_idx" ON "product_categories_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_image_idx" ON "product_categories" USING btree ("image_id");
  CREATE INDEX "product_categories_seo_seo_og_image_idx" ON "product_categories" USING btree ("seo_og_image_id");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE INDEX "products_specs_order_idx" ON "products_specs" USING btree ("_order");
  CREATE INDEX "products_specs_parent_id_idx" ON "products_specs" USING btree ("_parent_id");
  CREATE INDEX "products_images_order_idx" ON "products_images" USING btree ("_order");
  CREATE INDEX "products_images_parent_id_idx" ON "products_images" USING btree ("_parent_id");
  CREATE INDEX "products_images_image_idx" ON "products_images" USING btree ("image_id");
  CREATE INDEX "products_style_number_idx" ON "products" USING btree ("style_number");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_seo_seo_og_image_idx" ON "products" USING btree ("seo_og_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "factories_product_types_order_idx" ON "factories_product_types" USING btree ("_order");
  CREATE INDEX "factories_product_types_parent_id_idx" ON "factories_product_types" USING btree ("_parent_id");
  CREATE INDEX "factories_faqs_order_idx" ON "factories_faqs" USING btree ("_order");
  CREATE INDEX "factories_faqs_parent_id_idx" ON "factories_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "factories_slug_idx" ON "factories" USING btree ("slug");
  CREATE INDEX "factories_logo_idx" ON "factories" USING btree ("logo_id");
  CREATE INDEX "factories_seo_seo_og_image_idx" ON "factories" USING btree ("seo_og_image_id");
  CREATE INDEX "factories_updated_at_idx" ON "factories" USING btree ("updated_at");
  CREATE INDEX "factories_created_at_idx" ON "factories" USING btree ("created_at");
  CREATE INDEX "factories_rels_order_idx" ON "factories_rels" USING btree ("order");
  CREATE INDEX "factories_rels_parent_idx" ON "factories_rels" USING btree ("parent_id");
  CREATE INDEX "factories_rels_path_idx" ON "factories_rels" USING btree ("path");
  CREATE INDEX "factories_rels_product_categories_id_idx" ON "factories_rels" USING btree ("product_categories_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_factories_id_idx" ON "payload_locked_documents_rels" USING btree ("factories_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_emails_order_idx" ON "site_settings_emails" USING btree ("_order");
  CREATE INDEX "site_settings_emails_parent_id_idx" ON "site_settings_emails" USING btree ("_parent_id");
  CREATE INDEX "site_settings_same_as_order_idx" ON "site_settings_same_as" USING btree ("_order");
  CREATE INDEX "site_settings_same_as_parent_id_idx" ON "site_settings_same_as" USING btree ("_parent_id");
  CREATE INDEX "site_settings_keywords_order_idx" ON "site_settings_keywords" USING btree ("_order");
  CREATE INDEX "site_settings_keywords_parent_id_idx" ON "site_settings_keywords" USING btree ("_parent_id");
  CREATE INDEX "site_settings_office_image_idx" ON "site_settings" USING btree ("office_image_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE INDEX "site_content_why_choose_us_order_idx" ON "site_content_why_choose_us" USING btree ("_order");
  CREATE INDEX "site_content_why_choose_us_parent_id_idx" ON "site_content_why_choose_us" USING btree ("_parent_id");
  CREATE INDEX "site_content_export_markets_order_idx" ON "site_content_export_markets" USING btree ("_order");
  CREATE INDEX "site_content_export_markets_parent_id_idx" ON "site_content_export_markets" USING btree ("_parent_id");
  CREATE INDEX "site_content_certifications_order_idx" ON "site_content_certifications" USING btree ("_order");
  CREATE INDEX "site_content_certifications_parent_id_idx" ON "site_content_certifications" USING btree ("_parent_id");
  CREATE INDEX "site_content_certifications_logo_idx" ON "site_content_certifications" USING btree ("logo_id");
  CREATE INDEX "site_content_qc_steps_order_idx" ON "site_content_qc_steps" USING btree ("_order");
  CREATE INDEX "site_content_qc_steps_parent_id_idx" ON "site_content_qc_steps" USING btree ("_parent_id");
  CREATE INDEX "site_content_production_flow_order_idx" ON "site_content_production_flow" USING btree ("_order");
  CREATE INDEX "site_content_production_flow_parent_id_idx" ON "site_content_production_flow" USING btree ("_parent_id");
  CREATE INDEX "page_content_home_faqs_order_idx" ON "page_content_home_faqs" USING btree ("_order");
  CREATE INDEX "page_content_home_faqs_parent_id_idx" ON "page_content_home_faqs" USING btree ("_parent_id");
  CREATE INDEX "page_content_about_faqs_order_idx" ON "page_content_about_faqs" USING btree ("_order");
  CREATE INDEX "page_content_about_faqs_parent_id_idx" ON "page_content_about_faqs" USING btree ("_parent_id");
  CREATE INDEX "page_content_services_faqs_order_idx" ON "page_content_services_faqs" USING btree ("_order");
  CREATE INDEX "page_content_services_faqs_parent_id_idx" ON "page_content_services_faqs" USING btree ("_parent_id");
  CREATE INDEX "page_content_products_faqs_order_idx" ON "page_content_products_faqs" USING btree ("_order");
  CREATE INDEX "page_content_products_faqs_parent_id_idx" ON "page_content_products_faqs" USING btree ("_parent_id");
  CREATE INDEX "page_content_factories_faqs_order_idx" ON "page_content_factories_faqs" USING btree ("_order");
  CREATE INDEX "page_content_factories_faqs_parent_id_idx" ON "page_content_factories_faqs" USING btree ("_parent_id");
  CREATE INDEX "page_content_compliance_faqs_order_idx" ON "page_content_compliance_faqs" USING btree ("_order");
  CREATE INDEX "page_content_compliance_faqs_parent_id_idx" ON "page_content_compliance_faqs" USING btree ("_parent_id");
  CREATE INDEX "page_content_contact_faqs_order_idx" ON "page_content_contact_faqs" USING btree ("_order");
  CREATE INDEX "page_content_contact_faqs_parent_id_idx" ON "page_content_contact_faqs" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "services_covers" CASCADE;
  DROP TABLE "services_how" CASCADE;
  DROP TABLE "services_faqs" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "product_categories_sub_items" CASCADE;
  DROP TABLE "product_categories_faqs" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "products_specs" CASCADE;
  DROP TABLE "products_images" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "factories_product_types" CASCADE;
  DROP TABLE "factories_faqs" CASCADE;
  DROP TABLE "factories" CASCADE;
  DROP TABLE "factories_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_emails" CASCADE;
  DROP TABLE "site_settings_same_as" CASCADE;
  DROP TABLE "site_settings_keywords" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_content_why_choose_us" CASCADE;
  DROP TABLE "site_content_export_markets" CASCADE;
  DROP TABLE "site_content_certifications" CASCADE;
  DROP TABLE "site_content_qc_steps" CASCADE;
  DROP TABLE "site_content_production_flow" CASCADE;
  DROP TABLE "site_content" CASCADE;
  DROP TABLE "page_content_home_faqs" CASCADE;
  DROP TABLE "page_content_about_faqs" CASCADE;
  DROP TABLE "page_content_services_faqs" CASCADE;
  DROP TABLE "page_content_products_faqs" CASCADE;
  DROP TABLE "page_content_factories_faqs" CASCADE;
  DROP TABLE "page_content_compliance_faqs" CASCADE;
  DROP TABLE "page_content_contact_faqs" CASCADE;
  DROP TABLE "page_content" CASCADE;
  DROP TYPE "public"."enum_products_images_view";`)
}
