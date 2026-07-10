"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { NAV_CONFIG } from "../../constants/nav";

export function Navbar() {
	const router = useRouter();

	const handleCategoryChange = (slug: string | null) => {
		if (!slug) return;

		if (slug === "all") {
			router.push("/");
		} else {
			router.push(`/blog/${slug}`);
		}
	};

	return (
		<nav className="flex items-center justify-between px-4 md:px-8 py-2 md:py-4 bg-black text-white border-b border-zinc-800">
			{/* Brand logo automatically pointing to the homepage route */}
			<Link
				href="/"
				className="text-red-600 font-black text-xl md:text-2xl tracking-tighter hover:opacity-90 transition"
			>
				Chrystl.Blogs
			</Link>

			{/* Desktop navigation categories dropdown layer wrapper */}
			<div className="hidden md:flex items-center space-x-8">
				{/* shadcn select configuration mapping */}
				<Select
					defaultValue="All Categories"
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
				<button
					type="button"
					className="text-zinc-400 hover:text-white transition"
				>
					<Search className="w-5 h-5" />
				</button>

				<button
					type="button"
					className="md:hidden text-zinc-400 hover:text-white transition"
				>
					<Menu className="w-6 h-6" />
				</button>
			</div>
		</nav>
	);
}
