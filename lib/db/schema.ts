import { relations } from "drizzle-orm";
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

// Tables
export const admin = pgTable("admin_table", {
	userId: uuid("user_id").primaryKey().defaultRandom().notNull(),
	userName: varchar("username", { length: 50 }),
	passwordHash: varchar("password_hash", { length: 255 }),
	themeMode: varchar("theme_mode", { length: 20 }),
	accentColor: varchar("accent_color", { length: 20 }),
});

export const categories = pgTable("categories_table", {
	categoryId: uuid("category_id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 100 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const posts = pgTable("posts_table", {
	id: uuid("post_id").primaryKey().defaultRandom(),

	// Foreign Keys
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

export const comments = pgTable("comments_table", {
	id: uuid("comment_id").primaryKey().defaultRandom(),

	// cascading delete ensuring comments are removed if the parent post is deleted
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),

	// self referencing column for threaded replies
	parentId: uuid("parent_id"),
	authorName: varchar("author_name", { length: 80 }).notNull(),
	body: text("body").notNull(),
	isAuthor: boolean("is_author").default(false).notNull(),
	isApproved: boolean("is_approved").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tags = pgTable("tags_table", {
	tagId: uuid("tag_id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 50 }).notNull().unique(),
});

export const postTags = pgTable(
	"post_tags_table",
	{
		// foreign key linking to the posts table
		postId: uuid("post_id")
			.references(() => posts.id, { onDelete: "cascade" })
			.notNull(),

		// foreign key linking to the tags table
		tagId: uuid("tag_id")
			.references(() => tags.tagId, { onDelete: "cascade" })
			.notNull(),

		// standard varchar column for the slug constraint
		slug: varchar("slug", { length: 50 }).notNull(),
	},
	// the extra configuration callback returning an array
	(table) => [
		// a composite primary key to ensure exact unique pairings
		primaryKey({ columns: [table.postId, table.tagId] }),
	],
);

// Connections / Relationships

export const postsRelations = relations(posts, ({ one, many }) => ({
	category: one(categories, {
		fields: [posts.categoryId],
		references: [categories.categoryId],
	}),

	author: one(admin, {
		fields: [posts.userId],
		references: [admin.userId],
	}),

	comments: many(comments),
	postTags: many(postTags),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
	// links the comment to the main blog post
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id],
	}),

	// links a nested reply to its direct parent comment
	parentComment: one(comments, {
		fields: [comments.parentId],
		references: [comments.id],
		// uses a relation name string to prevent self referencing confusion
		relationName: "comment_threads",
	}),

	// links parent comment to all of its nested replies
	replies: many(comments, {
		// matches the exact relation name string used in the parent link
		relationName: "comment_threads",
	}),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
	post: one(posts, {
		fields: [postTags.postId],
		references: [posts.id],
	}),
	tag: one(tags, {
		fields: [postTags.tagId],
		references: [tags.tagId],
	}),
}));
