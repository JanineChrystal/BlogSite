"use client";

import { Droplet, Flame, Leaf, type LucideIcon, Wind } from "lucide-react";
import { useState, useTransition } from "react";
import { addReaction } from "@/lib/actions/reaction";
import type { Reaction } from "@/lib/types/post";
import { cn } from "@/lib/utils/utils";

const ICONS: Record<Reaction["icon"], LucideIcon> = {
	droplet: Droplet,
	flame: Flame,
	leaf: Leaf,
	wind: Wind,
};

// Full literal class strings on purpose — see the note on Reaction.icon in
// lib/types/post.ts. Tailwind can't see classes built from a template string.
// I've replaced the non-working theme colors with standard Tailwind colors.
// For a permanent solution, ensure your custom theme colors (e.g., tertiary-container)
// are correctly defined in your tailwind.config.js file.
const REACTION_STYLES: Record<
	Reaction["icon"],
	{ text: string; hoverBorder: string; hoverText: string; glow: string }
> = {
	droplet: {
		text: "text-blue-500",
		hoverBorder: "group-hover:border-blue-500",
		hoverText: "group-hover:text-blue-500",
		glow: "active:animate-[glow-water_0.6s_ease-out]",
	},
	flame: {
		text: "text-primary-container", // This was reported to be working
		hoverBorder: "group-hover:border-primary-container",
		hoverText: "group-hover:text-primary-container",
		glow: "active:animate-[glow-fire_0.6s_ease-out]",
	},
	leaf: {
		text: "text-green-500",
		hoverBorder: "group-hover:border-green-500",
		hoverText: "group-hover:text-green-500",
		glow: "active:animate-[glow-earth_0.6s_ease-out]",
	},
	wind: {
		text: "text-gray-400",
		hoverBorder: "group-hover:border-gray-400",
		hoverText: "group-hover:text-gray-400",
		glow: "active:animate-[glow-air_0.6s_ease-out]",
	},
};

interface ReactionPanelProps {
	reactions: Reaction[];
	postId: string;
	slug: string;
}

export function ReactionPanel({ reactions, postId, slug }: ReactionPanelProps) {
	const [isPending, startTransition] = useTransition();
	const [clicked, setClicked] = useState<Set<string>>(new Set());
	const [counts, setCounts] = useState(() =>
		Object.fromEntries(reactions.map((r) => [r.id, r.count])),
	);

	function handleClick(id: string) {
		if (clicked.has(id) || isPending) return;

		setClicked((prev) => new Set(prev).add(id));
		setCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));

		startTransition(async () => {
			const result = await addReaction(postId, id, slug);

			if (result?.error) {
				// Revert optimistic update on error
				setClicked((prev) => {
					const newClicked = new Set(prev);
					newClicked.delete(id);
					return newClicked;
				});
				setCounts((prev) => ({ ...prev, [id]: prev[id] - 1 }));
				// You could show an error toast to the user here
			}
		});
	}

	return (
		<div className="mt-16 flex flex-col items-center border-t border-surface-container-high pt-8">
			<span className="mb-6 font-heading text-label-sm uppercase tracking-wider text-secondary">
				How did this review make you feel?
			</span>
			<div className="flex gap-4 md:gap-8">
				{reactions.map((reaction) => {
					const Icon = ICONS[reaction.icon];
					const style = REACTION_STYLES[reaction.icon];
					const hasClicked = clicked.has(reaction.id);
					return (
						<button
							key={reaction.id}
							type="button"
							onClick={() => handleClick(reaction.id)}
							disabled={hasClicked || isPending}
							className={cn(
								"group flex flex-col items-center gap-2 outline-none",
								style.glow,
								hasClicked || isPending
									? "cursor-not-allowed"
									: "cursor-pointer",
							)}
						>
							<div
								className={cn(
									"flex size-16 items-center justify-center rounded-full border bg-surface-container transition-all duration-300",
									style.text,
									hasClicked
										? style.hoverBorder.replace("group-hover:", "")
										: "border-transparent",
									!hasClicked && style.hoverBorder,
								)}
							>
								<Icon className="size-8" fill="currentColor" strokeWidth={1} />
							</div>
							<span
								className={cn(
									"font-heading text-label-sm text-secondary transition-colors",
									hasClicked
										? style.hoverText.replace("group-hover:", "")
										: style.hoverText,
								)}
							>
								{reaction.label}
							</span>
							<span className="font-body text-xs text-on-surface-variant">
								{counts[reaction.id]}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
