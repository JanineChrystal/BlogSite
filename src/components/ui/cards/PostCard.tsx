import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";

interface PostCardProps {
	title: string;
	categoryLabel?: string | null;
	imageUrl: string;
	postSlug: string;
	orientation?: "landscape" | "portrait";
	captionEmphasis?: "bold" | "medium";
	className?: string;
	sizes?: string;
}

export function PostCard({
	title,
	categoryLabel,
	imageUrl,
	postSlug,
	orientation = "landscape",
	captionEmphasis = "bold",
	className,
	sizes = "50vw",
}: PostCardProps) {
	const aspectClass =
		orientation === "landscape" ? "aspect-video" : "aspect-[2/3]";

	return (
		<Link
			href={`/blog-post/${postSlug}`}
			className={cn("group block", className)}
		>
			<div
				className={cn(
					"relative w-full overflow-hidden rounded-lg bg-surface",
					aspectClass,
				)}
			>
				<Image
					src={imageUrl}
					alt={title}
					fill
					sizes={sizes}
					className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
				/>

				<div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/20 to-transparent p-4">
					<h3
						className={cn(
							"leading-tight text-white",
							captionEmphasis === "bold"
								? "mb-1 font-heading text-base font-bold md:text-lg"
								: "font-body text-sm font-medium",
						)}
					>
						{title}
					</h3>
					{categoryLabel && (
						<span className="font-heading text-[10px] uppercase tracking-wider text-primary-container md:text-xs">
							{categoryLabel}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
}
