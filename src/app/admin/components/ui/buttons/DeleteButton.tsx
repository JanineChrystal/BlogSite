"use client";

import { useTransition } from "react";
import { deletePostAction } from "@/lib/actions/post-management/delete-post";

interface DeletePostButtonProps {
	postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		// Prevent accidental deletions with a native confirmation dialog
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
			className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-white/10 disabled:opacity-50 outline-none"
			title="Delete Post"
		>
			<span className="material-symbols-outlined text-[20px]">
				{/* Swaps the icon to a loading indicator while the server processes the deletion */}
				{isPending ? "hourglass_empty" : "delete"}
			</span>
		</button>
	);
}
