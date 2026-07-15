import { desc, eq } from "drizzle-orm";
import { db } from "../index";
import { categories, posts } from "../schema";

export async function getAdminPostsList() {
	// Fetches all real posts and attach their corresponding category name
	const result = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			status: posts.status,
			createdAt: posts.createdAt,
			categoryName: categories.name,
		})
		.from(posts)
		.leftJoin(categories, eq(posts.categoryId, categories.categoryId))
		.orderBy(desc(posts.createdAt));

	return result;
}

/**
 * Helper to populate the "Select Category" dropdown inside the create modal.
 */
export async function getCategoriesForDropdown() {
	// Simple comment: Fetches categories so we can assign a valid categoryId to new posts
	return await db.select().from(categories);
}
