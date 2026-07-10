import type {
	Category,
	Comment,
	Post,
	PostDetail,
	Reaction,
} from "@/lib/types/post";

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

const POST_DETAILS: Record<string, PostDetail> = {
	"echoes-of-the-nebula": {
		id: "sci-fi-1",
		slug: "echoes-of-the-nebula",
		title: "Echoes of the Nebula: A Visual Masterpiece",
		excerpt:
			"The latest installment in the cosmic saga doesn't just push the boundaries of visual effects; it shatters them entirely.",
		coverImage: "/posts/echoes-of-the-nebula-hero.jpg",
		readTimeMinutes: 12,
		category: {
			slug: "entertainment-reviews",
			name: "Entertainment & Reviews",
		},
		publishedAt: "2024-10-24T00:00:00.000Z",
		author: { name: "Chrystl", avatarUrl: "/authors/chrystl.jpg" },
		tags: [{ label: "Sci-Fi", emphasized: true }, { label: "Review" }],
		content: [
			{
				id: "p1",
				type: "paragraph",
				lead: true,
				text: "The latest installment in the cosmic saga doesn't just push the boundaries of visual effects; it shatters them entirely, leaving audiences in a state of suspended awe. Directed by a visionary who understands that silence in a vacuum is as powerful as an explosion, the film is a masterclass in atmospheric storytelling.",
			},
			{
				id: "p2",
				type: "paragraph",
				text: "From the opening sequence—a harrowing ten-minute unedited tracking shot through the debris of a shattered moon—the stakes are immediately established not through exposition, but through the visceral reality of survival in the void. The use of pure black space, contrasting sharply against the stark, blinding whites of stellar phenomena, creates a visual language that feels both isolating and intimately beautiful.",
			},
			{
				id: "c1",
				type: "callout",
				title: "Experience the Epic at Home",
				description:
					"Upgrade your home theater setup. Get the exclusive 4K Ultra HD Boxset with behind-the-scenes documentary.",
				cta: { label: "Pre-order Now", href: "#" },
			},
			{ id: "h1", type: "heading", text: "The Poetics of the Void" },
			{
				id: "p3",
				type: "paragraph",
				text: "What elevates the narrative is its pacing. It eschews the frantic editing typical of modern blockbusters for a more deliberate, almost hypnotic rhythm. Conversations between characters occur over vast distances, plagued by the agonizing delay of light-speed communication, forcing a haunting poetry into their dialogue.",
			},
			{
				id: "q1",
				type: "quote",
				lines: [
					'"We are but dust,',
					"Reflecting the dying light",
					"Of stars that burnt out",
					'A million lifetimes ago."',
				],
			},
			{
				id: "p4",
				type: "paragraph",
				text: "This interplay between immense cosmic scale and fragile human emotion is the film's core triumph. It demands your absolute attention, drawing you into its deep blacks and blinding highlights, making you feel the terrifying chill of deep space right in your theater seat.",
			},
		],
		reactions: [
			{ id: "deep", label: "Deep", icon: "droplet", count: 1200 },
			{ id: "hot-take", label: "Hot Take", icon: "flame", count: 456 },
			{ id: "grounded", label: "Grounded", icon: "leaf", count: 89 },
			{ id: "fresh", label: "Fresh", icon: "wind", count: 302 },
		],
		commentCount: 24,
		comments: [
			{
				id: "cm1",
				author: { name: "Cinephile99" },
				content:
					"That opening tracking shot was absolutely insane. The contrast ratio alone deserves an award. I felt like I couldn't breathe until the title card hit.",
				timestamp: "2 hours ago",
				replies: [
					{
						id: "cm1-r1",
						author: { name: "Chrystl", avatarUrl: "/authors/chrystl.jpg" },
						isAuthor: true,
						content:
							"Exactly! The sound design playing against the absolute silence of space in that scene was masterful. It forces you to focus entirely on the visual desperation.",
						timestamp: "1 hour ago",
					},
				],
			},
		],
	},
};

const EMPTY_REACTIONS: Reaction[] = [
	{ id: "deep", label: "Deep", icon: "droplet", count: 0 },
	{ id: "hot-take", label: "Hot Take", icon: "flame", count: 0 },
	{ id: "grounded", label: "Grounded", icon: "leaf", count: 0 },
	{ id: "fresh", label: "Fresh", icon: "wind", count: 0 },
];

export async function getPostBySlug(
	slug: string,
): Promise<PostDetail | undefined> {
	if (POST_DETAILS[slug]) return POST_DETAILS[slug];

	// TO DO: a minimal-but-valid PostDetail from the lightweight card data instead of 404ing.
	const summary = POSTS.find((p) => p.slug === slug);
	if (!summary) return undefined;

	const comments: Comment[] = [];
	return {
		...summary,
		author: { name: "Chrystl" },
		tags: [{ label: summary.category.name, emphasized: true }],
		content: [
			{ id: "p1", type: "paragraph", lead: true, text: summary.excerpt },
		],
		reactions: EMPTY_REACTIONS,
		comments,
		commentCount: 0,
	};
}

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
