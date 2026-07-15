import { and, desc, eq, ilike, inArray, or, type SQL, sql } from "drizzle-orm";
import { db } from "./db/index";
import { categories, posts, postTags, tags } from "./db/schema";
import type { Post } from "./types/post";

/**
 * This file contains all data-fetching functions.
 * By centralizing them, we can easily manage, cache, and reuse our database queries.
 */

export async function getWhatsNew() {
	const newPosts = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			featuredImage: posts.featuredImage,
			categoryName: categories.name,
		})
		.from(posts)
		.leftJoin(categories, eq(posts.categoryId, categories.categoryId))
		.orderBy(desc(posts.createdAt))
		.limit(3);

	// Map the data to the shape your component expects
	return newPosts.map((post) => ({
		id: post.id,
		title: post.title,
		slug: post.slug,
		imageUrl: post.featuredImage as string,
		categoryLabel: post.categoryName,
	}));
}

export async function getPopularCreativeWriting() {
	const popularPosts = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			featuredImage: posts.featuredImage,
			categoryName: categories.name,
		})
		.from(posts)
		.leftJoin(categories, eq(posts.categoryId, categories.categoryId))
		.where(eq(categories.slug, "creative-writing"))
		// TODO: Replace with ordering by reaction/view count once the schema supports it.
		.orderBy(desc(posts.createdAt))
		.limit(5);

	return popularPosts.map((post) => ({
		id: post.id,
		title: post.title,
		slug: post.slug,
		imageUrl: post.featuredImage as string,
		categoryLabel: post.categoryName,
	}));
}

export async function getPopularEntertainment() {
	const popularPosts = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			featuredImage: posts.featuredImage,
			categoryName: categories.name,
		})
		.from(posts)
		.leftJoin(categories, eq(posts.categoryId, categories.categoryId))
		.where(eq(categories.slug, "entertainment"))
		// TODO: Replace with ordering by reaction/view count once the schema supports it.
		.orderBy(desc(posts.createdAt))
		.limit(5);

	return popularPosts.map((post) => ({
		id: post.id,
		title: post.title,
		slug: post.slug,
		imageUrl: post.featuredImage as string,
		categoryLabel: post.categoryName,
	}));
}

export async function getPopularProductReviews() {
	const popularPosts = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			featuredImage: posts.featuredImage,
			categoryName: categories.name,
		})
		.from(posts)
		.leftJoin(categories, eq(posts.categoryId, categories.categoryId))
		.where(eq(categories.slug, "product-reviews"))
		// TODO: Replace with ordering by reaction/view count once the schema supports it.
		.orderBy(desc(posts.createdAt))
		.limit(5);

	return popularPosts.map((post) => ({
		id: post.id,
		title: post.title,
		slug: post.slug,
		imageUrl: post.featuredImage as string,
		categoryLabel: post.categoryName,
	}));
}

export async function getLatestPost() {
	const [latestPost] = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			featuredImage: posts.featuredImage,
			categoryName: categories.name,
			categorySlug: categories.slug,
		})
		.from(posts)
		.leftJoin(categories, eq(posts.categoryId, categories.categoryId))
		.where(eq(posts.status, "published"))
		.orderBy(desc(posts.createdAt))
		.limit(1);

	if (!latestPost) {
		return null;
	}

	return {
		id: latestPost.id,
		title: latestPost.title,
		slug: latestPost.slug,
		imageUrl: latestPost.featuredImage as string,
		category: {
			name: latestPost.categoryName,
			slug: latestPost.categorySlug,
		},
	};
}

export interface SearchResult {
	id: string;
	title: string;
	slug: string;
	categoryName: string | null;
}

/**
 * Searches for posts based on a query string for an autocomplete dropdown.
 * The query is matched against post titles and content.
 * @param query The search term.
 * @returns A promise that resolves to an array of posts.
 */
export async function searchPosts(query: string): Promise<SearchResult[]> {
	if (!query) {
		return [];
	}

	const searchQuery = `%${query}%`;

	const results = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			categoryName: categories.name,
		})
		.from(posts)
		.leftJoin(categories, eq(posts.categoryId, categories.categoryId))
		.where(or(ilike(posts.title, searchQuery), ilike(posts.body, searchQuery)))
		.orderBy(desc(posts.createdAt))
		.limit(5); // Limit results for dropdown display

	return results;
}

const POSTS_PER_PAGE = 9;

interface GetCategorizedPostsParams {
	categorySlug: string;
	/** One or more tag slugs to filter by. Posts matching ANY of the given tags are returned. */
	tagSlugs?: string[];
	sortBy?: string;
	page?: string; // searchParams are strings
}

interface CategorizedPostsResult {
	posts: Post[];
	hasMore: boolean;
}

