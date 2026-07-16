"use client";

import { useActionState, useEffect } from "react";
import { usePostForm } from "@/app/hooks/usePostForm";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import {
	type ActionState,
	createPostAction,
	updatePostAction,
} from "@/lib/actions/post";

import { ImageUpload } from "../../forms/ImageUpload";

export interface DialogPostItem {
	id: string;
	title: string;
	slug: string;
	categoryId: string;
	body: string;
	featuredLink?: string | null;
	featuredImage?: string | null;
	tags?: string | null;
}

interface PostDialogProps {
	post: DialogPostItem | null;
	categories: { categoryId: string; name: string }[];
	isOpen: boolean;
	onClose: () => void;
}

export function PostDialog({
	post,
	categories,
	isOpen,
	onClose,
}: PostDialogProps) {
	const { formData, handleChange } = usePostForm(post, isOpen);
	const isEditMode = !!post;

	// Safely wrap the server action based on the current mode to satisfy React hook rules
	const actionHandler = async (prevState: ActionState, formData: FormData) => {
		if (isEditMode) {
			return updatePostAction(prevState, formData);
		}
		return createPostAction(prevState, formData);
	};

	const [state, formAction, isPending] = useActionState(actionHandler, {
		error: null,
		success: false,
	});

	useEffect(() => {
		if (state.success) {
			alert(
				isEditMode
					? "Post updated successfully!"
					: "Post published successfully!",
			);
			onClose();
		}
	}, [state.success, onClose, isEditMode]);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-[calc(100%-2rem)] mx-auto sm:max-w-4xl md:max-w-6xl bg-[#0a0a0a] border border-surface-container-highest rounded-xl shadow-2xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
				<div className="p-8 overflow-y-auto grow no-scrollbar">
					<div className="mb-8 pb-6 border-b border-surface-container-highest">
						<h2 className="font-headline-md text-headline-md text-white font-bold">
							{isEditMode ? "Edit Post" : "Compose Your Narrative"}
						</h2>
						<p className="font-body-md text-body-md text-on-surface-variant mt-1">
							{isEditMode
								? "Update your content and modify your existing narrative."
								: "Draft and publish your latest creation across your core sections."}
						</p>
					</div>

					<form action={formAction} id="post-form" className="space-y-8">
						{/* Pass the ID invisibly when updating an existing post */}
						{isEditMode && <input type="hidden" name="id" value={post.id} />}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-2">
								<label
									htmlFor="title"
									className="block font-label-sm text-label-sm text-on-surface-variant uppercase"
								>
									Post Title
								</label>
								<input
									id="title"
									name="title"
									type="text"
									required
									// Simple comment: Replaced defaultValue with value from hook
									value={formData.title}
									onChange={handleChange}
									className="w-full bg-[#141414] border border-surface-container-highest text-on-surface font-body-md py-3 px-4 rounded-DEFAULT focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none"
									placeholder="Enter a compelling headline..."
								/>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="slug"
									className="block font-label-sm text-label-sm text-on-surface-variant uppercase"
								>
									URL Slug
								</label>
								<div className="flex items-center bg-[#141414] rounded-DEFAULT border border-surface-container-highest focus-within:ring-1 focus-within:border-primary-container focus-within:ring-primary-container">
									<span className="pl-4 text-on-surface-variant font-body-md select-none">
										/blog/
									</span>
									<input
										id="slug"
										name="slug"
										type="text"
										required
										// Simple comment: Connected to hook
										value={formData.slug}
										onChange={handleChange}
										className="w-full bg-transparent border-none text-on-surface font-body-md py-3 px-2 focus:ring-0 outline-none"
										placeholder="my-awesome-post"
									/>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-2">
								<label
									htmlFor="categoryId"
									className="block font-label-sm text-label-sm text-on-surface-variant uppercase"
								>
									Category
								</label>
								<select
									id="categoryId"
									name="categoryId"
									required
									// Simple comment: Connected to hook
									value={formData.categoryId}
									onChange={handleChange}
									className="w-full bg-[#141414] border border-surface-container-highest text-on-surface font-body-md py-3 px-4 rounded-DEFAULT focus:ring-1 focus:ring-primary-container focus:border-primary-container appearance-none outline-none"
								>
									<option value="" disabled>
										Select...
									</option>
									{categories.map((cat) => (
										<option
											key={cat.categoryId}
											value={cat.categoryId}
											className="bg-surface text-on-surface"
										>
											{cat.name}
										</option>
									))}
								</select>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="featuredLink"
									className="block font-label-sm text-label-sm text-on-surface-variant uppercase"
								>
									Primary Affiliate Link
								</label>
								<input
									id="featuredLink"
									name="featuredLink"
									type="text"
									// Connected to hook
									value={formData.featuredLink}
									onChange={handleChange}
									className="w-full bg-[#141414] border border-surface-container-highest text-on-surface font-body-md py-3 px-4 rounded-DEFAULT focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none"
									placeholder="https://shopee.ph/..."
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="featuredImageInput"
								className="block font-label-sm text-label-sm text-on-surface-variant uppercase"
							>
								Featured Image (.JPG / .PNG)
							</label>
							<ImageUpload defaultValue={formData.featuredImage} />
							<input
								type="hidden"
								name="existingFeaturedImage"
								value={formData.featuredImage || ""}
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="tags"
								className="block font-label-sm text-label-sm text-on-surface-variant uppercase"
							>
								Tags (Comma Separated)
							</label>
							<input
								id="tags"
								name="tags"
								type="text"
								value={formData.tags}
								onChange={handleChange}
								className="w-full bg-[#141414] border border-surface-container-highest text-on-surface font-body-md py-3 px-4 rounded-DEFAULT focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none"
								placeholder="tech, lifestyle, web development..."
							/>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between items-end mb-1">
								<label
									htmlFor="body"
									className="block font-label-sm text-label-sm text-on-surface-variant uppercase"
								>
									Content (Markdown)
								</label>
							</div>
							<textarea
								id="body"
								name="body"
								required
								rows={10}
								// Simple comment: Connected to hook
								value={formData.body}
								onChange={handleChange}
								className="w-full bg-[#141414] border border-surface-container-highest rounded-lg p-6 text-on-surface font-mono text-sm focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none transition-all resize-none h-64 md:h-96"
								placeholder="Write your story here..."
							/>
						</div>

						{state.error && (
							<div className="rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm font-medium text-red-400">
								{state.error}
							</div>
						)}
					</form>
				</div>

				<div className="p-8 border-t border-surface-container-highest flex justify-end flex-wrap gap-4 bg-[#0e0e0e]">
					<button
						type="button"
						onClick={onClose}
						className="px-4 md:px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors"
					>
						Cancel
					</button>

					{/* Simple comment: Only show Save Draft if we are creating a brand new post */}
					{!isEditMode && (
						<button
							type="submit"
							form="post-form"
							name="status"
							value="draft"
							disabled={isPending}
							className="px-4 md:px-6 py-3 border border-on-surface text-on-surface rounded-DEFAULT font-label-sm text-label-sm uppercase tracking-wider hover:bg-on-surface hover:text-surface transition-all disabled:opacity-50"
						>
							Save Draft
						</button>
					)}

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
				</div>
			</DialogContent>
		</Dialog>
	);
}
