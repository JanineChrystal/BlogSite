export type PostActionState = {
	errors?: {
		id?: string[];
		title?: string[];
		slug?: string[];
		categoryId?: string[];
		body?: string[];
		featuredLink?: string[];
		status?: string[];
		tags?: string[];
		featuredImage?: string[];
		_form?: string[];
	};
	success: boolean;
};
