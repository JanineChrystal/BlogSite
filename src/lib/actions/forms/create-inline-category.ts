"use server";

import { CreateInlineCategorySchema } from "@/lib/schema/categorySchema";
import { db } from "../../db";
import { categories } from "../../db/schema";

// Creates a new category inline from the post dialog.
export async function createInlineCategory(name: string) {
	const result = CreateInlineCategorySchema.safeParse(name);

	if (!result.success) {
		return {
			success: false,
			error: result.error.flatten().formErrors.join(", "),
		};
	}

	try {
		// Automatically generate a URL-friendly slug from the category name
		const generatedSlug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)+/g, "");

		// Insert the category; createdAt and updatedAt are handled by the database automatically
		const [newCategory] = await db
			.insert(categories)
			.values({
				name: name,
				slug: generatedSlug,
			})
			.returning({
				categoryId: categories.categoryId,
				name: categories.name,
			});

		return { success: true, category: newCategory };
	} catch (error) {
		console.error("Failed to create category:", error);
		return { success: false, error: "Could not create category." };
	}
}
