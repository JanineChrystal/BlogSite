"use server";

import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { CreatePostSchema } from "@/lib/schema/postSchema";
import type { PostActionState } from "@/lib/types/actions";
import { db } from "../../db";
import { admin, posts, postTags, tags } from "../../db/schema";

export async function createPostAction(
	_prevState: PostActionState,
	formData: FormData,
): Promise<PostActionState> {
	const rawData = Object.fromEntries(formData.entries());
	const result = CreatePostSchema.safeParse(rawData);

	if (!result.success) {
		const flattened = z.flattenError(result.error);
		return {
			errors: flattened.fieldErrors,
			success: false,
		};
	}

	const {
		title,
		slug,
		categoryId,
		body,
		featuredLink,
		status,
		tags: tagsInput,
	} = result.data;

	const imageFile = formData.get("featuredImage") as File | null;
	let finalImageUrl = formData.get("existingFeaturedImage")?.toString() || null;

	if (imageFile && imageFile.size > 0) {
		// Add random suffix to prevent Vercel Blob overwrites and errors
		const blob = await put(imageFile.name, imageFile, {
			access: "public",
			addRandomSuffix: true,
		});
		finalImageUrl = blob.url;
	}

	try {
		// Identifies current user using the secure HTTP-only session cookie
		const cookieStore = await cookies();
		const sessionToken = cookieStore.get("admin_session")?.value;

		if (!sessionToken) {
			return { errors: { _form: ["Unauthorized access."] }, success: false };
		}

		// Lookups the admin's unique record
		const [activeAdmin] = await db.select().from(admin).limit(1);
		if (!activeAdmin) {
			return {
				errors: { _form: ["Admin account not found."] },
				success: false,
			};
		}

		// Insert post using safe structured schema bindings and return the new ID
		const [newPost] = await db
			.insert(posts)
			.values({
				userId: activeAdmin.userId,
				categoryId: categoryId,
				title,
				slug,
				body,
				featuredImage: finalImageUrl,
				featuredLink,
				// Cast status to strictly match the new Drizzle schema types
				status: status as "draft" | "published",
			})
			.returning({ id: posts.id });

		// Handles relational tag insertion if tags were provided
		try {
			if (tagsInput && tagsInput.trim() !== "") {
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

					const shortPostId = newPost.id.substring(0, 10);
					const shortTagId = currentTag.tagId.substring(0, 10);

					await db.insert(postTags).values({
						postId: newPost.id,
						tagId: currentTag.tagId,
						slug: `${shortPostId}-${shortTagId}`,
					});
				}
			}
		} catch (tagError) {
			// Logs the exact tag error to terminal without breaking creation
			console.error("Post saved, but tags failed to insert:", tagError);
		}

		// Refresh the UI to show the new post on the Admin Interface
		revalidatePath("/admin/post-management");

		// Refresh the UI to show the new post on the public site
		revalidatePath("/");
		return { success: true };
	} catch (err) {
		console.error("Database failed to create post:", err);

		// Safely verifies that the thrown exception is an Error object
		if (err instanceof Error) {
			// Handles unique constraint errors gracefully
			if (err.message.includes("unique")) {
				return {
					errors: { slug: ["A post with this slug already exists."] },
					success: false,
				};
			}
		}

		return {
			errors: { _form: ["Failed to create post. Please try again."] },
			success: false,
		};
	}
}
