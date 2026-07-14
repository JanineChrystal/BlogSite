"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/ui/search/search";

export function Navbar() {
	const [isSearchExpanded, setIsSearchExpanded] = useState(false);

	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		// Cleanup function to prevent memory leaks when navigating away
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<nav
			className={`flex w-full items-center justify-between px-4 md:px-8 py-2 md:py-4 fixed top-0 z-50 transition-all duration-500 ease-in-out text-white border-b ${
				isScrolled
					? "bg-black border-zinc-800"
					: "bg-black/0 backdrop-blur-md border-transparent"
			}`}
		>
			{/* Brand logo automatically pointing to the homepage route */}
			<Link
				href="/"
				className={`shrink-0 text-red-600 font-black text-xl md:text-2xl tracking-tighter hover:opacity-90 transition ${
					isSearchExpanded ? "hidden md:block" : "block"
				}`}
			>
				Chrystl.Blogs
			</Link>

			<div
				className={`flex items-center gap-2 ${isSearchExpanded ? "w-full" : ""} md:w-auto`}
			>
				{/* Desktop search bar and expanded mobile search bar */}
				<div
					className={`${isSearchExpanded ? "flex w-full" : "hidden md:flex"} items-center gap-2 md:w-64`}
				>
					<div className="grow">
						<SearchBar />
					</div>

					{isSearchExpanded && (
						<button
							type="button"
							onClick={() => setIsSearchExpanded(false)}
							className="md:hidden text-zinc-400 hover:text-white transition p-1"
							aria-label="Close search"
						>
							<X className="w-5 h-5" />
						</button>
					)}
				</div>
				{!isSearchExpanded && (
					<button
						type="button"
						onClick={() => setIsSearchExpanded(true)}
						className="md:hidden text-zinc-400 hover:text-white transition"
						aria-label="Open search"
					>
						<Search className="w-5 h-5" />
					</button>
				)}
			</div>
		</nav>
	);
}
