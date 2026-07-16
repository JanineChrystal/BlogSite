"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../../db";
import { posts } from "../../db/schema";

/**
 * Handles secure post deletion.
 */
export async function deletePostAction(postId: string) {
	try {
		// Deletes the post matching the provided ID from the database
		await db.delete(posts).where(eq(posts.id, postId));

		// Tells Next.js to clear the cache and refetch the table data
		revalidatePath("/admin/posts");

		return { success: true };
	} catch (err) {
		console.error("Failed to delete post:", err);
		return { success: false, error: "Failed to delete post." };
	}
}
