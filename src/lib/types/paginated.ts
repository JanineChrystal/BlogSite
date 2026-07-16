import type { Post } from "@/lib/types/post";

export interface PaginatedPosts {
	posts: Post[];
	hasMore: boolean;
}
