import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, comments as commentsTable, posts } from "@/lib/db/schema";
import type { Category, Comment, Post, PostDetail } from "@/lib/types/post";
import { formatDate } from "@/lib/utils/format-date";
import { CATEGORY_METADATA } from "./category-meta";

export async function getPostBySlug(
	slug: string,
): Promise<PostDetail | undefined> {
	const data = await db.query.posts.findFirst({
		where: eq(posts.slug, slug),
		with: {
			author: {
				columns: {
					userName: true,
				},
			},
			category: {
				columns: {
					name: true,
					slug: true,
				},
			},
			comments: {
				orderBy: [desc(commentsTable.createdAt)],
			},
			postTags: {
				with: {
					tag: true,
				},
			},
		},
	});

	if (!data) return undefined;

	let content;
	try {
		content = JSON.parse(data.body);
	} catch (e) {
		content = [{ id: "p1", type: "paragraph", text: data.body, lead: true }];
	}

	const commentsById: Record<string, Comment & { parentId: string | null }> =
		{};
	const rootComments: Comment[] = [];

	for (const c of data.comments) {
		const comment: Comment & { parentId: string | null } = {
			id: c.id,
			author: { name: c.authorName },
			content: c.body,
			timestamp: formatDate(c.createdAt),
			isAuthor: c.isAuthor,
			parentId: c.parentId,
			replies: [],
		};
		commentsById[c.id] = comment;
	}

	for (const c of data.comments) {
		if (c.parentId && commentsById[c.parentId]) {
			commentsById[c.parentId].replies?.push(commentsById[c.id]);
		} else {
			rootComments.push(commentsById[c.id]);
		}
	}

	const firstParagraph = content.find(
		(block: { type: string; text: string }) =>
			block.type === "paragraph" && block.text,
	);

	const post: PostDetail = {
		id: data.id,
		slug: data.slug,
		title: data.title,
		excerpt: firstParagraph
			? `${firstParagraph.text.substring(0, 150)}...`
			: "",
		coverImage: data.featuredImage ?? "",
		readTimeMinutes: Math.ceil(data.body.split(" ").length / 200),
		category: {
			name: data.category.name,
			slug: data.category.slug,
		},
		publishedAt: data.publishAt?.toISOString() ?? data.createdAt.toISOString(),
		author: {
			name: data.author.userName ?? "Admin",
		},
		tags: data.postTags.map((pt) => ({ label: pt.tag.name })),
		content,
		reactions: [
			{ id: "deep", label: "Deep", icon: "droplet", count: data.deepCount },
			{ id: "hot-take", label: "Hot Take", icon: "flame", count: data.hotTake },
			{
				id: "grounded",
				label: "Grounded",
				icon: "leaf",
				count: data.groundedCount,
			},
			{ id: "cool", label: "Cool", icon: "wind", count: data.coolCount },
		],
		comments: rootComments,
		commentCount: data.comments.length,
	};

	return post;
}

const DEFAULT_PAGE_SIZE = 6;

export async function getAllCategories(): Promise<Category[]> {
	const allCategories = await db.query.categories.findMany();
	return allCategories.map((c) => ({
		name: c.name,
		slug: c.slug,
		description: CATEGORY_METADATA[c.slug]?.description ?? "",
	}));
}

export async function getCategoryBySlug(
	slug: string,
): Promise<Category | undefined> {
	const categoryData = await db.query.categories.findFirst({
		where: eq(categories.slug, slug),
	});

	if (!categoryData) return undefined;

	// Fetch the latest post in this category to get the hero image
	const latestPost = await db.query.posts.findFirst({
		where: eq(posts.categoryId, categoryData.categoryId),
		orderBy: desc(posts.createdAt),
		columns: {
			featuredImage: true,
		},
	});

	return {
		name: categoryData.name,
		slug: categoryData.slug,
		description: CATEGORY_METADATA[slug]?.description ?? "",
		heroImage: latestPost?.featuredImage ?? "/images/default-category-hero.jpg",
	};
}

export interface PaginatedPosts {
	posts: Post[];
	hasMore: boolean;
}

export async function getAllPosts({
	page = 1,
	pageSize = DEFAULT_PAGE_SIZE,
} = {}): Promise<PaginatedPosts> {
	const all = await db.query.posts.findMany({
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
			excerpt: `${p.body.substring(0, 150)}...`,
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

export async function getPostsByCategory(
	slug: string,
	{ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {},
): Promise<PaginatedPosts> {
	const category = await db.query.categories.findFirst({
		where: eq(categories.slug, slug),
		columns: { categoryId: true, name: true },
	});

	if (!category) {
		return { posts: [], hasMore: false };
	}

	const all = await db.query.posts.findMany({
		where: eq(posts.categoryId, category.categoryId),
		orderBy: desc(posts.createdAt),
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
			excerpt: `${p.body.substring(0, 150)}...`,
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
