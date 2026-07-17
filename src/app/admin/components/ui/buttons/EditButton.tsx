"use client";

interface EditPostButtonProps {
	onClick: () => void;
}

export function EditPostButton({ onClick }: EditPostButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="p-2 text-on-surface-variant hover:text-primary-container transition-colors rounded-full hover:bg-white/10 outline-none"
			title="Edit Post"
		>
			<span className="material-symbols-outlined text-[20px]">edit</span>
		</button>
	);
}
