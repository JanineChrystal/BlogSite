"use client";

import { ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
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
	filterOptions?: FilterOption[];
	onFilterChange?: (value: string) => void;
}

const DEFAULT_FILTERS: FilterOption[] = [
	{ label: "Newest", value: "newest" },
	{ label: "Oldest", value: "oldest" },
	{ label: "Quickest read", value: "read-time" },
];

export function CategoryToolbar({
	categoryName,
	filterOptions = DEFAULT_FILTERS,
	onFilterChange,
}: CategoryToolbarProps) {
	return (
		<div className="flex items-center justify-between border-b border-outline-variant/30 pb-6">
			<nav className="flex items-center gap-1.5 font-heading text-label-sm uppercase text-on-surface/50">
				<Link href="/" className="transition-colors hover:text-on-surface">
					All Categories
				</Link>
				<ChevronRight className="size-3.5" />
				<span className="text-primary-container">{categoryName}</span>
			</nav>

			<Select
				onValueChange={(value) => {
					if (value) onFilterChange?.(value);
				}}
				defaultValue="newest"
			>
				<SelectTrigger className="rounded-lg border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high">
					<SlidersHorizontal className="size-3.5" />
					<SelectValue placeholder="Filter" />
				</SelectTrigger>
				<SelectContent>
					{filterOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
