"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { CommentSchema } from "@/lib/schema/commentSchema";
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
		const flattened = z.flattenError(result.error);

		return {
			errors: flattened.fieldErrors,
		};
	}

	try {
		// Insert the comment; createdAt and updatedAt are handled by the database automatically
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
