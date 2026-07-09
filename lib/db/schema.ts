import { defineRelations } from "drizzle-orm"; // Using the correct v2 function
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

// Admin Table
export const admin = pgTable("admin_table", {
	userId: uuid("user_id").primaryKey().defaultRandom().notNull(),
	userName: varchar("username", { length: 50 }),
	passwordHash: varchar("password_hash", { length: 255 }),
	themeMode: varchar("theme_mode", { length: 20 }),
	accentColor: varchar("accent_color", { length: 20 }),
});

// Categories Table
export const categories = pgTable("categories_table", {
	categoryId: uuid("category_id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 100 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
});

// Posts Table
export const posts = pgTable("posts_table", {
	id: uuid("post_id").primaryKey().defaultRandom(),

	userId: uuid("user_id")
		.references(() => admin.userId)
		.notNull(),
	categoryId: uuid("category_id")
		.references(() => categories.categoryId)
		.notNull(),

	title: varchar("title", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	featuredImage: text("featured_image"),
	featuredLink: text("featured_link"),
	body: text("body").notNull(),

	status: varchar("status", { length: 20 }).default("draft").notNull(),

	views: integer("views").default(0).notNull(),
	deepCount: integer("deep_count").default(0).notNull(),
	hotTake: integer("hot_take").default(0).notNull(),
	groundedCount: integer("grounded_count").default(0).notNull(),
	coolCount: integer("cool_count").default(0).notNull(),
	publishAt: timestamp("publish_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Comments Table
export const comments = pgTable("comments_table", {
	id: uuid("comment_id").primaryKey().defaultRandom(),

	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),

	parentId: uuid("parent_id"),
	authorName: varchar("author_name", { length: 80 }).notNull(),
	body: text("body").notNull(),
	isAuthor: boolean("is_author").default(false).notNull(),
	isApproved: boolean("is_approved").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tags Table
export const tags = pgTable("tags_table", {
	tagId: uuid("tag_id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 50 }).notNull().unique(),
});

// Post-Tag Connection Table
export const postTags = pgTable(
	"post_tags_table",
	{
		postId: uuid("post_id")
			.references(() => posts.id, { onDelete: "cascade" })
			.notNull(),
		tagId: uuid("tag_id")
			.references(() => tags.tagId, { onDelete: "cascade" })
			.notNull(),
		slug: varchar("slug", { length: 50 }).notNull(),
	},
	(table) => [primaryKey({ columns: [table.postId, table.tagId] })],
);

// V2 RELATIONS GRAPH
export const relations = defineRelations(
	{ posts, categories, admin, comments, tags, postTags },
	(r) => ({
		posts: {
			category: r.one.categories({
				from: r.posts.categoryId,
				to: r.categories.categoryId,
			}),
			author: r.one.admin({
				from: r.posts.userId,
				to: r.admin.userId,
			}),
			comments: r.many.comments(),
			postTags: r.many.postTags(),
		},
		comments: {
			post: r.one.posts({
				from: r.comments.postId,
				to: r.posts.id,
			}),
			parentComment: r.one.comments({
				from: r.comments.parentId,
				to: r.comments.id,
				alias: "comment_threads",
			}),
			replies: r.many.comments({
				alias: "comment_threads",
			}),
		},
		tags: {
			postTags: r.many.postTags(),
		},
		postTags: {
			post: r.one.posts({
				from: r.postTags.postId,
				to: r.posts.id,
			}),
			tag: r.one.tags({
				from: r.postTags.tagId,
				to: r.tags.tagId,
			}),
		},
	}),
);
