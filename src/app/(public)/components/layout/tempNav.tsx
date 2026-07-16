"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SearchBar } from "@/components/ui/tempSearch";
import { NAV_CONFIG } from "../../constants/nav";

function categoryHref(slug: string) {
	// There's no standalone "all categories" index page — the home page
	// already surfaces every category, so that entry routes there instead.
	return slug === "all-categories" ? "/" : `/${slug}`;
}

export function Navbar() {
	const [isSearchExpanded, setIsSearchExpanded] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Close the mobile menu on outside click — same pattern as SearchBar's
	// click-outside handling, kept consistent rather than reinvented here.
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
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
					<>
						{/* Search Icon (mobile only) */}
						<button
							type="button"
							onClick={() => setIsSearchExpanded(true)}
							className="md:hidden text-zinc-400 hover:text-white transition"
							aria-label="Open search"
						>
							<Search className="w-5 h-5" />
						</button>
					</>
				)}

				{/* Hamburger Menu (always, unless mobile search is expanded) */}
				<div className="relative">
					{!isSearchExpanded && (
						<button
							type="button"
							onClick={() => setIsMenuOpen((open) => !open)}
							className="text-zinc-400 hover:text-white transition"
							aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						>
							{isMenuOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</button>
					)}
					{/* Category dropdown menu */}
					{isMenuOpen && (
						<div
							ref={menuRef}
							className="absolute top-full right-0 mt-2 flex w-48 flex-col rounded-md border border-zinc-800 bg-black py-1 shadow-lg"
						>
							{NAV_CONFIG.categories.map((cat) => (
								<Link
									key={cat.slug}
									href={categoryHref(cat.slug)}
									onClick={() => setIsMenuOpen(false)}
									className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
								>
									{cat.name}
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
