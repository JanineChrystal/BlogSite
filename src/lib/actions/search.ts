"use server";

import { type SearchResult, searchPosts as searchPostsDb } from "@/lib/data";

/**
 * Server Action to search for posts.
 * @param query The search term.
 * @returns A promise that resolves to an array of search results.
 */
export async function searchPosts(query: string): Promise<SearchResult[]> {
	return searchPostsDb(query);
}
