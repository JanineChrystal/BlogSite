import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "./card";

interface PostCardProps {
	title: string;
	categoryLabel?: string;
	imageUrl: string;
	postSlug: string;
	orientation?: "landscape" | "portrait";
}

export function PostCard({
	title,
	categoryLabel,
	imageUrl,
	postSlug,
	orientation = "landscape",
}: PostCardProps) {
	// define responsive aspect ratios based on orientation prop
	const aspectClass =
		orientation === "landscape"
			? "aspect-[4/3] md:aspect-video"
			: "aspect-square md:aspect-[3/4]";

	return (
		<Link href={`/post/${postSlug}`} className="group block h-full">
			<Card className="relative overflow-hidden border-none bg-zinc-900 h-full rounded-md">
				<div className={`w-full ${aspectClass}`}>
					<Image
						src={imageUrl}
						alt={title}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
					/>
				</div>

				{/* gradient overlay for text readability */}
				<CardContent className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent p-4 md:p-6 flex flex-col justify-end border-none">
					<h3 className="text-white font-bold text-base md:text-lg leading-tight mb-1">
						{title}
					</h3>
					{categoryLabel && (
						<span className="text-red-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
							{categoryLabel}
						</span>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}
