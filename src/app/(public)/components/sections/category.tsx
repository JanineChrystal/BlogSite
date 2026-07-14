"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { PostCard } from "@/components/ui/cards/postCard";
import { cn } from "@/lib/utils/utils";

interface Post {
	id: string;
	title: string;
	categoryLabel?: string | null;
	imageUrl: string;
	slug: string;
}

interface CategorySectionProps {
	id: string;
	title: string;
	posts: Post[];
	cardOrientation?: "landscape" | "portrait";
	layout?: "grid" | "carousel";
	captionEmphasis?: "bold" | "medium";
}

export function CategorySection({
	id,
	title,
	posts,
	cardOrientation = "landscape",
	layout = "grid",
	captionEmphasis = "bold",
}: CategorySectionProps) {
	const scrollerRef = useRef<HTMLDivElement>(null);

	// Only show the category label if the section is "What's New".
	const showCategoryLabel = id === "whats-new";

	// scrollByPage is the function to scroll the carousel
	function scrollByPage(direction: "left" | "right") {
		const el = scrollerRef.current;
		if (!el) return;
		const amount = el.clientWidth * 0.8;
		el.scrollBy({
			left: direction === "left" ? -amount : amount,
			behavior: "smooth",
		});
	}

	if (posts.length === 0) return null;

	// The section header is now consistent for both layouts
	const sectionHeader = (
		<div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-2">
			<h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
				{title}
			</h2>
			{id !== "whats-new" && (
				<Link
					href={`/category/${id}`}
					className="text-xs md:text-sm font-semibold text-zinc-400 hover:text-white transition"
				>
					View more &rarr;
				</Link>
			)}
		</div>
	);

	// Conditional rendering for the carousel layout
	if (layout === "carousel") {
		const cardWidthClass =
			cardOrientation === "landscape"
				? "w-[300px] md:w-[400px]"
				: "w-[160px] md:w-[220px]";

		return (
			<section className="py-8 md:py-12 bg-black">
				<div className="px-4 md:px-8">{sectionHeader}</div>
				<div className="group/carousel relative">
					<button
						type="button"
						onClick={() => scrollByPage("left")}
						aria-label={`Scroll ${title} left`}
						className="absolute inset-y-0 left-0 z-30 flex w-10 items-center justify-center bg-linear-to-r from-black to-transparent opacity-0 transition-opacity md:w-16 group-hover/carousel:opacity-100"
					>
						<ChevronLeft className="size-8 text-white transition-transform hover:scale-125" />
					</button>

					<div
						ref={scrollerRef}
						className="no-scrollbar flex snap-x gap-4 overflow-x-auto px-4 pb-8 pt-4 md:px-8"
					>
						{posts.map((post) => (
							<PostCard
								key={post.id}
								title={post.title}
								categoryLabel={
									showCategoryLabel ? post.categoryLabel : undefined
								}
								imageUrl={post.imageUrl}
								postSlug={post.slug}
								orientation={cardOrientation}
								captionEmphasis={captionEmphasis}
								className={cn("flex-none snap-start", cardWidthClass)}
							/>
						))}
					</div>

					<button
						type="button"
						onClick={() => scrollByPage("right")}
						aria-label={`Scroll ${title} right`}
						className="absolute inset-y-0 right-0 z-30 flex w-10 items-center justify-center bg-linear-to-l from-black to-transparent opacity-0 transition-opacity md:w-16 group-hover/carousel:opacity-100"
					>
						<ChevronRight className="size-8 text-white transition-transform hover:scale-125" />
					</button>
				</div>
			</section>
		);
	}

	// Default grid layout
	const displayPosts = posts.slice(0, 3);

	return (
		<section className="py-8 md:py-12 px-4 md:px-8 bg-black">
			{sectionHeader}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
				{displayPosts.map((post) => (
					<PostCard
						key={post.id}
						title={post.title}
						categoryLabel={showCategoryLabel ? post.categoryLabel : undefined}
						imageUrl={post.imageUrl}
						postSlug={post.slug}
						orientation={cardOrientation}
					/>
				))}
			</div>
		</section>
	);
}
