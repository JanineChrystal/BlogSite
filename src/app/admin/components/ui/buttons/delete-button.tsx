"use client";

import { useTransition } from "react";
import { deletePostAction } from "@/lib/actions/post";

interface DeletePostButtonProps {
	postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		// Simple comment: Prevent accidental deletions with a native confirmation dialog
		if (
			window.confirm("Are you sure you want to permanently delete this post?")
		) {
			startTransition(async () => {
				await deletePostAction(postId);
			});
		}
	};

	return (
		<button
			type="button"
			onClick={handleDelete}
			disabled={isPending}
			// Simple comment: Change the hover color to red (text-error) to indicate a destructive action
			className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-white/10 disabled:opacity-50 outline-none"
			title="Delete Post"
		>
			<span className="material-symbols-outlined text-[20px]">
				{/* Simple comment: Swap the icon to a loading indicator while the server processes the deletion */}
				{isPending ? "hourglass_empty" : "delete"}
			</span>
		</button>
	);
}
