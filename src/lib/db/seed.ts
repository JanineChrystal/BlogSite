import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { aloeIce } from "../data/blog/aloe-ice";
import { gilmored } from "../data/blog/gilmored";
import { nosiBalasi } from "../data/blog/nosibalasi";
import { db } from "./index";
import { admin, categories, posts, postTags, tags } from "./schema";

async function main() {
	console.log("Starting database seeding process...");

	// initial admin account
	const insertedAdmin = await db
		.insert(admin)
		.values({
			userName: "NinejaChrys",
			passwordHash: "temporaryp4ssw_hash!",
			themeMode: "dark",
			accentColor: "zinc",
		})
		.returning({ id: admin.userId });

	const adminId = insertedAdmin[0].id;

	console.log("Admin account created.");

	// Categories
	const insertedCategories = await db
		.insert(categories)
		.values([
			{
				name: "Entertainment",
				slug: "entertainment",
			},
			{
				name: "Creative Writing",
				slug: "creative-writing",
			},
			{
				name: "Products Review",
				slug: "products-review",
			},
		])
		.returning({ id: categories.categoryId });

	console.log("Categories populated successfully!");

	const entertainmentId = insertedCategories[0].id;
	const creativeWritingId = insertedCategories[1].id;
	const productsReviewId = insertedCategories[2].id;

	// Tags
	const insertedTags = await db
		.insert(tags)
		.values([
			{
				name: "Series",
				slug: "series",
			},
			{
				name: "Tagalog Poetry",
				slug: "tagalog-poetry",
			},
			{
				name: "Skincare",
				slug: "skincare",
			},
		])
		.returning({ id: tags.tagId });

	console.log("Tags populated successfully!");

	const seriesId = insertedTags[0].id;
	const tagalogPoetryId = insertedTags[1].id;
	const skincareId = insertedTags[2].id;

	// Posts
	const insertedPosts = await db
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
		.returning({ id: posts.id });

	const gilmoreGirlsId = insertedPosts[0].id;
	const nosiBalasiId = insertedPosts[1].id;
	const aloeIceId = insertedPosts[2].id;

	// Post-tag connection
	await db.insert(postTags).values([
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
	]);

	console.log("Database seeded successfully!");
}

main().catch((error) => {
	console.error("Seeding failed:", error);
	process.exit(1);
});
