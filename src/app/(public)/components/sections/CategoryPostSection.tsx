import { LoadMoreButton } from "@/components/ui/buttons/LoadMoreButton";
import type { Post } from "@/lib/types/post";
import { BlogGrid } from "../ui/BlogGrid";
import { CategoryToolbar, type Tag } from "../ui/CategoryToolBar";

interface CategoryPostsSectionProps {
	categoryName: string;
	posts: Post[];
	tags: Tag[];
	hasMore?: boolean;
}

export function CategoryPostsSection({
	categoryName,
	posts,
	tags,
	hasMore = false,
}: CategoryPostsSectionProps) {
	return (
		<section className="mx-auto max-w-360 px-6 py-12 md:px-16">
			<CategoryToolbar categoryName={categoryName} tags={tags} />
			<div className="mt-10">
				<BlogGrid posts={posts} />
			</div>
			<div className="mt-12 flex justify-center">
				<LoadMoreButton hasMore={hasMore} />
			</div>
		</section>
	);
}
