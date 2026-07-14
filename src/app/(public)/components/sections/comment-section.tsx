"use client";

import { MessageSquare } from "lucide-react";
import { CommentForm } from "@/app/(public)/components/ui/comment-form";
import { CommentThread } from "@/app/(public)/components/ui/comment-thread";
import type { Comment } from "@/lib/types/post";

interface CommentsSectionProps {
	initialComments: Comment[];
	commentCount: number;
	postId: string;
	slug: string;
}

export function CommentsSection({
	initialComments,
	commentCount,
	postId,
	slug,
}: CommentsSectionProps) {
	return (
		<section className="mt-16 border-t border-surface-container-high pt-8">
			<h3 className="mb-8 flex items-center gap-3 font-heading text-headline-md text-on-surface">
				<MessageSquare className="text-primary-container" />
				Discussion ({commentCount})
			</h3>
			<CommentForm postId={postId} slug={slug} />
			<div className="space-y-8">
				{initialComments.map((comment) => (
					<CommentThread
						key={comment.id}
						comment={comment}
						postId={postId}
						slug={slug}
					/>
				))}
			</div>
		</section>
	);
}
