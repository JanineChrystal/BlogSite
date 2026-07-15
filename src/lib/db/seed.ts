import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { aloeIce } from "../data/blog/aloe-ice";
import { gilmored } from "../data/blog/gilmored";
import { nosiBalasi } from "../data/blog/nosibalasi";
import { db } from "./index";
import { admin, categories, posts, postTags, tags } from "./schema";

async function main() {
	console.log("Starting database seeding process...");

	const adminUsername = process.env.ADMIN_USERNAME;
	const adminPassword = process.env.ADMIN_PASSWORD;

	// Validates that environment variables exist before proceeding
	if (!adminUsername || !adminPassword) {
		throw new Error(
			"Missing required ADMIN_USERNAME or ADMIN_PASSWORD in .env.local",
		);
	}

	// Hashes the plaintext password with a salt round of 10
	const hashedPassword = await bcrypt.hash(adminPassword, 10);

	// Checks if the admin account already exists in the database
	const existingAdmins = await db
		.select()
		.from(admin)
		.where(eq(admin.userName, adminUsername));

	if (existingAdmins.length > 0) {
		// Updates the password hash of the existing admin to avoid foreign key errors
		await db
			.update(admin)
			.set({ passwordHash: hashedPassword })
			.where(eq(admin.userName, adminUsername));
	} else {
		// Inserts a brand new admin account if one was not found
		await db.insert(admin).values({
			userName: adminUsername,
			passwordHash: hashedPassword,
			themeMode: process.env.ADMIN_THEME_MODE || "dark",
			accentColor: process.env.ADMIN_ACCENT_COLOR || "zinc",
		});
	}

	// Retrieves the admin record to securely get the ID for relationships
	const adminRecords = await db.select().from(admin);

	// Safely validates the admin record was found
	if (adminRecords.length === 0) {
		throw new Error("Admin record not found in the database.");
	}

	const adminId = adminRecords[0].userId;

	console.log("Admin account verified.");

	// Inserts categories but skips existing ones based on the unique slug constraint
	await db
		.insert(categories)
		.values([
			{ name: "Entertainment", slug: "entertainment" },
			{ name: "Creative Writing", slug: "creative-writing" },
			{ name: "Products Review", slug: "product-reviews" },
		])
		.onConflictDoNothing({ target: categories.slug });

	// Fetches all categories to map their IDs correctly
	const allCategories = await db.select().from(categories);

	// Helper function to safely find category IDs without using non-null assertions
	const getCategoryId = (slug: string) => {
		const category = allCategories.find((c) => c.slug === slug);
		if (!category) throw new Error(`Category ${slug} not found`);
		return category.categoryId;
	};

	const entertainmentId = getCategoryId("entertainment");
	const creativeWritingId = getCategoryId("creative-writing");
	const productsReviewId = getCategoryId("product-reviews");

	console.log("Categories verified!");

	// Inserts tags safely by ignoring slug conflicts
	await db
		.insert(tags)
		.values([
			{ name: "Series", slug: "series" },
			{ name: "Tagalog Poetry", slug: "tagalog-poetry" },
			{ name: "Skincare", slug: "skincare" },
		])
		.onConflictDoNothing({ target: tags.slug });

	// Fetches all tags to grab their IDs for the connection table
	const allTags = await db.select().from(tags);

	// Helper function to safely find tag IDs
	const getTagId = (slug: string) => {
		const tag = allTags.find((t) => t.slug === slug);
		if (!tag) throw new Error(`Tag ${slug} not found`);
		return tag.tagId;
	};

	const seriesId = getTagId("series");
	const tagalogPoetryId = getTagId("tagalog-poetry");
	const skincareId = getTagId("skincare");

	console.log("Tags verified!");

	// Inserts blog posts and skips if the post slug already exists
	await db
		.insert(posts)
		.values([
			{
				userId: adminId,
				categoryId: entertainmentId,
				title: "Gilmored.",
				slug: "gilmore-girls",
				body: gilmored,
				status: "published",
				featuredImage: "/posts/gg.png",
			},
			{
				userId: adminId,
				categoryId: creativeWritingId,
				title: "Nosi Ba Lasi",
				slug: "nosi-ba-lasi",
				body: nosiBalasi,
				status: "published",
				featuredImage: "/posts/nosibalasi.png",
			},
			{
				userId: adminId,
				categoryId: productsReviewId,
				title: "Fresh Skinlab K-Aloe Ice Soothing Gel",
				slug: "fresh-skinlab-k-aloe-ice-soothing-gel",
				body: aloeIce,
				status: "published",
				featuredImage: "/posts/aloe.png",
				featuredLink: "https://s.shopee.ph/3LP5At1h6m",
			},
		])
		.onConflictDoNothing({ target: posts.slug });

	// Fetches the posts to get their internal IDs
	const allPosts = await db.select().from(posts);

	// Helper function to safely find post IDs
	const getPostId = (slug: string) => {
		const post = allPosts.find((p) => p.slug === slug);
		if (!post) throw new Error(`Post ${slug} not found`);
		return post.id;
	};

	const gilmoreGirlsId = getPostId("gilmore-girls");
	const nosiBalasiId = getPostId("nosi-ba-lasi");
	const aloeIceId = getPostId("fresh-skinlab-k-aloe-ice-soothing-gel");

	// Maps the many-to-many relationship in the postTags table
	await db
		.insert(postTags)
		.values([
			{
				postId: gilmoreGirlsId,
				tagId: seriesId,
				slug: "gilmore-girls-series",
			},
			{
				postId: nosiBalasiId,
				tagId: tagalogPoetryId,
				slug: "nosi-ba-lasi-poetry",
			},
			{
				postId: aloeIceId,
				tagId: skincareId,
				slug: "aloe-ice-skincare",
			},
		])
		.onConflictDoNothing({ target: postTags.slug });

	console.log("Database seeded successfully!");
}

main().catch((error) => {
	console.error("Seeding failed:", error);
	process.exit(1);
});