export async function getCategorizedPosts({
	categorySlug,
	tagSlugs,
	sortBy = "newest",
	page: pageStr = "1",
}: GetCategorizedPostsParams): Promise<CategorizedPostsResult> {
	const page = parseInt(pageStr, 10) || 1;
	const offset = (page - 1) * POSTS_PER_PAGE;

	let orderByClause: SQL | typeof posts.createdAt;
	switch (sortBy) {
		case "oldest":
			orderByClause = posts.createdAt;
			break;
		default: // newest
			orderByClause = desc(posts.createdAt);
			break;
	}

	const hasTagFilter = !!tagSlugs && tagSlugs.length > 0;

	// selectDistinct so a post matching more than one selected tag isn't
	// duplicated by the postTags/tags join below.
	const query = db
		.selectDistinct({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			coverImage: posts.featuredImage,
			body: posts.body,
			createdAt: posts.createdAt,
			category: {
				name: categories.name,
				slug: categories.slug,
			},
			author: {
				name: sql<string>`'Janine'`,
				avatar: sql<string>`'/authors/janine.jpg'`,
			},
		})
		.from(posts)
		.innerJoin(categories, eq(posts.categoryId, categories.categoryId));

	// Conditionally add joins for tag filtering
	if (hasTagFilter) {
		query
			.innerJoin(postTags, eq(posts.id, postTags.postId))
			.innerJoin(tags, eq(postTags.tagId, tags.tagId));
	}

	const whereConditions = [eq(categories.slug, categorySlug)];
	if (hasTagFilter) {
		// Matches posts having ANY of the selected tags (OR semantics).
		whereConditions.push(inArray(tags.slug, tagSlugs as string[]));
	}

	const results = await query
		.where(and(...whereConditions))
		.orderBy(orderByClause)
		.limit(POSTS_PER_PAGE + 1)
		.offset(offset);

	const hasMore = results.length > POSTS_PER_PAGE;
	const paginatedPosts = results.slice(0, POSTS_PER_PAGE);

	// Manually construct the Post object to ensure type conformity and calculate derived fields.
	const finalPosts: Post[] = paginatedPosts.map((p) => {
		const wordCount = p.body?.split(/\s+/).filter(Boolean).length ?? 0;
		const readTimeMinutes = Math.ceil(wordCount / 225); // Average reading speed: 225 WPM

		// Create a concise excerpt without cutting words.
		const excerpt =
			p.body
				?.slice(0, 150)
				.trim()
				.replace(/\s+\S*$/, "...") ?? "";

		return {
			id: p.id,
			slug: p.slug,
			title: p.title,
			coverImage: p.coverImage as string,
			category: p.category,
			publishedAt: p.createdAt.toISOString(),
			readTimeMinutes,
			excerpt,
		};
	});

	return {
		posts: finalPosts,
		hasMore,
	};
}

/**
 * Efficiently counts the number of posts for a given category and optional tags,
 * capped at the number of posts per page. This is used to determine the
 * number of skeletons to show in a loading UI.
 * @returns A promise that resolves to the number of posts for the initial page.
 */
export async function getInitialPostCount({
	categorySlug,
	tagSlugs,
}: {
	categorySlug: string;
	tagSlugs?: string[];
}): Promise<number> {
	const hasTagFilter = !!tagSlugs && tagSlugs.length > 0;

	// Base query to count posts
	const query = db
		.select({ count: sql<number>`count(DISTINCT ${posts.id})`.mapWith(Number) })
		.from(posts)
		.innerJoin(categories, eq(posts.categoryId, categories.categoryId));

	// Conditionally add joins for tag filtering
	if (hasTagFilter) {
		query
			.innerJoin(postTags, eq(posts.id, postTags.postId))
			.innerJoin(tags, eq(postTags.tagId, tags.tagId));
	}

	const whereConditions = [eq(categories.slug, categorySlug)];
	if (hasTagFilter) {
		whereConditions.push(inArray(tags.slug, tagSlugs as string[]));
	}

	const [result] = await query.where(and(...whereConditions));
	return Math.min(result?.count ?? 0, POSTS_PER_PAGE);
}

export interface Tag {
	name: string;
	slug: string;
}

/**
 * Fetches all unique tags for posts within a specific category.
 * @param categorySlug The slug of the category.
 * @returns A promise that resolves to an array of tags.
 */
export async function getTagsByCategory(categorySlug: string): Promise<Tag[]> {
	if (!categorySlug) return [];

	const results = await db
		.select({
			name: tags.name,
			slug: tags.slug,
		})
		.from(tags)
		.innerJoin(postTags, eq(tags.tagId, postTags.tagId))
		.innerJoin(posts, eq(postTags.postId, posts.id))
		.innerJoin(categories, eq(posts.categoryId, categories.categoryId))
		.where(eq(categories.slug, categorySlug))
		.groupBy(tags.slug, tags.name);

	return results;
}

/**
 * Fetches a category's details by its slug.
 * @param categorySlug The slug of the category.
 * @returns A promise that resolves to the category object or null if not found.
 */
export async function getCategoryBySlug(categorySlug: string) {
	if (!categorySlug) return null;

	const [category] = await db
		.select({
			name: categories.name,
		})
		.from(categories)
		.where(eq(categories.slug, categorySlug));

	return category ?? null;
}
