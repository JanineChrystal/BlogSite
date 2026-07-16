import { z } from "zod";

export const CreateInlineCategorySchema = z
	.string()
	.min(1, "Category name cannot be empty.");
