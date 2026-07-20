import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BlogBody } from "@/app/(public)/components/ui/BlogBody";
import { ReactionPanel } from "@/app/(public)/components/ui/ReactionPanel";
import { getPostBySlug } from "@/lib/db/queries/post/get-post-by-slug";
import { formatDate } from "@/lib/utils/format-date";
import { CommentsSection } from "../../../components/sections/CommentSection";
import { HeroSection } from "../../../components/sections/HeroSection";
import { CategoryToolbar } from "../../../components/ui/CategoryToolBar";

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

			<div className="mx-auto max-w-360 px-6 py-12 md:px-16">
				<CategoryToolbar
					categoryName={post.category.name}
					categorySlug={post.category.slug}
					postTitle={post.title}
				/>
				<article className="mx-auto mt-10 max-w-3xl md:px-0">
					<BlogBody blocks={post.content} />
					<ReactionPanel
						reactions={post.reactions}
						postId={post.id}
						slug={slug}
					/>
					<Suspense
						fallback={
							<div className="py-10 text-center font-body text-secondary">
								Loading comments...
							</div>
						}
					>
						<CommentsSection postId={post.id} slug={slug} />
					</Suspense>
				</article>
			</div>
		</div>
	);
}
