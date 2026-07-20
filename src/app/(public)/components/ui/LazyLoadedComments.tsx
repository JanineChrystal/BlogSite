"use client";

import { useLazyLoad } from "@/app/hooks/useLazyLoad";
import { LoadMoreButton } from "@/components/ui/buttons/LoadMoreButton";
import { fetchMoreComments } from "@/lib/db/queries/comment/get-more-comment";
import type { Comment } from "@/lib/types/post";
import { CommentThread } from "./CommentThread";

interface LazyLoadedCommentsProps {
	postId: string;
	slug: string;
	initialCount: number;
}

export function LazyLoadedComments({
	postId,
	slug,
	initialCount,
}: LazyLoadedCommentsProps) {
	// Wrap the server action to match the hook's expected function signature
	const fetchAction = async (offset: number) => {
		return await fetchMoreComments(postId, offset);
	};

	// Initialize the custom hook with the initial item count and fetch action
	const { isFetching, hasMore, loadMore, newlyLoadedData } =
		useLazyLoad<Comment>(initialCount, fetchAction);

	return (
		<div className="flex w-full flex-col items-center">
			<div className="mb-8 w-full space-y-8">
				{newlyLoadedData.map((comment) => (
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
				text="Load More Comments"
			/>
		</div>
	);
}
