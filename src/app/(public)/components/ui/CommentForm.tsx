"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/buttons/Button";
import { Input } from "@/components/ui/input-group/Input";
import { TextArea } from "@/components/ui/input-group/tempTextArea";
import { addComment } from "@/lib/actions/comment-management/create-comment";
import type { CommentFormState } from "@/lib/types/comment";
import { cn } from "@/lib/utils/utils";

interface CommentFormProps {
	postId: string;
	slug: string;
	parentId?: string;
	onCancel?: () => void;
}

const fieldClass =
	"h-auto rounded-none border-0 border-b-2 border-surface-container-high bg-surface-container-low px-2 py-3 font-body text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus-visible:border-primary-container focus-visible:ring-0";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			disabled={pending}
			className="h-auto rounded bg-primary-container px-8 py-3 font-heading text-label-sm uppercase tracking-wider text-white shadow-[0px_4px_14px_rgba(229,9,20,0.4)] hover:bg-inverse-primary"
		>
			{pending ? "Posting..." : "Post Comment"}
		</Button>
	);
}

export function CommentForm({
	postId,
	slug,
	parentId,
	onCancel,
}: CommentFormProps) {
	const initialState: CommentFormState = { errors: {} };
	const [state, formAction] = useActionState(addComment, initialState);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.success) {
			formRef.current?.reset();
			onCancel?.();
		}
	}, [state.success, onCancel]);

	return (
		<form
			ref={formRef}
			action={formAction}
			className={cn(
				"mb-12 rounded-xl border border-surface-container-high bg-surface-container-low p-6",
				parentId && "mb-0 border-none bg-transparent p-0",
			)}
		>
			<input type="hidden" name="postId" value={postId} />
			<input type="hidden" name="slug" value={slug} />
			{parentId && <input type="hidden" name="parentId" value={parentId} />}
			{state.errors?._form && (
				<p className="mb-2 text-sm text-red-500">
					{state.errors._form.join(", ")}
				</p>
			)}
			<div className="mb-4">
				<label
					htmlFor="comment-name"
					className="mb-2 block font-heading text-label-sm uppercase text-secondary"
				>
					Display Name
				</label>
				<Input
					id="comment-name"
					name="authorName"
					placeholder="Enter your name"
					className={fieldClass}
					required
				/>
				{state.errors?.authorName && (
					<p className="mt-1 text-sm text-red-500">
						{state.errors.authorName.join(", ")}
					</p>
				)}
			</div>
			<div className="mb-6">
				<label
					htmlFor="comment-content"
					className="mb-2 block font-heading text-label-sm uppercase text-secondary"
				>
					Join the conversation
				</label>
				<TextArea
					id="comment-content"
					name="body"
					rows={4}
					placeholder="What are your thoughts on the cinematography?"
					className={cn(fieldClass, "min-h-0 resize-none")}
					required
				/>
				{state.errors?.body && (
					<p className="mt-1 text-sm text-red-500">
						{state.errors.body.join(", ")}
					</p>
				)}
			</div>
			<div className="flex items-center justify-end">
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="mr-4 h-auto rounded bg-surface-container px-8 py-3 font-heading text-label-sm uppercase tracking-wider text-on-surface transition-colors hover:bg-surface-container-high"
					>
						Cancel
					</button>
				)}
				<SubmitButton />
			</div>
		</form>
	);
}
