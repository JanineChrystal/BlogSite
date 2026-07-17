export type CommentFormState = {
	errors?: Record<string, string[] | undefined> & { _form?: string[] };
	success?: boolean;
};
