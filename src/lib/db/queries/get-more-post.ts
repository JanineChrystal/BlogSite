"use server";

import { cookies } from "next/headers";
import { db } from "..";

/**
 * Lazy loads a chunk of posts for the admin table.
 */
export async function fetchMoreAdminPosts(
	offsetAmount: number,
	limitAmount: number = 10,
) {
	try {
		const cookieStore = await cookies();
		const sessionToken = cookieStore.get("admin_session")?.value;

		if (!sessionToken) {
			throw new Error("Unauthorized access.");
		}

		// Fetch the next chunk by skipping the offsetAmount
		const pagedPosts = await db.query.posts.findMany({
			limit: limitAmount,
			offset: offsetAmount,
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

		// Map the raw database result to perfectly match your frontend PostItem interface
		return pagedPosts.map((post) => ({
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
	} catch (err) {
		console.error("Failed to lazy load admin posts:", err);
		return [];
	}
}
