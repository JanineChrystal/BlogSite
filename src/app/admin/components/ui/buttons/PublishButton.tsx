"use client";

interface PublishButtonProps {
	isPending: boolean;
	isEditMode: boolean;
}

export function PublishButton({ isPending, isEditMode }: PublishButtonProps) {
	return (
		<button
			type="submit"
			form="post-form"
			name="status"
			value="published"
			disabled={isPending}
			className="bg-primary-container text-white px-6 md:px-8 py-3 rounded-DEFAULT font-label-sm text-label-sm uppercase tracking-wider hover:bg-inverse-primary transition-all shadow-lg disabled:opacity-50"
		>
			{isPending
				? isEditMode
					? "Updating..."
					: "Saving..."
				: isEditMode
					? "Update Post"
					: "Publish Post"}
		</button>
	);
}
