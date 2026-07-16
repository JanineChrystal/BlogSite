import { useMemo, useState } from "react";

export type SortColumn = "title" | "category" | "date";
export type SortDirection = "asc" | "desc";

export interface SortablePost {
	title: string;
	categoryName: string | null;
	createdAt: Date;
}

export function usePostSort<T extends SortablePost>(initialData: T[]) {
	const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

	const handleSort = (column: SortColumn) => {
		if (sortColumn === column) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	// useMemo caches the sorted array so it doesn't recalculate on every single render
	const sortedData = useMemo(() => {
		if (!sortColumn) return initialData;

		return [...initialData].sort((a, b) => {
			let valueA: string | number = "";
			let valueB: string | number = "";

			if (sortColumn === "title") {
				valueA = a.title.toLowerCase();
				valueB = b.title.toLowerCase();
			} else if (sortColumn === "category") {
				valueA = (a.categoryName || "").toLowerCase();
				valueB = (b.categoryName || "").toLowerCase();
			} else if (sortColumn === "date") {
				valueA = new Date(a.createdAt).getTime();
				valueB = new Date(b.createdAt).getTime();
			}

			if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
			if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});
	}, [initialData, sortColumn, sortDirection]);

	return { sortedData, sortColumn, sortDirection, handleSort };
}
