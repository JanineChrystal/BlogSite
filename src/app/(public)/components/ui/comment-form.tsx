"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/src/components/ui/buttons/button";
import { Input } from "@/src/components/ui/input-group/input";
import { Textarea } from "@/src/components/ui/input-group/textarea";

interface CommentFormProps {
	onSubmit?: (data: { name: string; content: string }) => void;
}

const fieldClass =
	"h-auto rounded-none border-0 border-b-2 border-surface-container-high bg-surface-container-low px-2 py-3 font-body text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus-visible:border-primary-container focus-visible:ring-0";

export function CommentForm({ onSubmit }: CommentFormProps) {
	const [name, setName] = useState("");
	const [content, setContent] = useState("");

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!name.trim() || !content.trim()) return;
		onSubmit?.({ name, content }); // TODO: POST to comments API once available
		setName("");
		setContent("");
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="mb-12 rounded-xl border border-surface-container-high bg-surface-container-low p-6"
		>
			<div className="mb-4">
				<label
					htmlFor="comment-name"
					className="mb-2 block font-heading text-label-sm uppercase text-secondary"
				>
					Display Name
				</label>
				<Input
					id="comment-name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter your name"
					className={fieldClass}
				/>
			</div>
			<div className="mb-6">
				<label
					htmlFor="comment-content"
					className="mb-2 block font-heading text-label-sm uppercase text-secondary"
				>
					Join the conversation
				</label>
				<Textarea
					id="comment-content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={4}
					placeholder="What are your thoughts on the cinematography?"
					className={cn(fieldClass, "min-h-0 resize-none")}
				/>
			</div>
			<div className="flex justify-end">
				<Button
					type="submit"
					className="h-auto rounded bg-primary-container px-8 py-3 font-heading text-label-sm uppercase tracking-wider text-white shadow-[0px_4px_14px_rgba(229,9,20,0.4)] hover:bg-inverse-primary"
				>
					Post Comment
				</Button>
			</div>
		</form>
	);
}
