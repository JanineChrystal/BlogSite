import { CATEGORY_METADATA } from "@/app/(public)/constants/category-meta";
import { db } from "@/lib/db";
import type { Category } from "@/lib/types/post";

export async function getAllCategories(): Promise<Category[]> {
	const allCategories = await db.query.categories.findMany();
	return allCategories.map((c) => ({
		name: c.name,
		slug: c.slug,
		description: CATEGORY_METADATA[c.slug]?.description ?? "",
	}));
}
