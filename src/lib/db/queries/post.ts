import { db } from "../index";
import { categories } from "../schema";

export async function getAdminPostsList() {
	// Simple comment: Use the relational API to easily pull in the category and nested tags
	const allPosts = await db.query.posts.findMany({
		orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		with: {
			category: true,
			postTags: {
				with: {
					tag: true,
				},
			},
		},
	});

	// Simple comment: Map the result to perfectly match the PostItem interface
	return allPosts.map((post) => ({
		id: post.id,
		title: post.title,
		slug: post.slug,
		status: post.status,
		createdAt: post.createdAt,
		categoryId: post.categoryId,
		categoryName: post.category?.name || "Uncategorized",
		body: post.body,
		featuredLink: post.featuredLink,
		featuredImage: post.featuredImage,
		tags: post.postTags.map((pt) => pt.tag.name).join(", ") || null,
	}));
}

/**
 * Helper to populate the "Select Category" dropdown inside the create modal.
 */
export async function getCategoriesForDropdown() {
	// Simple comment: Fetches categories so we can assign a valid categoryId to new posts
	return await db.select().from(categories);
}
