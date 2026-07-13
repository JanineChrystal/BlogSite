export interface Category {
	slug: string;
	name: string;
	description: string;
	heroImage: string;
}

export interface Author {
	name: string;
	avatarUrl?: string;
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

export interface Tag {
	label: string;
	emphasized?: boolean;
}

interface BaseBlock {
	id: string;
}

/** Discriminated union: adding a new block type later = one new case in
 *  BlogBody's switch, zero changes to existing block components.
 *  This is the Open/Closed Principle applied to rich content rendering. */
export type ContentBlock =
	| (BaseBlock & { type: "paragraph"; text: string; lead?: boolean })
	| (BaseBlock & { type: "heading"; text: string })
	| (BaseBlock & { type: "quote"; lines: string[] })
	| (BaseBlock & {
			type: "callout";
			title: string;
			description: string;
			cta: { label: string; href: string };
	  });

export interface Reaction {
	id: string;
	label: string;
	icon: "droplet" | "flame" | "leaf" | "wind";
	count: number;
}

export interface Comment {
	id: string;
	author: Author;
	isAuthor?: boolean;
	content: string;
	timestamp: string;
	replies?: Comment[];
}

export interface PostDetail extends Post {
	author: Author;
	tags: Tag[];
	content: ContentBlock[];
	reactions: Reaction[];
	comments: Comment[];
	commentCount: number;
}
