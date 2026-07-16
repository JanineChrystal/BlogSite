"use server";

import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../../db";
import { posts, postTags, tags } from "../../db/schema";

export type ActionState = {
	error: string | null;
	success: boolean;
};

/**
 * Handles post update.
 */
export async function updatePostAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	try {
		const id = formData.get("id") as string;
		const title = formData.get("title") as string;
		const slug = formData.get("slug") as string;
		const categoryId = formData.get("categoryId") as string;
		const featuredLink = formData.get("featuredLink") as string;
		const body = formData.get("body") as string;
		const status = formData.get("status") as string;

		// Extract tags input separately
		const tagsInput = formData.get("tags") as string;

		// Grab both the raw File and hidden existing URL
		const imageFile = formData.get("featuredImage") as File | null;
		let finalImageUrl =
			formData.get("existingFeaturedImage")?.toString() || null;

		// If a physical file was actually uploaded, save it to the hard drive
		if (imageFile && imageFile.size > 0) {
			const blob = await put(imageFile.name, imageFile, {
				access: "public",
			});
			finalImageUrl = blob.url;
		}
		if (!id) {
			return { error: "Post ID is missing.", success: false };
		}

		await db
			.update(posts)
			.set({
				title,
				slug,
				categoryId,
				featuredLink,
				featuredImage: finalImageUrl,
				body,
				status,
				// Update the timestamp to know when it was last modified
				updatedAt: new Date(),
			})
			.where(eq(posts.id, id));

		// Wipe old tags and insert new ones to keep the junction table perfectly synced
		if (tagsInput !== undefined) {
			await db.delete(postTags).where(eq(postTags.postId, id));

			if (tagsInput.trim() !== "") {
				const tagNames = tagsInput
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean);

				for (const tagName of tagNames) {
					const tagSlug = tagName
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/(^-|-$)+/g, "");

					let currentTag = await db.query.tags.findFirst({
						where: eq(tags.slug, tagSlug),
					});

					if (!currentTag) {
						const [insertedTag] = await db
							.insert(tags)
							.values({
								name: tagName,
								slug: tagSlug,
							})
							.returning();
						currentTag = insertedTag;
					}

					const shortPostId = id.substring(0, 10);
					const shortTagId = currentTag.tagId.substring(0, 10);

					await db.insert(postTags).values({
						postId: id,
						tagId: currentTag.tagId,
						slug: `${shortPostId}-${shortTagId}`,
					});
				}
			}
		}

		revalidatePath("/admin/posts");

		return { success: true, error: null };
	} catch (err) {
		console.error("Failed to update post:", err);
		if (err instanceof Error) {
			if (err.message.includes("unique")) {
				return {
					error: "A post with this slug already exists.",
					success: false,
				};
			}
		}
		return {
			error: "Failed to update post. Please try again.",
			success: false,
		};
	}
}
