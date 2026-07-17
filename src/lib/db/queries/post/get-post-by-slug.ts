import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { comments as commentsTable, posts } from "@/lib/db/schema";
import type { Comment, ContentBlock, PostDetail } from "@/lib/types/post";
import { formatDate } from "@/lib/utils/format-date";

export async function getPostBySlug(
	slug: string,
): Promise<PostDetail | undefined> {
	const data = await db.query.posts.findFirst({
		where: and(eq(posts.slug, slug), isNull(posts.deletedAt)),
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
				where: isNull(commentsTable.deletedAt),
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

	let content: ContentBlock[];
	try {
		content = JSON.parse(data.body);
	} catch {
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
			timestamp: formatDate(c.createdAt.toISOString()),
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
		(block): block is Extract<ContentBlock, { type: "paragraph" }> =>
			block.type === "paragraph" && !!block.text,
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
