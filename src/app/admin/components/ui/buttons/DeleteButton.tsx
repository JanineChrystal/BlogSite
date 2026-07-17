"use client";

import { useState, useTransition } from "react";
import { deletePostAction } from "@/lib/actions/post-management/delete-post";
import { ConfirmModal } from "../dialogs/ConfirmationDialog";

interface DeletePostButtonProps {
	postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
	const [isPending, startTransition] = useTransition();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleConfirmDelete = () => {
		startTransition(async () => {
			await deletePostAction(postId);
			setIsModalOpen(false);
		});
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setIsModalOpen(true)}
				disabled={isPending}
				className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-white/10 disabled:opacity-50 outline-none"
				title="Delete Post"
			>
				<span className="material-symbols-outlined text-[20px]">
					{isPending ? "hourglass_empty" : "delete"}
				</span>
			</button>
			<ConfirmModal
				isOpen={isModalOpen}
				onClose={() => !isPending && setIsModalOpen(false)}
				onConfirm={handleConfirmDelete}
				title="Delete Post"
				message="Are you sure you want to permanently delete this post?"
				confirmText={isPending ? "Deleting..." : "Delete"}
				cancelText="Cancel"
			/>
		</>
	);
}
