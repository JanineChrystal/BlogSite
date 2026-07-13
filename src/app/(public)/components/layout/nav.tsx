"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { InputGroupDemo } from "@/components/ui/search/search";

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
			>
				Chrystl.Blogs
			</Link>

			<div className="flex items-center">
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
		</nav>
	);
}
