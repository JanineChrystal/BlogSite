import { desc, eq } from "drizzle-orm";
import { db } from "./db/index";
import { categories, posts } from "./db/schema";

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
		.where(eq(categories.slug, "products-review"))
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
