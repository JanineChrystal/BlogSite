import Link from "next/link";
import { PostCard } from "@/src/components/ui/cards/postCard";

interface Post {
	id: string;
	title: string;
	categoryLabel?: string;
	imageUrl: string;
	slug: string;
}

interface CategorySectionProps {
	title: string;
	categorySlug: string;
	posts: Post[];
	cardOrientation?: "landscape" | "portrait";
}

export function CategorySection({
	title,
	categorySlug,
	posts,
	cardOrientation = "landscape",
}: CategorySectionProps) {
	// slice array to guarantee maximum of 3 posts per block
	const displayPosts = posts.slice(0, 3);

	return (
		<section className="py-8 md:py-12 px-4 md:px-8 bg-black">
			{/* section header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-2">
				<h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
					{title}
				</h2>
				<Link
					href={`/blog/${categorySlug}`}
					className="text-xs md:text-sm font-semibold text-zinc-400 hover:text-white transition"
				>
					View more &rarr;
				</Link>
			</div>

			{/* mobile first grid adjusting to tablet and desktop */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
				{displayPosts.map((post) => (
					<PostCard
						key={post.id}
						title={post.title}
						categoryLabel={post.categoryLabel}
						imageUrl={post.imageUrl}
						postSlug={post.slug}
						orientation={cardOrientation}
					/>
				))}
			</div>
		</section>
	);
}
