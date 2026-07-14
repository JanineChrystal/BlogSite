"use client";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
	label: string;
	value: string;
}

interface CategoryToolbarProps {
	categoryName: string;
	categorySlug?: string;
	postTitle?: string;
}

const FILTER_OPTIONS: FilterOption[] = [
	{ label: "Newest", value: "newest" },
	{ label: "Oldest", value: "oldest" },
	{ label: "Quickest read", value: "read-time" },
];

export function CategoryToolbar({
	categoryName,
	categorySlug,
	postTitle,
}: CategoryToolbarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentSort = searchParams.get("sort") || "newest";

	const handleFilterChange = (value: string | null) => {
		if (!value) return;
		const params = new URLSearchParams(searchParams);
		params.set("sort", value);
		router.replace(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="flex items-center justify-between border-b border-outline-variant/30 pb-6">
			<nav className="flex items-center gap-1.5 font-heading text-label-sm uppercase text-on-surface/50">
				<Link href="/" className="transition-colors hover:text-on-surface">
					All Categories
				</Link>
				<ChevronRight className="size-3.5 shrink-0" />
				{postTitle && categorySlug ? (
					<>
						<Link
							href={`/${categorySlug}`}
							className="truncate transition-colors hover:text-on-surface"
						>
							{categoryName}
						</Link>
						<ChevronRight className="size-3.5 shrink-0" />
						<span className="truncate text-primary-container">{postTitle}</span>
					</>
				) : (
					<span className="truncate text-primary-container">
						{categoryName}
					</span>
				)}
			</nav>

			{!postTitle && (
				<Select onValueChange={handleFilterChange} defaultValue={currentSort}>
					<SelectTrigger className="rounded-lg border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high">
						<SlidersHorizontal className="size-3.5 text-primary-container" />
						<SelectValue placeholder="Filter" />
					</SelectTrigger>
					<SelectContent>
						{FILTER_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	);
}
