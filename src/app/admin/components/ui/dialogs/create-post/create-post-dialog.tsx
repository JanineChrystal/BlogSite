"use client";

import { useActionState, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { createPostAction } from "@/lib/actions/post";

interface CreatePostDialogProps {
	categories: { categoryId: string; name: string }[];
}

export function CreatePostDialog({ categories }: CreatePostDialogProps) {
	const [open, setOpen] = useState(false);
	const [state, formAction, isPending] = useActionState(createPostAction, {
		error: null,
		success: false,
	});

	useEffect(() => {
		if (state.success) {
			setOpen(false);
		}
	}, [state.success]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<button
						type="button"
						className="bg-primary-container text-white p-3 md:px-6 md:py-3 rounded-DEFAULT font-label-sm text-label-sm uppercase tracking-wider hover:bg-inverse-primary transition-colors duration-300 shadow-[0_4px_14px_0_rgba(229,9,20,0.39)] hover:shadow-[0_6px_20px_rgba(229,9,20,0.23)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0"
					>
						<span className="material-symbols-outlined text-lg md:text-sm">
							add
						</span>
						{/* Simple comment: Hidden on mobile, visible inline on medium screens and up */}
						<span className="hidden md:inline">CREATE NEW POST</span>
					</button>
				}
			/>

			{/* Shadcn handles the dark overlay automatically. */}
			<DialogContent className="max-w-4xl bg-[#0a0a0a] border border-surface-container-highest rounded-xl shadow-2xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
				<div className="p-8 border-b border-surface-container-highest">
					<h2 className="font-headline-md text-headline-md text-white font-bold">
						Compose Your Narrative
					</h2>
					<p className="font-body-md text-body-md text-on-surface-variant mt-1">
						Draft and publish your latest creation across your core sections.
					</p>
				</div>

				<div className="p-8 overflow-y-auto grow no-scrollbar">
					<form action={formAction} id="create-post-form" className="space-y-8">
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
									className="w-full bg-[#141414] border border-surface-container-highest text-on-surface font-body-md py-3 px-4 rounded-DEFAULT focus:ring-1 focus:ring-primary-container focus:border-primary-container appearance-none outline-none"
								>
									<option value="" disabled selected>
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
									className="w-full bg-[#141414] border border-surface-container-highest text-on-surface font-body-md py-3 px-4 rounded-DEFAULT focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none"
									placeholder="https://shopee.ph/..."
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="featuredImage"
								className="block font-label-sm text-label-sm text-on-surface-variant uppercase"
							>
								Featured Image URL
							</label>
							<input
								id="featuredImage"
								name="featuredImage"
								type="text"
								className="w-full bg-[#141414] border border-surface-container-highest text-on-surface font-body-md py-3 px-4 rounded-DEFAULT focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none"
								placeholder="/posts/image.png"
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
								<div className="flex gap-3 text-on-surface-variant">
									<button
										className="hover:text-primary transition-colors"
										type="button"
									>
										<span className="material-symbols-outlined text-sm">
											format_bold
										</span>
									</button>
									<button
										className="hover:text-primary transition-colors"
										type="button"
									>
										<span className="material-symbols-outlined text-sm">
											format_italic
										</span>
									</button>
									<button
										className="hover:text-primary transition-colors"
										type="button"
									>
										<span className="material-symbols-outlined text-sm">
											link
										</span>
									</button>
									<button
										className="hover:text-primary transition-colors"
										type="button"
									>
										<span className="material-symbols-outlined text-sm">
											image
										</span>
									</button>
								</div>
							</div>
							<textarea
								id="body"
								name="body"
								required
								rows={10}
								className="w-full bg-[#141414] border border-surface-container-highest rounded-lg p-6 text-on-surface font-mono text-sm focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none transition-all resize-none h-64"
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

				<div className="p-8 border-t border-surface-container-highest flex justify-end gap-4 bg-[#0e0e0e]">
					<button
						type="button"
						onClick={() => setOpen(false)}
						className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors"
					>
						Cancel
					</button>
					{/* Using the button's "value" attribute allows the server action to know which button was clicked (Draft vs Publish) */}
					<button
						type="submit"
						form="create-post-form"
						name="status"
						value="draft"
						disabled={isPending}
						className="px-6 py-3 border border-on-surface text-on-surface rounded-DEFAULT font-label-sm text-label-sm uppercase tracking-wider hover:bg-on-surface hover:text-surface transition-all disabled:opacity-50"
					>
						Save Draft
					</button>
					<button
						type="submit"
						form="create-post-form"
						name="status"
						value="published"
						disabled={isPending}
						className="bg-primary-container text-white px-8 py-3 rounded-DEFAULT font-label-sm text-label-sm uppercase tracking-wider hover:bg-inverse-primary transition-all shadow-lg disabled:opacity-50"
					>
						{isPending ? "Saving..." : "Publish Post"}
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
