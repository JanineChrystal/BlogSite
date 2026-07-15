"use client";

import { useEffect, useRef, useState } from "react";
import { type SortColumn, usePostSort } from "@/app/hooks/usePostSort";
import { Button } from "@/components/ui/buttons/button";
import { POST_TABLE_HEADERS } from "../../constants/table-headers";
import { DeletePostButton } from "../ui/buttons/delete-button";
import { CreatePostDialog } from "../ui/dialogs/create-post/create-post-dialog";

interface PostItem {
	id: string;
	title: string;
	slug: string;
	status: string;
	createdAt: Date;
	categoryName: string | null;
}

interface PostsTableProps {
	initialData: PostItem[];
	categories: { categoryId: string; name: string }[];
}

export function PostsTable({ initialData, categories }: PostsTableProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const [isSearchExpanded, setIsSearchExpanded] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isSearchExpanded && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isSearchExpanded]);

	const filteredPosts = initialData.filter((post) =>
		post.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const { sortedData, sortColumn, sortDirection, handleSort } =
		usePostSort(filteredPosts);

	const renderSortIcon = (column: SortColumn) => {
		if (sortColumn !== column) {
			return (
				<span className="material-symbols-outlined text-[16px] text-on-surface-variant/50 group-hover:text-on-surface-variant transition-colors">
					unfold_more
				</span>
			);
		}
		return (
			<span className="material-symbols-outlined text-[16px] text-primary-container">
				{sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
			</span>
		);
	};

	return (
		<div className="flex flex-col gap-6 w-full mt-5">
			{/* Search Bar */}
			<div className="flex justify-between items-center w-full">
				{/* Mobile Search Icon Button - Only visible on small screens when search is closed */}
				{!isSearchExpanded && (
					<button
						type="button"
						onClick={() => setIsSearchExpanded(true)}
						className="md:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-white/10"
						title="Open Search"
					>
						<span className="material-symbols-outlined text-2xl">search</span>
					</button>
				)}

				{/* Search Input Container - Hidden on mobile unless expanded, always visible on desktop */}
				<div
					className={`relative w-full md:w-96 transition-all duration-300 ${
						isSearchExpanded ? "block" : "hidden md:block"
					}`}
				>
					<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
						search
					</span>
					<input
						ref={searchInputRef}
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full bg-[#141414] border-none text-on-surface pl-12 pr-12 py-3 rounded-DEFAULT focus:ring-0 focus:border-b-2 focus:border-b-primary-container transition-all placeholder:text-on-surface-variant/50 font-body-md text-body-md"
						placeholder="Search posts..."
					/>

					{/* Mobile Close Button - Allows user to collapse the search bar and clear the query */}
					{isSearchExpanded && (
						<button
							type="button"
							onClick={() => {
								setIsSearchExpanded(false);
								setSearchQuery("");
							}}
							className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-white/10"
							title="Close Search"
						>
							<span className="material-symbols-outlined text-[20px]">
								close
							</span>
						</button>
					)}
				</div>
				<div className={isSearchExpanded ? "hidden sm:block" : "block"}>
					<CreatePostDialog categories={categories} />
				</div>
			</div>

			<div className="bg-[#141414]/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden w-full">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-white/5 bg-white/5">
								{POST_TABLE_HEADERS.map((header) => (
									<th
										key={header.label}
										className={`py-4 px-6 font-label-sm text-label-sm uppercase tracking-widest whitespace-nowrap ${
											header.alignRight ? "text-right" : ""
										} ${!header.sortKey ? "text-on-surface-variant" : ""}`}
									>
										{header.sortKey ? (
											<button
												type="button"
												onClick={() =>
													header.sortKey && handleSort(header.sortKey)
												}
												className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors group outline-none"
											>
												{header.label}
												{renderSortIcon(header.sortKey)}
											</button>
										) : (
											header.label
										)}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-white/5 font-body-md text-body-md">
							{/* Simple comment: This MUST be sortedData so the table reacts to the column clicks! */}
							{sortedData.map((post) => (
								<tr
									key={post.id}
									className="hover:bg-white/2 transition-colors group"
								>
									<td className="py-5 px-6">
										<div className="font-medium text-on-surface group-hover:text-primary-container transition-colors">
											{post.title}
										</div>
									</td>
									<td className="py-5 px-6 text-on-surface-variant">
										{post.categoryName || "Uncategorized"}
									</td>
									<td className="py-5 px-6 text-on-surface-variant">
										{new Date(post.createdAt).toLocaleDateString("en-US", {
											month: "short",
											day: "2-digit",
											year: "numeric",
										})}
									</td>
									<td className="py-5 px-6">
										{post.status === "published" ? (
											<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-label-sm text-label-sm border border-emerald-500/20">
												<span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
												PUBLISHED
											</span>
										) : (
											<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-label-sm text-label-sm border border-amber-500/20">
												<span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
												DRAFT
											</span>
										)}
									</td>
									<td className="py-5 px-6 text-right">
										<DeletePostButton postId={post.id} />
									</td>
								</tr>
							))}
							{sortedData.length === 0 && (
								<tr>
									<td
										colSpan={5}
										className="py-8 text-center text-on-surface-variant"
									>
										No posts found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div className="border-t border-white/5 p-8 flex justify-center bg-[#131313]">
					<Button
						type="button"
						className="px-8 py-3 rounded-DEFAULT border border-primary-container/30 bg-white/5 text-on-surface font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-container hover:text-white transition-all duration-200 h-auto"
					>
						Load more...
					</Button>
				</div>
			</div>
		</div>
	);
}
