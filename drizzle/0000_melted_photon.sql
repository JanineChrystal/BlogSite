CREATE TABLE "admin_table" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50),
	"password_hash" varchar(255),
	"theme_mode" varchar(20),
	"accent_color" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "categories_table" (
	"category_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	CONSTRAINT "categories_table_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comments_table" (
	"comment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"parent_id" uuid,
	"author_name" varchar(80) NOT NULL,
	"body" text NOT NULL,
	"is_author" boolean DEFAULT false NOT NULL,
	"is_approved" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_tags_table" (
	"post_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"slug" varchar(50) NOT NULL,
	CONSTRAINT "post_tags_table_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "posts_table" (
	"post_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"featured_image" text,
	"featured_link" text,
	"body" text NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"deep_count" integer DEFAULT 0 NOT NULL,
	"hot_take" integer DEFAULT 0 NOT NULL,
	"grounded_count" integer DEFAULT 0 NOT NULL,
	"cool_count" integer DEFAULT 0 NOT NULL,
	"publish_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_table_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tags_table" (
	"tag_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(50) NOT NULL,
	CONSTRAINT "tags_table_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "comments_table" ADD CONSTRAINT "comments_table_post_id_posts_table_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts_table"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags_table" ADD CONSTRAINT "post_tags_table_post_id_posts_table_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts_table"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags_table" ADD CONSTRAINT "post_tags_table_tag_id_tags_table_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags_table"("tag_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_table" ADD CONSTRAINT "posts_table_user_id_admin_table_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_table"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_table" ADD CONSTRAINT "posts_table_category_id_categories_table_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories_table"("category_id") ON DELETE no action ON UPDATE no action;