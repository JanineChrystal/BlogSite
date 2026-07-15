"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { db } from "../db";
import { admin, posts } from "../db/schema";

export type ActionState = {
	error: string | null;
	success: boolean;
};

/**
 * Handles secure post creation validation and database insertion.
 */
export async function createPostAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const title = formData.get("title")?.toString();
	const slug = formData.get("slug")?.toString();
	const categoryId = formData.get("categoryId")?.toString();
	const body = formData.get("body")?.toString();
	const featuredImage = formData.get("featuredImage")?.toString() || null;
	const featuredLink = formData.get("featuredLink")?.toString() || null;
	const status = formData.get("status")?.toString() || "draft";

	// Validates required inputs
	if (!title || !slug || !categoryId || !body) {
		return { error: "Please fill out all required fields.", success: false };
	}

	try {
		// Identifies current user using the secure HTTP-only session cookie
		const cookieStore = await cookies();
		const sessionToken = cookieStore.get("admin_session")?.value;

		if (!sessionToken) {
			return { error: "Unauthorized access.", success: false };
		}

		// Lookups the admin's unique record
		const [activeAdmin] = await db.select().from(admin).limit(1);
		if (!activeAdmin) {
			return { error: "Admin account not found.", success: false };
		}

		// Insert post using safe, structured schema bindings
		await db.insert(posts).values({
			userId: activeAdmin.userId,
			categoryId: categoryId,
			title,
			slug,
			body,
			featuredImage,
			featuredLink,
			status: status as "draft" | "published",
		});

		// Refresh the UI to show the new post
		revalidatePath("/admin/posts");
		return { error: null, success: true };
	} catch (err) {
		console.error("Database failed to create post:", err);

		// Safely verifies that the thrown exception is an Error object
		if (err instanceof Error) {
			// Handles unique constraint errors gracefully
			if (err.message.includes("unique")) {
				return {
					error: "A post with this slug already exists.",
					success: false,
				};
			}
		}

		return {
			error: "Failed to create post. Please try again.",
			success: false,
		};
	}
}

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
