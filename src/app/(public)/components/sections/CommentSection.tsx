"use client";

import { MessageSquare } from "lucide-react";
import { CommentForm } from "@/app/(public)/components/ui/CommentForm";
import { CommentThread } from "@/app/(public)/components/ui/CommentThread";
import { useLazyLoad } from "@/app/hooks/useLazyLoad";
import { LoadMoreButton } from "@/components/ui/buttons/LoadMoreButton";
import { fetchMoreComments } from "@/lib/actions/comment";
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
	const { isFetching, hasMore, loadMore, newlyLoadedData } = useLazyLoad(
		initialComments.length,
		(offset) => fetchMoreComments(postId, offset),
	);

	const allComments = [...initialComments, ...newlyLoadedData];

	return (
		<section className="mt-16 border-t border-surface-container-high pt-8">
			<h3 className="mb-8 flex items-center gap-3 font-heading text-headline-md text-on-surface">
				<MessageSquare className="text-primary-container" />
				Discussion ({commentCount})
			</h3>
			<CommentForm postId={postId} slug={slug} />
			<div className="space-y-8">
				{allComments.map((comment) => (
					<CommentThread
						key={comment.id}
						comment={comment}
						postId={postId}
						slug={slug}
					/>
				))}
			</div>
			<LoadMoreButton
				onClick={loadMore}
				isLoading={isFetching}
				hasMore={hasMore}
				text="View more replies"
				loadingText="Loading replies..."
				className="px-4 py-2 text-body-sm font-body border-none text-on-surface-variant hover:text-primary-container hover:bg-transparent"
			/>
		</section>
	);
}
