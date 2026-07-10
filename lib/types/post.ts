export interface Category {
	slug: string;
	name: string;
	description: string;
	heroImage: string;
}

export interface Post {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	coverImage: string;
	readTimeMinutes: number;
	category: Pick<Category, "slug" | "name">;
	publishedAt: string; // ISO 8601
}
