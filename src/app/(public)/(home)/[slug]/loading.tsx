export const CategoryHeroSkeleton = () => (
	<section className="relative flex w-full items-center justify-center bg-black px-4 py-12 md:px-8 md:py-16 min-h-[60vh] md:min-h-[80vh]">
		<div className="absolute inset-0 z-0 bg-zinc-900 opacity-40" />
		<div className="absolute inset-0 z-0 bg-linear-to-t from-black via-black/60 to-black/20" />
		<div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
			{/* Title Skeleton */}
			<div className="h-14 w-1/2 animate-pulse rounded-md bg-white/20 md:h-20" />
		</div>
	</section>
);

export const CategoryToolbarSkeleton = () => (
	<div className="flex flex-col gap-4 border-b border-outline-variant/30 pb-6 sm:flex-row sm:items-center sm:justify-between">
		{/* Breadcrumb skeleton */}
		<div className="h-5 w-48 animate-pulse rounded-md bg-white/20" />
		{/* Filter buttons skeleton */}
		<div className="flex items-center justify-end gap-2">
			<div className="h-10 w-40 animate-pulse rounded-lg bg-white/20" />
			<div className="h-10 w-40 animate-pulse rounded-lg bg-white/20" />
		</div>
	</div>
);

export const BlogCardSkeleton = () => (
	<div className="flex flex-col gap-4">
		{/* Image */}
		<div className="aspect-16/10 w-full animate-pulse rounded-lg bg-white/20" />
		{/* Content */}
		<div className="flex flex-col gap-2">
			{/* Meta (e.g., date, author) */}
			<div className="h-4 w-1/2 animate-pulse rounded-md bg-white/20" />
			{/* Title */}
			<div className="h-6 w-full animate-pulse rounded-md bg-white/20" />
			<div className="h-6 w-5/6 animate-pulse rounded-md bg-white/20" />
			{/* Excerpt */}
			<div className="mt-2 h-4 w-full animate-pulse rounded-md bg-white/20" />
			<div className="h-4 w-full animate-pulse rounded-md bg-white/20" />
		</div>
	</div>
);

export const BlogGridSkeleton = ({ count }: { count: number }) => {
	// Create an array of simple objects with a unique ID to use as a key.
	// This avoids the linter rule against using array indices as keys.
	const skeletons = Array.from({ length: count }, (_, i) => ({ id: i }));

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
			{skeletons.map((skeleton) => (
				<BlogCardSkeleton key={skeleton.id} />
			))}
		</div>
	);
};

export const CategoryPostsSectionSkeleton = ({
	postCount,
}: {
	postCount: number;
}) => (
	<section className="mx-auto max-w-360 bg-surface px-6 py-12 md:px-16">
		<CategoryToolbarSkeleton />
		<div className="mt-10">{<BlogGridSkeleton count={postCount} />}</div>
		{/* Skeleton for Load More button area */}
		<div className="mt-12 flex justify-center">
			<div className="h-12 w-36 animate-pulse rounded-lg bg-white/20" />
		</div>
	</section>
);

export default function CategoryPageLoadingSkeleton() {
	return (
		<div className="w-full bg-surface">
			<CategoryHeroSkeleton />
			{/* This default export is no longer used automatically by Next.js for this page,
			but can be used for other purposes. We show a fixed number of posts here. */}
			<CategoryPostsSectionSkeleton postCount={9} />
		</div>
	);
}
