import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/data/post";
import { formatDate } from "@/lib/utils/format-date";
import { BlogBody } from "@/src/app/(public)/components/ui/blog-body";
import { ReactionPanel } from "@/src/app/(public)/components/ui/reaction-panel";
import { CommentsSection } from "../../components/sections/comment-section";
import { HeroSection } from "../../components/sections/hero";

interface PostPageProps {
	params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
	const { slug } = await params;

	const post = await getPostBySlug(slug);
	if (!post) notFound();

	return (
		<div className="w-full bg-surface">
			<HeroSection
				variant="post"
				backgroundImage={post.coverImage}
				backgroundAlt={post.title}
				badges={post.tags}
				title={post.title}
				meta={[
					`By ${post.author.name}`,
					formatDate(post.publishedAt),
					`${post.readTimeMinutes} Min Read`,
				]}
			/>

			<article className="mx-auto max-w-3xl px-6 py-12 md:px-0">
				<BlogBody blocks={post.content} />
				<ReactionPanel reactions={post.reactions} />
				<CommentsSection
					initialComments={post.comments}
					commentCount={post.commentCount}
				/>
			</article>
		</div>
	);
}
