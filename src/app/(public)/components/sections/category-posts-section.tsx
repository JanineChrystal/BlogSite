import type { Post } from "@/lib/types/post";
import { LoadMoreButton } from "@/src/components/ui/buttons/load-more-button";
import { BlogGrid } from "./blog-grid";
import { CategoryToolbar } from "./category-toolbar";

interface CategoryPostsSectionProps {
	categoryName: string;
	posts: Post[];
	hasMore?: boolean;
}

export function CategoryPostsSection({
	categoryName,
	posts,
	hasMore = false,
}: CategoryPostsSectionProps) {
	return (
		<section className="mx-auto max-w-360 px-6 py-12 md:px-16">
			<CategoryToolbar categoryName={categoryName} />
			<div className="mt-10">
				<BlogGrid posts={posts} />
			</div>
			<div className="mt-12 flex justify-center">
				<LoadMoreButton hasMore={hasMore} />
			</div>
		</section>
	);
}
