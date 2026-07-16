"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "./Button";

interface LoadMoreButtonProps {
	onClick?: () => void;
	isLoading?: boolean;
	hasMore?: boolean;
	text?: string;
	loadingText?: string;
	className?: string;
}

export function LoadMoreButton({
	onClick,
	isLoading = false,
	hasMore = true,
	text = "Load More ...",
	loadingText = "Loading...",
	className,
}: LoadMoreButtonProps) {
	if (!hasMore) return null;

	return (
		<Button
			variant="outline"
			onClick={onClick}
			disabled={isLoading}
			className={cn(
				// Simple comment: These base styles act as fallbacks if no custom className is provided
				"h-auto rounded-lg border-outline bg-transparent px-8 py-4 font-heading text-label-sm uppercase tracking-wide text-on-surface hover:bg-surface-container-high transition-all duration-200 flex items-center justify-center gap-2",
				className,
			)}
		>
			{isLoading ? (
				<>
					<Loader2 className="size-4 animate-spin" />
					<span>{loadingText}</span>
				</>
			) : (
				<span>{text}</span>
			)}
		</Button>
	);
}
