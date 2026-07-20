import { Suspense } from "react";
import { PostsTable } from "@/app/admin/components/tables/PostTable";
import {
	getAdminPostsList,
	getCategoriesForDropdown,
} from "@/lib/db/queries/post/post";

async function PostsDataWrapper() {
	// Execute the concurrent fetching inside this wrapper instead of the main page
	const [posts, categories] = await Promise.all([
		getAdminPostsList(),
		getCategoriesForDropdown(),
	]);

	// Return your interactive client table with the fetched data
	return <PostsTable initialData={posts} categories={categories} />;
}

export default function PostManagementPage() {
	return (
		<div className="flex-1 max-w-container-max mx-auto flex flex-col gap-stack-lg p-edge-margin w-full">
			{/* Header & Actions Bar */}
			<header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-surface-container-highest pb-6 gap-6">
				<div>
					<h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
						Post Management
					</h1>
					<p className="font-body-lg text-body-lg text-on-surface-variant">
						Oversee and orchestrate your editorial content.
					</p>
				</div>
			</header>

			<Suspense
				fallback={
					<div className="py-10 text-center font-body text-secondary">
						Loading posts...
					</div>
				}
			>
				{/* Interactive Data Table */}
				<PostsDataWrapper />
			</Suspense>
		</div>
	);
}
