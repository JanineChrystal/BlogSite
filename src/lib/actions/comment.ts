"use server";

import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { CommentSchema } from "@/lib/schema/comment";
import type { CommentFormState } from "@/lib/types/comment";

export async function addComment(
	_formState: CommentFormState,
	formData: FormData,
): Promise<CommentFormState> {
	const rawData = {
		authorName: formData.get("authorName"),
		body: formData.get("body"),
		postId: formData.get("postId"),
		slug: formData.get("slug"),
		parentId: formData.get("parentId"),
	};

	const result = CommentSchema.safeParse(rawData);

	if (!result.success) {
		return {
			errors: result.error.flatten().fieldErrors,
		};
	}

	try {
		await db.insert(comments).values({
			postId: result.data.postId,
			authorName: result.data.authorName,
			body: result.data.body,
			parentId: result.data.parentId,
		});
	} catch (error) {
		console.error("Failed to add comment:", error);
		return {
			errors: { _form: ["Something went wrong. Please try again."] },
		};
	}

	revalidatePath(`/blog-post/${result.data.slug}`);
	return { success: true };
}

// lazy loading comments
export async function fetchMoreComments(
	postId: string,
	offsetAmount: number,
	limitAmount: number = 10,
) {
	try {
		const pagedComments = await db.query.comments.findMany({
			where: and(eq(comments.postId, postId), isNull(comments.parentId)),
			limit: limitAmount,
			offset: offsetAmount,
			orderBy: [desc(comments.createdAt)],
			with: {
				replies: {
					orderBy: [desc(comments.createdAt)],
				},
			},
		});

		// Translates the raw database columns into the frontend Comment interface
		return pagedComments.map((comment) => ({
			id: comment.id,
			postId: comment.postId,
			parentId: comment.parentId,
			isAuthor: comment.isAuthor,
			isApproved: comment.isApproved,
			author: {
				name: comment.authorName,
				avatar: "/default-avatar.png",
			},
			content: comment.body,
			// Convert the Date object into an ISO string to satisfy the interface
			timestamp: comment.createdAt.toISOString(),

			replies: comment.replies.map((reply) => ({
				id: reply.id,
				postId: reply.postId,
				parentId: reply.parentId,
				isAuthor: reply.isAuthor,
				isApproved: reply.isApproved,
				author: {
					name: reply.authorName,
					avatar: "/default-avatar.png",
				},
				content: reply.body,
				// Also convert the reply's Date object to a string
				timestamp: reply.createdAt.toISOString(),
			})),
		}));
	} catch (err) {
		console.error("Failed to lazy load comments:", err);
		return [];
	}
}
