export default function Loading() {
	return (
		<div className="w-full max-w-sm">
			<h1 className="mb-8 text-center font-heading text-headline-md text-on-surface">
				Chrystl.Blogs
				<span className="mt-1 block text-body-md font-normal text-on-surface-variant">
					Admin
				</span>
			</h1>
			<div className="animate-pulse space-y-4">
				<div className="h-12 w-full rounded-md bg-surface-container" />
				<div className="h-12 w-full rounded-md bg-surface-container" />
				<div className="h-12 w-full rounded-md bg-primary-container opacity-60" />
			</div>
		</div>
	);
}
