import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";
import { resolveSortOrder } from "@/lib/helpers/resolve-sort-order";
import type { PaginatedPosts } from "@/lib/types/paginated";
import { generateExcerpt } from "@/lib/utils/generate-excerpt";

const DEFAULT_PAGE_SIZE = 6;

export async function getPostsByCategory(
	slug: string,
	options: { page?: number; pageSize?: number; sort?: string } = {},
): Promise<PaginatedPosts> {
	const { page = 1, pageSize = DEFAULT_PAGE_SIZE, sort = "newest" } = options;

	const category = await db.query.categories.findFirst({
		where: eq(categories.slug, slug),
		columns: { categoryId: true, name: true },
	});

	if (!category) {
		return { posts: [], hasMore: false };
	}

	const all = await db.query.posts.findMany({
		where: eq(posts.categoryId, category.categoryId),
		orderBy: resolveSortOrder(sort),
		limit: pageSize + 1,
		offset: (page - 1) * pageSize,
	});

	const hasMore = all.length > pageSize;
	const resultPosts = all.slice(0, pageSize);

	return {
		posts: resultPosts.map((p) => ({
			id: p.id,
			slug: p.slug,
			title: p.title,
			excerpt: generateExcerpt(p.body),
			coverImage: p.featuredImage ?? "",
			readTimeMinutes: Math.ceil(p.body.split(" ").length / 200),
			category: {
				name: category.name,
				slug: slug,
			},
			publishedAt: p.publishAt?.toISOString() ?? p.createdAt.toISOString(),
		})),
		hasMore,
	};
}
