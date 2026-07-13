"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InputGroupDemo } from "@/components/ui/search/search";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { NAV_CONFIG } from "../../constants/nav";

export function Navbar() {
	const router = useRouter();

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

	const handleCategoryChange = (slug: string | null) => {
		if (!slug) return;

		if (slug === "all-categories") {
			router.push("/");
		} else {
			router.push(`/blog/${slug}`);
		}

		setIsMobileMenuOpen(false);
	};

	return (
		<nav
			className={`flex w-full justify-between px-4 md:px-8 py-2 md:py-4 fixed top-0 z-50 transition-all duration-500 ease-in-out text-white border-b ${
				isScrolled
					? "bg-black border-zinc-800"
					: "bg-black/0 backdrop-blur-md border-transparent"
			}`}
		>
			{/* Brand logo automatically pointing to the homepage route */}
			<Link
				href="/"
				className="text-red-600 font-black text-xl md:text-2xl tracking-tighter hover:opacity-90 transition"
				onClick={() => setIsMobileMenuOpen(false)}
			>
				Chrystl.Blogs
			</Link>

			<div className="flex items-center space-x-4 md:space-x-6">
				{/* Desktop navigation categories dropdown layer wrapper */}
				<div className="hidden md:block">
					<Select
						defaultValue="all-categories"
						onValueChange={handleCategoryChange}
					>
						<SelectTrigger className="w-55 bg-transparent border-none text-zinc-300 font-semibold uppercase tracking-wider focus:ring-0 shadow-none hover:text-white transition">
							<SelectValue placeholder="CATEGORIES" />
						</SelectTrigger>
						<SelectContent className="bg-zinc-900 text-white border-zinc-700">
							{NAV_CONFIG.categories.map((cat) => (
								<SelectItem
									key={cat.slug}
									value={cat.slug}
									className="focus:bg-zinc-800 focus:text-white cursor-pointer"
								>
									{cat.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Utility control icons block element */}
				<div className="flex items-center space-x-4 md:space-x-6">
					<div className="flex item-center">
						<div
							className={`${isSearchExpanded ? "flex w-full" : "hidden md:block w-64"} items-center gap-2`}
						>
							<div className="grow">
								<InputGroupDemo />
							</div>

							{isSearchExpanded && (
								<button
									type="button"
									onClick={() => setIsSearchExpanded(false)}
									className="md:hidden text-zinc-400 hover:text-white transition p-1"
								>
									<X className="w-5 h-5" />
								</button>
							)}
							{!isSearchExpanded && (
								<button
									type="button"
									onClick={() => setIsSearchExpanded(true)}
									className="md:hidden text-zinc-400 hover:text-white transition"
								>
									<InputGroupDemo />
								</button>
							)}
						</div>
					</div>

					<button
						type="button"
						className="md:hidden text-zinc-400 hover:text-white transition"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{/**toggle between X and Menu icons based on state */}
						{isMobileMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{/**mobile dropdown container that only renders when state is true */}
				{isMobileMenuOpen && (
					<div className="md:hidden flex flex-col w-full bg-zinc-950 px-4 py-4 absolute top-full left-0 border-b border-zinc-800 shadow-lg">
						{NAV_CONFIG.categories.map((cat) => (
							<button
								key={cat.slug}
								type="button"
								onClick={() => handleCategoryChange(cat.slug)}
								className="text-left py-3 text-sm font-semibold uppercase tracking-wider text-zinc-300 hover:text-white border-b border-zinc-800/50 last:border-b-0 transition"
							>
								{cat.name}
							</button>
						))}
					</div>
				)}
			</div>
		</nav>
	);
}
