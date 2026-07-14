"use client";

import { User } from "lucide-react";
import { useState } from "react";
import type { Comment } from "@/lib/types/post";
import { cn } from "@/lib/utils/utils";
import { CommentForm } from "./comment-form";

interface CommentThreadProps {
	comment: Comment;
	depth?: number;
	postId: string;
	slug: string;
}

export function CommentThread({
	comment,
	depth = 0,
	postId,
	slug,
}: CommentThreadProps) {
	const isReply = depth > 0;
	const [isReplying, setIsReplying] = useState(false);

	return (
		<div className={cn("group", isReply && "relative ml-16 mt-6")}>
			{isReply && (
				<div className="absolute -left-10 top-0 size-8 rounded-bl-xl border-b-2 border-l-2 border-surface-container-high" />
			)}
			<div className="flex gap-4">
				<div
					className={cn(
						"size-12 shrink-0 overflow-hidden rounded-full bg-surface-container-high",
						isReply && "size-10 border border-primary-container",
					)}
				>
					{comment.author.avatarUrl ? (
						// biome-ignore lint: remote avatar URLs aren't whitelisted for next/image yet
						<img
							src={comment.author.avatarUrl}
							alt={comment.author.name}
							className="size-full object-cover"
						/>
					) : (
						<div className="flex size-full items-center justify-center text-secondary">
							<User className="size-5" fill="currentColor" strokeWidth={1} />
						</div>
					)}
				</div>
				<div
					className={cn(
						"grow",
						isReply &&
							"rounded-xl border border-surface-container-high bg-surface-container p-4",
					)}
				>
					<div className="mb-1 flex items-baseline gap-3">
						<span className="flex items-center gap-2 font-heading text-base text-on-surface">
							{comment.author.name}
							{comment.isAuthor && (
								<span className="rounded bg-primary-container px-2 py-0.5 font-heading text-[10px] uppercase tracking-wider text-white">
									Author
								</span>
							)}
						</span>
						<span className="font-body text-sm text-on-surface-variant">
							{comment.timestamp}
						</span>
					</div>
					<p className="font-body leading-relaxed text-secondary">
						{comment.content}
					</p>
					{!isReply && (
						<button
							type="button"
							onClick={() => setIsReplying((prev) => !prev)}
							className="mt-3 font-heading text-label-sm uppercase tracking-wider text-primary-container transition-colors hover:text-primary"
						>
							{isReplying ? "Cancel" : "Reply"}
						</button>
					)}
				</div>
			</div>

			{isReplying && (
				<div className="mt-4 pl-16">
					<CommentForm
						postId={postId}
						slug={slug}
						parentId={comment.id}
						onCancel={() => setIsReplying(false)}
					/>
				</div>
			)}

			{comment.replies?.map((reply) => (
				<CommentThread
					key={reply.id}
					comment={reply}
					depth={depth + 1}
					postId={postId}
					slug={slug}
				/>
			))}
		</div>
	);
}
