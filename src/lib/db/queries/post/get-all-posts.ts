import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import type { PaginatedPosts } from "@/lib/types/paginated";
import { generateExcerpt } from "@/lib/utils/generate-excerpt";

const DEFAULT_PAGE_SIZE = 6;

export async function getAllPosts({
	page = 1,
	pageSize = DEFAULT_PAGE_SIZE,
} = {}): Promise<PaginatedPosts> {
	const all = await db.query.posts.findMany({
		where: and(eq(posts.status, "published"), isNull(posts.deletedAt)),
		orderBy: desc(posts.createdAt),
		limit: pageSize + 1,
		offset: (page - 1) * pageSize,
		with: {
			category: {
				columns: {
					name: true,
					slug: true,
				},
			},
		},
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
				name: p.category.name,
				slug: p.category.slug,
			},
			publishedAt: p.publishAt?.toISOString() ?? p.createdAt.toISOString(),
		})),
		hasMore,
	};
}
