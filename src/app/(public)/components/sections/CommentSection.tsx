import { MessageSquare } from "lucide-react";
import { CommentForm } from "@/app/(public)/components/ui/CommentForm";
import { CommentThread } from "@/app/(public)/components/ui/CommentThread";
import { fetchMoreComments } from "@/lib/db/queries/comment/get-more-comment";
import { LazyLoadedComments } from "../ui/LazyLoadedComments";

interface CommentsSectionProps {
	postId: string;
	slug: string;
}

export async function CommentsSection({ postId, slug }: CommentsSectionProps) {
	const initialComments = await fetchMoreComments(postId, 0);

	// Get the count of the currently loaded comments
	const commentCount = initialComments.length;

	return (
		<section className="mt-16 border-t border-surface-container-high pt-8">
			<h3 className="mb-8 flex items-center gap-3 font-heading text-headline-md text-on-surface">
				<MessageSquare className="text-primary-container" />
				Discussion ({commentCount})
			</h3>
			<CommentForm postId={postId} slug={slug} />
			<div className="mt-10 space-y-8">
				{initialComments.map((comment) => (
					<CommentThread
						key={comment.id}
						comment={comment}
						postId={postId}
						slug={slug}
					/>
				))}
			</div>
			<LazyLoadedComments
				postId={postId}
				slug={slug}
				initialCount={initialComments.length}
			/>
		</section>
	);
}
