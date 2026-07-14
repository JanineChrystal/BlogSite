import { z } from "zod";

export const CommentSchema = z.object({
	authorName: z
		.string()
		.min(1, "Name is required.")
		.max(80, "Name is too long."),
	body: z
		.string()
		.min(10, "Comment must be at least 10 characters.")
		.max(2000, "Comment is too long."),
	postId: z.string().uuid(),
	slug: z.string(),
});