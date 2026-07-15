import type { SortColumn } from "@/app/hooks/usePostSort";

export interface TableHeader {
	label: string;
	sortKey?: SortColumn;
	alignRight?: boolean;
}

// Array containing all header configurations
export const POST_TABLE_HEADERS: TableHeader[] = [
	{ label: "TITLE", sortKey: "title" },
	{ label: "CATEGORY", sortKey: "category" },
	{ label: "DATE PUBLISHED", sortKey: "date" },
	{ label: "STATUS" },
	{ label: "ACTIONS", alignRight: true },
];
