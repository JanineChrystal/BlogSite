import type { Category, Post } from "@/lib/types/post";

const CATEGORIES: Category[] = [
	{
		slug: "travel-lifestyle",
		name: "Travel & Lifestyle",
		description:
			"Exploring the world and the way we live in it. Immersive stories, striking destinations, and the pulse of modern nomadism.",
		heroImage: "/categories/travel-lifestyle-hero.jpg",
	},
];

const POSTS: Post[] = [
	{
		id: "1",
		slug: "hidden-temples-of-kyoto",
		title: "The Hidden Temples of Kyoto",
		excerpt:
			"Beyond the crowded paths lie serene sanctuaries where time stands still. Discover the unspoken rules of temple etiquette.",
		coverImage: "/posts/kyoto-temple.jpg",
		readTimeMinutes: 8,
		category: { slug: "travel-lifestyle", name: "Destinations" },
		publishedAt: "2026-06-01T00:00:00.000Z",
	},
	{
		id: "2",
		slug: "digital-nomad-essentials",
		title: "Digital Nomad Essentials",
		excerpt:
			"Curating the ultimate setup for remote work anywhere in the world. From high-performance gear to the minimalist mindset.",
		coverImage: "/posts/nomad-desk.jpg",
		readTimeMinutes: 12,
		category: { slug: "travel-lifestyle", name: "Lifestyle" },
		publishedAt: "2026-05-20T00:00:00.000Z",
	},
	{
		id: "3",
		slug: "midnight-street-food-trails",
		title: "Midnight Street Food Trails",
		excerpt:
			"When the sun sets, the real flavors emerge. A deep dive into the chaotic, vibrant, and incredibly diverse world of night markets.",
		coverImage: "/posts/street-food.jpg",
		readTimeMinutes: 6,
		category: { slug: "travel-lifestyle", name: "Culinary" },
		publishedAt: "2026-05-10T00:00:00.000Z",
	},
	{
		id: "4",
		slug: "brutalist-retreats",
		title: "Brutalist Retreats",
		excerpt:
			"Finding luxury in raw concrete and monumental spaces. Exploring the growing trend of stark, minimalist accommodations designed for total sensory deprivation and focus.",
		coverImage: "/posts/brutalist.jpg",
		readTimeMinutes: 10,
		category: { slug: "travel-lifestyle", name: "Design" },
		publishedAt: "2026-04-28T00:00:00.000Z",
	},
	{
		id: "5",
		slug: "the-perfect-carry-on",
		title: "The Perfect Carry-On",
		excerpt:
			"An exhaustive review of premium luggage designed to survive the rigors of constant travel without compromising on style.",
		coverImage: "/posts/carry-on.jpg",
		readTimeMinutes: 5,
		category: { slug: "travel-lifestyle", name: "Gear" },
		publishedAt: "2026-04-15T00:00:00.000Z",
	},
	{
		id: "6",
		slug: "navigating-megacities",
		title: "Navigating Megacities",
		excerpt:
			"Survival tactics and hidden gems in the world's most overwhelming urban jungles. How to find the pulse of a city in 48 hours.",
		coverImage: "/posts/megacity.jpg",
		readTimeMinutes: 15,
		category: { slug: "travel-lifestyle", name: "Guides" },
		publishedAt: "2026-03-30T00:00:00.000Z",
	},
];

const DEFAULT_PAGE_SIZE = 6;

export async function getAllCategories(): Promise<Category[]> {
	return CATEGORIES;
}

export async function getCategoryBySlug(
	slug: string,
): Promise<Category | undefined> {
	return CATEGORIES.find((c) => c.slug === slug);
}

export interface PaginatedPosts {
	posts: Post[];
	hasMore: boolean;
}

export async function getPostsByCategory(
	slug: string,
	{ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {},
): Promise<PaginatedPosts> {
	const all = POSTS.filter((p) => p.category.slug === slug);
	const start = (page - 1) * pageSize;
	const end = start + pageSize;

	return {
		posts: all.slice(start, end),
		hasMore: end < all.length,
	};
}
