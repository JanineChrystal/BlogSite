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
