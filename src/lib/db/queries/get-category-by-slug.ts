import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";
import type { Category } from "@/lib/types/post";
import { CATEGORY_METADATA } from "../../../app/(public)/constants/category-meta";

export async function getCategoryBySlug(
	slug: string,
): Promise<Category | undefined> {
	const categoryData = await db.query.categories.findFirst({
		where: eq(categories.slug, slug),
	});

	if (!categoryData) return undefined;

	// Fetch the latest post in this category to get the hero image
	const latestPost = await db.query.posts.findFirst({
		where: eq(posts.categoryId, categoryData.categoryId),
		orderBy: desc(posts.createdAt),
		columns: {
			featuredImage: true,
		},
	});

	return {
		name: categoryData.name,
		slug: categoryData.slug,
		description: CATEGORY_METADATA[slug]?.description ?? "",
		heroImage: latestPost?.featuredImage ?? "/images/default-category-hero.jpg",
	};
}
