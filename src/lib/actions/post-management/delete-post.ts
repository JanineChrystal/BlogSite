"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../../db";
import { posts } from "../../db/schema";

// Handles secure soft post deletion.
export async function deletePostAction(postId: string) {
	try {
		// Updates the deletedAt column for a soft delete instead of a hard removal
		await db
			.update(posts)
			.set({ deletedAt: new Date() })
			.where(eq(posts.id, postId));

		// Refresh the UI to show the updated post on the Admin Interface
		revalidatePath("/admin/post-management");

		// Refresh the UI to show the updated post on the public site
		revalidatePath("/");

		return { success: true };
	} catch (err) {
		console.error("Failed to delete post:", err);
		return { success: false, error: "Failed to delete post." };
	}
}
