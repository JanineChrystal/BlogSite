"use server";

import { db } from "../db";
import { categories } from "../db/schema";

/**
 * Creates a new category inline from the post dialog.
 */
export async function createInlineCategory(name: string) {
	try {
		//  Automatically generate a URL-friendly slug from the category name
		const generatedSlug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)+/g, "");

		// Insert both the name and the generated slug
		const [newCategory] = await db
			.insert(categories)
			.values({
				name: name,
				slug: generatedSlug,
			})
			.returning({
				// Fixed this to use categoryId to match your exact Drizzle schema
				categoryId: categories.categoryId,
				name: categories.name,
			});

		return { success: true, category: newCategory };
	} catch (error) {
		console.error("Failed to create category:", error);
		return { success: false, error: "Could not create category." };
	}
}
