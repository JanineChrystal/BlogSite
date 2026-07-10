"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "./button";

interface LoadMoreButtonProps {
	onClick?: () => void;
	isLoading?: boolean;
	hasMore?: boolean;
}

export function LoadMoreButton({
	onClick,
	isLoading = false,
	hasMore = true,
}: LoadMoreButtonProps) {
	if (!hasMore) return null;

	return (
		<Button
			variant="outline"
			onClick={onClick}
			disabled={isLoading}
			className={cn(
				"h-auto rounded-lg border-outline bg-transparent px-8 py-4 font-heading text-label-sm uppercase tracking-wide text-on-surface hover:bg-surface-container-high",
			)}
		>
			{isLoading ? (
				<Loader2 className="size-4 animate-spin" />
			) : (
				"Load More Articles"
			)}
		</Button>
	);
}
