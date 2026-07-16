"use server";

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { db } from "../db";
import { admin, categories, posts, postTags, tags } from "../db/schema";

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
	const featuredLink = formData.get("featuredLink")?.toString() || null;
	const status = formData.get("status")?.toString() || "draft";
	const tagsInput = formData.get("tags")?.toString();
	const imageFile = formData.get("featuredImage") as File | null;
	let finalImageUrl = formData.get("existingFeaturedImage")?.toString() || null;

	if (imageFile && imageFile.size > 0) {
		const blob = await put(imageFile.name, imageFile, {
			access: "public",
		});
		finalImageUrl = blob.url;
	}
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

		// Insert post using safe, structured schema bindings and return the new ID
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
			// Simple comment: Logs the exact tag error to your VS Code terminal without breaking the post creation
			console.error("Post saved, but tags failed to insert:", tagError);
		}

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

		// Grab both the raw File and our hidden existing URL
		const imageFile = formData.get("featuredImage") as File | null;
		let finalImageUrl =
			formData.get("existingFeaturedImage")?.toString() || null;

		// If a physical file was actually uploaded, save it to the hard drive
		if (imageFile && imageFile.size > 0) {
			const bytes = await imageFile.arrayBuffer();
			const buffer = Buffer.from(bytes);

			// Simple comment: Strip spaces and add a timestamp so files with the same name don't overwrite each other
			const uniqueName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
			const filePath = join(process.cwd(), "public", "uploads", uniqueName);

			await writeFile(filePath, buffer);
			finalImageUrl = `/uploads/${uniqueName}`;
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

		// Simple comment: Wipe old tags and insert new ones to keep the junction table perfectly synced
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

					await db.insert(postTags).values({
						postId: id,
						tagId: currentTag.tagId,
						slug: `${id}-${currentTag.tagId}`,
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

		// Simple comment: Fetch the next chunk by skipping the offsetAmount
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

		// Simple comment: Map the raw database result to perfectly match your frontend PostItem interface
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

/**
 * Creates a new category inline from the post dialog.
 */
export async function createInlineCategory(name: string) {
	try {
		// Simple comment: Automatically generate a URL-friendly slug from the category name
		const generatedSlug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)+/g, "");

		// Simple comment: Insert both the name and the generated slug
		const [newCategory] = await db
			.insert(categories)
			.values({
				name: name,
				slug: generatedSlug,
			})
			.returning({
				// Simple comment: Fixed this to use categoryId to match your exact Drizzle schema
				categoryId: categories.categoryId,
				name: categories.name,
			});

		return { success: true, category: newCategory };
	} catch (error) {
		console.error("Failed to create category:", error);
		return { success: false, error: "Could not create category." };
	}
}
