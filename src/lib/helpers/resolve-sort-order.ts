import { asc, desc, sql } from "drizzle-orm";
import { posts } from "@/lib/db/schema";

/** Resolves the requested sort key to a Drizzle order-by expression.
 *  Returning from a function (rather than assigning an untyped `let`
 *  across a switch) lets TypeScript infer the union type from the
 *  return statements themselves — no `any`, no manual type import needed. */
export function resolveSortOrder(sort: string) {
	switch (sort) {
		case "oldest":
			return asc(posts.createdAt);
		case "read-time":
			// Approximates "quickest read" via body length until a real
			// word-count/read-time column exists on the posts table.
			return asc(sql<number>`length(${posts.body})`);
		default:
			return desc(posts.createdAt);
	}
}
