import { type ChangeEvent, useEffect, useState } from "react";

interface PostItem {
	id: string;
	title: string;
	slug: string;
	categoryId: string;
	featuredLink?: string | null;
	featuredImage?: string | null;
	tags?: string | null;
	body: string;
}

export function usePostForm(post: PostItem | null, isOpen: boolean) {
	// Group all form fields into a single object for cleaner state management
	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		categoryId: "",
		featuredLink: "",
		featuredImage: "",
		tags: "",
		body: "",
	});

	// Synchronize the state whenever the dialog opens or the post changes
	useEffect(() => {
		if (isOpen) {
			if (post) {
				setFormData({
					title: post.title || "",
					slug: post.slug || "",
					categoryId: post.categoryId || "",
					featuredLink: post.featuredLink || "",
					featuredImage: post.featuredImage || "",
					tags: post.tags || "",
					body: post.body || "",
				});
			} else {
				setFormData({
					title: "",
					slug: "",
					categoryId: "",
					featuredLink: "",
					featuredImage: "",
					tags: "",
					body: "",
				});
			}
		}
	}, [post, isOpen]);

	// A universal handler for all text inputs, textareas, and selects
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return {
		formData,
		setFormData,
		handleChange,
	};
}
