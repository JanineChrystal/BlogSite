"use client";
import { ChevronRight, SlidersHorizontal, Tag as TagIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/buttons/Button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/tempSelect";

interface FilterOption {
	label: string;
	value: string;
}

export interface Tag {
	name: string;
	slug: string;
}

interface CategoryToolbarProps {
	categoryName: string;
	categorySlug?: string;
	postTitle?: string;
	tags?: Tag[];
}

const FILTER_OPTIONS: FilterOption[] = [
	{ label: "Newest", value: "newest" },
	{ label: "Oldest", value: "oldest" },
];

export function CategoryToolbar({
	categoryName,
	categorySlug,
	tags,
	postTitle,
}: CategoryToolbarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentSort = searchParams.get("sort") || "newest";

	const currentTags = useMemo(
		() => searchParams.get("tags")?.split(",").filter(Boolean) ?? [],
		[searchParams],
	);

	const handleFilterChange = (value: string | null) => {
		if (!value) return;
		const params = new URLSearchParams(searchParams);
		params.set("sort", value);
		router.replace(`${pathname}?${params.toString()}`);
	};

	const handleTagToggle = (slug: string, checked: boolean) => {
		const params = new URLSearchParams(searchParams);
		const next = new Set(currentTags);

		if (checked) {
			next.add(slug);
		} else {
			next.delete(slug);
		}

		if (next.size === 0) {
			params.delete("tags");
		} else {
			params.set("tags", Array.from(next).join(","));
		}

		// Reset to first page when filter changes
		params.delete("page");
		router.replace(`${pathname}?${params.toString()}`);
	};

	const clearTags = () => {
		const params = new URLSearchParams(searchParams);
		params.delete("tags");
		params.delete("page");
		router.replace(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="flex flex-col gap-4 border-b border-outline-variant/30 pb-6 sm:flex-row sm:items-center sm:justify-between">
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

			<div className="flex items-center justify-end gap-2">
				{tags && tags.length > 0 && !postTitle && (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="outline"
									className="w-auto min-w-40 justify-start gap-2 rounded-lg border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high"
								>
									<TagIcon className="size-3.5 text-primary-container" />
									{currentTags.length > 0
										? `${currentTags.length} tag${currentTags.length > 1 ? "s" : ""}`
										: "Filter by tag"}
								</Button>
							}
						/>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuGroup>
								<DropdownMenuLabel className="flex items-center justify-between">
									<span>Tags</span>
									{currentTags.length > 0 && (
										<button
											type="button"
											onClick={clearTags}
											className="text-label-sm font-normal text-on-surface/50 hover:text-on-surface"
										>
											Clear
										</button>
									)}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{tags.map((tag) => (
									<DropdownMenuCheckboxItem
										key={tag.slug}
										checked={currentTags.includes(tag.slug)}
										onCheckedChange={(checked) =>
											handleTagToggle(tag.slug, checked === true)
										}
									>
										{tag.name}
									</DropdownMenuCheckboxItem>
								))}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
				{!postTitle && (
					<Select onValueChange={handleFilterChange} defaultValue={currentSort}>
						<SelectTrigger className="w-auto min-w-40 rounded-lg border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high">
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
		</div>
	);
}
