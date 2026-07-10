"use client";

import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "@/src/app/(public)/components/ui/comment-form";
import { CommentThread } from "@/src/app/(public)/components/ui/comment-thread";
import type { Comment } from "@/lib/types/post";

interface CommentsSectionProps {
	initialComments: Comment[];
	commentCount: number;
}

export function CommentsSection({
	initialComments,
	commentCount,
}: CommentsSectionProps) {
	const [comments, setComments] = useState(initialComments);

	function handleNewComment({
		name,
		content,
	}: {
		name: string;
		content: string;
	}) {
		setComments((prev) => [
			{
				id: crypto.randomUUID(),
				author: { name },
				content,
				timestamp: "Just now",
			},
			...prev,
		]);
	}

	return (
		<section className="mt-16 border-t border-surface-container-high pt-8">
			<h3 className="mb-8 flex items-center gap-3 font-heading text-headline-md text-on-surface">
				<MessageSquare className="text-primary-container" />
				Discussion ({commentCount})
			</h3>
			<CommentForm onSubmit={handleNewComment} />
			<div className="space-y-8">
				{comments.map((comment) => (
					<CommentThread key={comment.id} comment={comment} />
				))}
			</div>
		</section>
	);
}
