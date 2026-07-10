import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types/post";
import { cn } from "@/lib/utils/utils";

interface BlogCardProps {
	post: Post;
	className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
	return (
		<Link
			href={`/post/${post.slug}`}
			className={cn(
				"group block overflow-hidden rounded-lg bg-surface-container-low ring-1 ring-outline-variant/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.5)]",
				className,
			)}
		>
			<div className="relative aspect-16/10 overflow-hidden">
				<Image
					src={post.coverImage}
					alt={post.title}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-110"
				/>
			</div>

			<div className="flex flex-col gap-2 p-5">
				<span className="font-heading text-label-sm uppercase text-primary-container">
					{post.category.name}
				</span>
				<h3 className="line-clamp-2 font-heading text-xl font-bold text-on-surface">
					{post.title}
				</h3>
				<p className="line-clamp-3 font-body text-body-md text-on-surface/70">
					{post.excerpt}
				</p>
				<div className="mt-2 flex items-center gap-1.5 font-heading text-label-sm text-on-surface/50">
					<Clock className="size-3.5" />
					{post.readTimeMinutes} MIN READ
				</div>
			</div>
		</Link>
	);
}
