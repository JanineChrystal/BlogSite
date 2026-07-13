import { BlogCard } from "@/components/ui/cards/blog-card";
import type { Post } from "@/lib/types/post";

interface BlogGridProps {
	posts: Post[];
}

export function BlogGrid({ posts }: BlogGridProps) {
	if (posts.length === 0) {
		return (
			<p className="py-16 text-center font-body text-body-md text-on-surface/60">
				No articles found in this category yet.
			</p>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
			{posts.map((post) => (
				<BlogCard key={post.id} post={post} />
			))}
		</div>
	);
}
