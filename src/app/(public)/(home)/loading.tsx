const HeroSectionSkeleton = () => (
	<section className="relative flex w-full items-center bg-black px-4 py-12 md:px-8 md:py-16 min-h-[max(85vh,600px)]">
		<div className="absolute inset-0 z-0 bg-zinc-900 opacity-40" />
		<div className="absolute inset-0 z-0 bg-linear-to-t from-black via-black/80 to-transparent md:bg-linear-to-r" />

		<div className="relative z-10 mt-12 flex w-full max-w-2xl flex-col items-start text-left text-white md:mt-0">
			{/* Tags Skeleton */}
			<div className="mb-8 flex flex-wrap justify-center gap-2 md:justify-start md:space-x-3">
				<div className="h-6 w-28 animate-pulse rounded-full bg-white/20" />
			</div>

			{/* Title Skeleton */}
			<div className="mb-4 mt-3 h-12 w-full animate-pulse rounded-md bg-white/20 sm:h-14 md:h-16" />
			<div className="mb-6 h-12 w-3/4 animate-pulse rounded-md bg-white/20 sm:h-14 md:h-16" />

			{/* Action Button Skeleton */}
			<div className="mt-4 h-14 w-44 animate-pulse rounded-lg bg-white/20 md:py-6" />
		</div>
	</section>
);

const PostCardSkeleton = () => (
	<div className="space-y-3">
		<div className="aspect-video w-full animate-pulse rounded-lg bg-white/20" />
		<div className="space-y-2">
			<div className="h-5 w-3/4 animate-pulse rounded-md bg-white/20" />
			<div className="h-4 w-1/2 animate-pulse rounded-md bg-white/20" />
		</div>
	</div>
);

const CategorySectionGridSkeleton = () => (
	<section className="bg-black px-4 py-8 md:px-8 md:py-12">
		{/* Section Header Skeleton */}
		<div className="mb-6 flex items-end justify-between gap-2 md:mb-8">
			<div className="h-8 w-1/2 animate-pulse rounded-md bg-white/20 md:w-1/3" />
			<div className="h-5 w-24 animate-pulse rounded-md bg-white/20" />
		</div>
		{/* Post Grid Skeleton */}
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
			<PostCardSkeleton />
			<PostCardSkeleton />
			<PostCardSkeleton />
		</div>
	</section>
);

const CategorySectionCarouselSkeleton = () => (
	<section className="bg-black py-8 md:py-12">
		<div className="px-4 md:px-8">
			{/* Section Header Skeleton (no "View more") */}
			<div className="mb-6 flex items-end justify-between gap-2 md:mb-8">
				<div className="h-8 w-1/2 animate-pulse rounded-md bg-white/20 md:w-1/3" />
			</div>
		</div>
		<div className="relative">
			<div className="no-scrollbar flex snap-x gap-4 overflow-x-auto px-4 pb-8 pt-4 md:px-8">
				<div className="w-75 flex-none snap-start md:w-100">
					<PostCardSkeleton />
				</div>
				<div className="w-75 flex-none snap-start md:w-100">
					<PostCardSkeleton />
				</div>
				<div className="w-75 flex-none snap-start md:w-100">
					<PostCardSkeleton />
				</div>
				<div className="w-75 flex-none snap-start md:w-100">
					<PostCardSkeleton />
				</div>
			</div>
		</div>
	</section>
);

export default function HomePageLoading() {
	return (
		<div className="block w-full">
			<HeroSectionSkeleton />
			<CategorySectionCarouselSkeleton />
			<CategorySectionGridSkeleton />
			<CategorySectionGridSkeleton />
			<CategorySectionGridSkeleton />
		</div>
	);
}
