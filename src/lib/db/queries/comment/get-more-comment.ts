"use server";

import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";

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
