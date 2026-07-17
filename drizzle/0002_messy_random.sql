ALTER TABLE "admin_table" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_table" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_table" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "categories_table" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "categories_table" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "categories_table" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "comments_table" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "comments_table" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "post_tags_table" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "post_tags_table" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "posts_table" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "tags_table" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tags_table" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tags_table" ADD COLUMN "deleted_at" timestamp;