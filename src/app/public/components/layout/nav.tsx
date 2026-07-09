"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
	const pathname = usePathname();

	const handleCategoryChange = (slug: string | null) => {
		if (!slug) return;

		if (slug === "all") {
			router.push("/");
		} else {
			router.push(`/blog/${slug}`);
		}
	};

	return (
		<nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-black text-white border-b border-zinc-800">
			{/* logo */}
			<Link
				href="/"
				className="text-red-600 font-black text-xl md:text-2xl tracking-tighter"
			>
				Chrystl.Blogs
			</Link>

			{/* desktop navigation hidden on mobile */}
			<div className="hidden md:flex items-center space-x-8">
				{/* map through the core navigation links */}
				{NAV_CONFIG.links.map((link) => {
					const isActive = pathname === link.path;
					return (
						<Link
							key={link.path}
							href={link.path}
							className={`text-sm font-semibold transition pb-1 border-b-2 ${
								isActive
									? "text-white border-red-600"
									: "text-zinc-300 border-transparent hover:text-white"
							}`}
						>
							{link.label.toUpperCase()}
						</Link>
					);
				})}

				{/* shadcn select configuration mapping */}
				<Select defaultValue="all" onValueChange={handleCategoryChange}>
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

			{/* utility icons adaptive layout */}
			<div className="flex items-center space-x-4 md:space-x-6">
				<button
					type="button"
					className="text-zinc-400 hover:text-white transition"
				>
					<Search className="w-5 h-5" />
				</button>
				<div className="hidden md:block w-8 h-8 rounded-full bg-zinc-700 border border-zinc-600 overflow-hidden" />

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
