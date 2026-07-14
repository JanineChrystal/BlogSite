"use client";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { searchPosts } from "@/lib/actions/search";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../input-group/input-group";

type SearchResult = {
	id: string;
	title: string;
	slug: string;
	categoryName: string | null;
};

export function SearchBar() {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const searchContainerRef = useRef<HTMLDivElement>(null);

	// Debounce search requests
	useEffect(() => {
		// Don't search for very short queries
		if (query.trim().length < 2) {
			setResults([]);
			return;
		}

		const debounceTimer = setTimeout(async () => {
			setIsLoading(true);
			const searchResults = await searchPosts(query);
			setResults(searchResults);
			setIsLoading(false);
		}, 300); // 300ms delay

		return () => clearTimeout(debounceTimer);
	}, [query]);

	// Effect to handle clicks outside the search component to close the dropdown
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				searchContainerRef.current &&
				!searchContainerRef.current.contains(event.target as Node)
			) {
				setIsFocused(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!query.trim()) return;
		// On form submission, navigate to the full search results page
		router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		setIsFocused(false);
	};

	const handleResultClick = () => {
		setQuery("");
		setResults([]);
		setIsFocused(false);
	};

	return (
		<div className="relative w-full" ref={searchContainerRef}>
			<form onSubmit={handleSearchSubmit} className="w-full">
				<InputGroup className="w-full">
					<InputGroupInput
						placeholder="Search..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setIsFocused(true)}
					/>
					<InputGroupAddon>
						{isLoading ? (
							<Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
						) : (
							<Search className="h-4 w-4 text-zinc-400" />
						)}
					</InputGroupAddon>
				</InputGroup>
			</form>

			{isFocused && query.trim().length > 1 && (
				<div className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto rounded-md bg-zinc-900 border border-zinc-800 shadow-lg z-50">
					{!isLoading && results.length === 0 && query.trim().length > 1 ? (
						<p className="p-4 text-sm text-zinc-400">
							No results for &quot;{query}&quot;
						</p>
					) : (
						<ul className="divide-y divide-zinc-800">
							{results.map((post) => (
								<li key={post.id}>
									<Link
										href={`/blog-post/${post.slug}`}
										className="block p-4 hover:bg-zinc-800 transition-colors"
										onClick={handleResultClick}
									>
										<p className="font-semibold text-white">{post.title}</p>
										{post.categoryName && (
											<p className="text-xs text-zinc-400">
												{post.categoryName}
											</p>
										)}
									</Link>
								</li>
							))}
							{results.length > 0 && (
								<li>
									<Link
										href={`/search?q=${encodeURIComponent(query.trim())}`}
										className="block p-4 text-center text-sm font-semibold text-red-500 hover:bg-zinc-800 transition-colors"
										onClick={handleResultClick}
									>
										View all results
									</Link>
								</li>
							)}
						</ul>
					)}
				</div>
			)}
		</div>
	);
}
