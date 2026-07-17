"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

const REACTION_CONFIG = {
	deep: { key: "deepCount", column: posts.deepCount },
	"hot-take": { key: "hotTake", column: posts.hotTake },
	grounded: { key: "groundedCount", column: posts.groundedCount },
	cool: { key: "coolCount", column: posts.coolCount },
} as const;

type ReactionId = keyof typeof REACTION_CONFIG;

export async function addReaction(
	postId: string,
	reactionId: string,
	slug: string,
) {
	if (!(reactionId in REACTION_CONFIG)) {
		return { error: "Invalid reaction type" };
	}

	const { key, column } = REACTION_CONFIG[reactionId as ReactionId];

	try {
		// Update the reaction count and manually set the updatedAt timestamp for the post
		await db
			.update(posts)
			.set({
				[key]: sql`${column} + 1`,
				updatedAt: new Date(),
			})
			.where(eq(posts.id, postId));

		revalidatePath(`/blog-post/${slug}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to add reaction:", error);
		return { error: "Could not submit reaction. Please try again." };
	}
}
