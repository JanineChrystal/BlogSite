import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import { buttonVariants } from "@/src/components/ui/buttons/button";

export interface HeroAction {
	label: string;
	href: string;
}

export interface HeroBadge {
	label: string;
	emphasized?: boolean;
}

export interface HeroSectionProps {
	variant?: "feature" | "category" | "post";
	backgroundImage: string;
	backgroundAlt: string;
	kicker?: string;
	tags?: string[];
	badges?: HeroBadge[];
	meta?: string[];
	title: React.ReactNode;
	description?: string;
	actions?: HeroAction[];
}

const overlayByVariant = {
	feature:
		"bg-linear-to-t md:bg-linear-to-r from-black via-black/80 to-transparent",
	category: "bg-linear-to-t from-black via-black/60 to-black/20",
	post: "bg-linear-to-t from-black via-black/80 to-transparent",
} as const;

const containerByVariant = {
	feature: "items-start text-left max-w-2xl mt-12 md:mt-0",
	category: "items-center text-center max-w-3xl mx-auto",
	post: "items-start text-left max-w-[1200px] mx-auto justify-end",
} as const;

const titleSizeByVariant = {
	feature:
		"text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight",
	category: "text-5xl md:text-display-hero font-black",
	post: "text-headline-lg md:text-display-hero font-black leading-[1.1] drop-shadow-2xl",
} as const;

export function HeroSection({
	variant = "feature",
	backgroundImage,
	backgroundAlt,
	kicker,
	tags,
	badges,
	meta,
	title,
	description,
	actions,
}: HeroSectionProps) {
	const isCategory = variant === "category";
	const isPost = variant === "post";

	return (
		<section
			className={cn(
				"relative w-full flex px-4 md:px-8 py-12 md:py-16 bg-black",
				isPost
					? "h-179 min-h-150 flex-col justify-end"
					: "min-h-[60vh] md:min-h-[80vh]",
				isCategory && "justify-center",
				!isCategory && !isPost && "items-center",
			)}
		>
			<div className="absolute inset-0 z-0">
				<Image
					src={backgroundImage}
					alt={backgroundAlt}
					fill
					priority
					className="w-full h-full object-cover opacity-40"
				/>
				<div className={cn("absolute inset-0", overlayByVariant[variant])} />
			</div>

			<div
				className={cn(
					"relative z-10 w-full flex flex-col text-white",
					containerByVariant[variant],
				)}
			>
				{kicker && (
					<span className="mb-4 w-fit self-center rounded-full border border-outline px-4 py-1 font-heading text-label-sm uppercase text-on-surface">
						{kicker}
					</span>
				)}

				{badges && badges.length > 0 && (
					<div className="mb-4 flex gap-4">
						{badges.map((badge) => (
							<span
								key={badge.label}
								className={cn(
									"rounded border px-3 py-1 font-heading text-label-sm uppercase",
									badge.emphasized
										? "border-primary-container text-primary-container"
										: "border-outline-variant text-secondary",
								)}
							>
								{badge.label}
							</span>
						))}
					</div>
				)}

				<h1
					className={cn(
						"mb-4 font-heading text-on-primary-container md:mb-6",
						titleSizeByVariant[variant],
					)}
				>
					{title}
				</h1>

				{meta && meta.length > 0 && (
					<div className="flex flex-wrap items-center gap-4 font-heading text-label-sm uppercase tracking-wider text-on-surface-variant">
						{meta.map((item, i) => (
							<span key={item} className="flex items-center gap-4">
								{i > 0 && (
									<span className="size-1 shrink-0 rounded-full bg-primary-container" />
								)}
								{item}
							</span>
						))}
					</div>
				)}

				{description && (
					<p className="mb-6 max-w-md text-base leading-relaxed text-zinc-300 md:mb-8 md:text-lg">
						{description}
					</p>
				)}

				{tags && tags.length > 0 && (
					<div className="mb-8 flex flex-wrap justify-center gap-2 md:mb-10 md:justify-start md:space-x-3">
						{tags.map((tag) => (
							<span
								key={tag}
								className="rounded-full border border-zinc-600 px-3 py-1 text-[10px] font-semibold md:px-4 md:text-xs"
							>
								{tag}
							</span>
						))}
					</div>
				)}

				{actions && actions.length > 0 && (
					<div
						className={cn(
							"flex flex-col gap-4 sm:flex-row",
							isCategory && "justify-center",
						)}
					>
						{actions.map((action) => (
							<Link
								key={action.href}
								href={action.href}
								className={cn(
									buttonVariants({ variant: "default" }),
									"h-auto rounded-lg bg-primary-container px-8 py-4 font-bold uppercase tracking-wide text-on-primary-container hover:bg-inverse-primary md:py-6",
								)}
							>
								{action.label}
							</Link>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
