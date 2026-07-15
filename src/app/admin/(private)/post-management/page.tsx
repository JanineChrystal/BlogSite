import { PostsTable } from "@/app/admin/components/tables/post-table";
import {
	getAdminPostsList,
	getCategoriesForDropdown,
} from "@/lib/db/queries/post";

export default async function PostManagementPage() {
	// Concurrent fetching for optimal server performance
	const [posts, categories] = await Promise.all([
		getAdminPostsList(),
		getCategoriesForDropdown(),
	]);

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

			{/* Interactive Data Table */}
			<PostsTable initialData={posts} categories={categories} />
		</div>
	);
}
