const PostHeroSkeleton = () => (
	<section className="relative flex h-179 min-h-150 w-full flex-col justify-end bg-black px-4 py-12 md:px-8 md:py-16">
		<div className="absolute inset-0 z-0 bg-zinc-900 opacity-40" />
		<div className="absolute inset-0 z-0 bg-linear-to-t from-black via-black/80 to-transparent" />
		<div className="relative z-10 mx-auto flex w-full max-w-300 flex-col items-start text-left">
			{/* Badges skeleton */}
			<div className="mb-4 flex gap-4">
				<div className="h-7 w-24 animate-pulse rounded bg-white/20" />
				<div className="h-7 w-20 animate-pulse rounded bg-white/20" />
			</div>
			{/* Title Skeleton */}
			<div className="mt-3 mb-4 h-16 w-4/5 animate-pulse rounded-md bg-white/20 md:mb-6 md:h-24" />
			{/* Meta Skeleton */}
			<div className="flex flex-wrap items-center gap-4">
				<div className="h-5 w-28 animate-pulse rounded-md bg-white/20" />
				<div className="h-5 w-36 animate-pulse rounded-md bg-white/20" />
				<div className="h-5 w-24 animate-pulse rounded-md bg-white/20" />
			</div>
		</div>
	</section>
);

const PostToolbarSkeleton = () => (
	<div className="border-b border-outline-variant/30 pb-6">
		<div className="h-5 w-96 max-w-full animate-pulse rounded-md bg-white/20" />
	</div>
);

const BlogBodySkeleton = () => (
	<div className="space-y-8">
		{/* Lead Paragraph */}
		<div className="space-y-3 text-lg">
			<div className="h-5 w-full animate-pulse rounded bg-white/20" />
			<div className="h-5 w-full animate-pulse rounded bg-white/20" />
			<div className="h-5 w-5/6 animate-pulse rounded bg-white/20" />
		</div>
		{/* Paragraph */}
		<div className="space-y-2">
			<div className="h-4 w-full animate-pulse rounded bg-white/20" />
			<div className="h-4 w-11/12 animate-pulse rounded bg-white/20" />
			<div className="h-4 w-2/3 animate-pulse rounded bg-white/20" />
		</div>
		{/* Heading */}
		<div className="pt-4">
			<div className="h-8 w-3/4 animate-pulse rounded bg-white/20" />
		</div>
		{/* Paragraph */}
		<div className="space-y-2">
			<div className="h-4 w-full animate-pulse rounded bg-white/20" />
			<div className="h-4 w-full animate-pulse rounded bg-white/20" />
			<div className="h-4 w-1/2 animate-pulse rounded bg-white/20" />
		</div>
		<div className="space-y-2">
			<div className="h-4 w-full animate-pulse rounded bg-white/20" />
			<div className="h-4 w-5/6 animate-pulse rounded bg-white/20" />
		</div>
	</div>
);

const ReactionPanelSkeleton = () => (
	<div className="mt-16 flex flex-col items-center border-t border-surface-container-high pt-8">
		<div className="mb-6 h-5 w-72 animate-pulse rounded-md bg-white/20" />
		<div className="flex gap-4 md:gap-8">
			<div className="flex flex-col items-center gap-2">
				<div className="size-16 animate-pulse rounded-full bg-white/20" />
				<div className="h-4 w-12 animate-pulse rounded-md bg-white/20" />
				<div className="h-3 w-4 animate-pulse rounded-md bg-white/20" />
			</div>
			<div className="flex flex-col items-center gap-2">
				<div className="size-16 animate-pulse rounded-full bg-white/20" />
				<div className="h-4 w-12 animate-pulse rounded-md bg-white/20" />
				<div className="h-3 w-4 animate-pulse rounded-md bg-white/20" />
			</div>
			<div className="flex flex-col items-center gap-2">
				<div className="size-16 animate-pulse rounded-full bg-white/20" />
				<div className="h-4 w-12 animate-pulse rounded-md bg-white/20" />
				<div className="h-3 w-4 animate-pulse rounded-md bg-white/20" />
			</div>
			<div className="flex flex-col items-center gap-2">
				<div className="size-16 animate-pulse rounded-full bg-white/20" />
				<div className="h-4 w-12 animate-pulse rounded-md bg-white/20" />
				<div className="h-3 w-4 animate-pulse rounded-md bg-white/20" />
			</div>
		</div>
	</div>
);

const CommentsSectionSkeleton = () => (
	<section className="mt-16 border-t border-surface-container-high pt-8">
		{/* Title */}
		<div className="mb-8 h-8 w-48 animate-pulse rounded-md bg-white/20" />

		{/* Comment Form Skeleton */}
		<div className="mb-8 space-y-4">
			<div className="h-24 w-full animate-pulse rounded-lg bg-white/20" />
			<div className="flex justify-end">
				<div className="h-10 w-28 animate-pulse rounded-lg bg-white/20" />
			</div>
		</div>

		{/* Comment Thread Skeleton */}
		<div className="space-y-8">
			<div className="flex gap-4">
				<div className="size-10 shrink-0 animate-pulse rounded-full bg-white/20" />
				<div className="w-full space-y-3">
					<div className="h-4 w-32 animate-pulse rounded-md bg-white/20" />
					<div className="space-y-2">
						<div className="h-4 animate-pulse rounded bg-white/20" />
						<div className="h-4 w-5/6 animate-pulse rounded bg-white/20" />
					</div>
				</div>
			</div>
			<div className="flex gap-4">
				<div className="size-10 shrink-0 animate-pulse rounded-full bg-white/20" />
				<div className="w-full space-y-3">
					<div className="h-4 w-32 animate-pulse rounded-md bg-white/20" />
					<div className="space-y-2">
						<div className="h-4 animate-pulse rounded bg-white/20" />
						<div className="h-4 w-5/6 animate-pulse rounded bg-white/20" />
					</div>
				</div>
			</div>
		</div>
	</section>
);

export default function PostPageLoading() {
	return (
		<div className="w-full bg-surface">
			<PostHeroSkeleton />

			<div className="mx-auto max-w-360 px-6 py-12 md:px-16">
				<PostToolbarSkeleton />
				<article className="mx-auto mt-10 max-w-3xl md:px-0">
					<BlogBodySkeleton />
					<ReactionPanelSkeleton />
					<CommentsSectionSkeleton />
				</article>
			</div>
		</div>
	);
}
