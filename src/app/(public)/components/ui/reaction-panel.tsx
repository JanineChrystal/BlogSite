"use client";

import { Droplet, Flame, Leaf, type LucideIcon, Wind } from "lucide-react";
import { useState } from "react";
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
const REACTION_STYLES: Record<
	Reaction["icon"],
	{ text: string; hoverBorder: string; hoverText: string; glow: string }
> = {
	droplet: {
		text: "text-tertiary-container",
		hoverBorder: "group-hover:border-tertiary-container",
		hoverText: "group-hover:text-tertiary-container",
		glow: "active:animate-[glow-water_0.6s_ease-out]",
	},
	flame: {
		text: "text-primary-container",
		hoverBorder: "group-hover:border-primary-container",
		hoverText: "group-hover:text-primary-container",
		glow: "active:animate-[glow-fire_0.6s_ease-out]",
	},
	leaf: {
		text: "text-tertiary",
		hoverBorder: "group-hover:border-tertiary",
		hoverText: "group-hover:text-tertiary",
		glow: "active:animate-[glow-earth_0.6s_ease-out]",
	},
	wind: {
		text: "text-secondary-fixed",
		hoverBorder: "group-hover:border-secondary-fixed",
		hoverText: "group-hover:text-secondary-fixed",
		glow: "active:animate-[glow-air_0.6s_ease-out]",
	},
};

interface ReactionPanelProps {
	reactions: Reaction[];
	onReact?: (id: string) => void;
}

export function ReactionPanel({ reactions, onReact }: ReactionPanelProps) {
	const [clicked, setClicked] = useState<Set<string>>(new Set());
	const [counts, setCounts] = useState(() =>
		Object.fromEntries(reactions.map((r) => [r.id, r.count])),
	);

	function handleClick(id: string) {
		if (clicked.has(id)) return;
		setClicked((prev) => new Set(prev).add(id));
		setCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
		onReact?.(id); // TODO: wire to a real reactions API call
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
					return (
						<button
							key={reaction.id}
							type="button"
							onClick={() => handleClick(reaction.id)}
							className={cn(
								"group flex cursor-pointer flex-col items-center gap-2 outline-none",
								style.glow,
							)}
						>
							<div
								className={cn(
									"flex size-16 items-center justify-center rounded-full border border-transparent bg-surface-container transition-all duration-300",
									style.text,
									style.hoverBorder,
								)}
							>
								<Icon className="size-8" fill="currentColor" strokeWidth={1} />
							</div>
							<span
								className={cn(
									"font-heading text-label-sm text-secondary transition-colors",
									style.hoverText,
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
