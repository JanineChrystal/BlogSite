import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

export const PostSchema = z.object({
	title: z.string().min(1, "Title is required."),
	slug: z.string().min(1, "Slug is required."),
	categoryId: z.string().min(1, "Category is required."),
	body: z.string().min(1, "Post content cannot be empty."),
	featuredLink: z.string().url().optional().or(z.literal("")),
	status: z.enum(["draft", "published"]).default("draft"),
	tags: z.string().optional(),
	featuredImage: z
		.any()
		.refine(
			(file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE,
			`Max image size is 5MB.`,
		)
		.refine(
			(file) =>
				!file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
			"Only .jpg, .jpeg, .png and .webp formats are supported.",
		)
		.optional(),
	existingFeaturedImage: z.string().optional().nullable(),
});

export const CreatePostSchema = PostSchema;

export const UpdatePostSchema = PostSchema.extend({
	id: z.string().min(1),
});
