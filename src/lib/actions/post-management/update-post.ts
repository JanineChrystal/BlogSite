"use server";

import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UpdatePostSchema } from "@/lib/schema/postSchema";
import type { PostActionState } from "@/lib/types/actions";
import { db } from "../../db";
import { posts, postTags, tags } from "../../db/schema";

export async function updatePostAction(
	_prevState: PostActionState,
	formData: FormData,
): Promise<PostActionState> {
	const rawData = Object.fromEntries(formData.entries());
	const result = UpdatePostSchema.safeParse(rawData);

	if (!result.success) {
		const flattened = z.flattenError(result.error);
		return {
			errors: flattened.fieldErrors,
			success: false,
		};
	}

	try {
		const {
			id,
			title,
			slug,
			categoryId,
			featuredLink,
			body,
			status,
			tags: tagsInput,
		} = result.data;

		// Grab both the raw File and hidden existing URL
		const imageFile = formData.get("featuredImage") as File | null;
		let finalImageUrl =
			formData.get("existingFeaturedImage")?.toString() || null;

		// If a physical file was actually uploaded save it to the blob storage
		if (imageFile && imageFile.size > 0) {
			const blob = await put(imageFile.name, imageFile, {
				access: "public",
				addRandomSuffix: true,
			});
			finalImageUrl = blob.url;
		}

		// Update the post including the status cast and the updatedAt timestamp
		await db
			.update(posts)
			.set({
				title,
				slug,
				categoryId,
				featuredLink,
				featuredImage: finalImageUrl,
				body,
				status: status as "draft" | "published",
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

		// Refresh the UI to show the updated post on the Admin Interface
		revalidatePath("/admin/post-management");

		// Refresh the UI to show the updated post on the public site
		revalidatePath("/");

		return { success: true };
	} catch (err) {
		console.error("Failed to update post:", err);
		if (err instanceof Error) {
			// Check for unique constraints on the slug
			if (err.message.includes("unique")) {
				return {
					errors: { slug: ["A post with this slug already exists."] },
					success: false,
				};
			}
		}
		return {
			errors: { _form: ["Failed to update post. Please try again."] },
			success: false,
		};
	}
}
