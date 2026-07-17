import { useState } from "react";

// represents the type of data you are loading (Posts, Comments, etc.)
export function useLazyLoad<T>(
	// How many items did the server render initially?
	initialItemCount: number,
	// The action now accepts an exact offset number instead of a page
	fetchAction: (offset: number) => Promise<T[]>,
) {
	const [isFetching, setIsFetching] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [currentOffset, setCurrentOffset] = useState(initialItemCount);
	const [newlyLoadedData, setNewlyLoadedData] = useState<T[]>([]);

	const loadMore = async () => {
		if (isFetching || !hasMore) return;

		setIsFetching(true);
		try {
			// Fetch new items starting from our current offset count
			const newItems = await fetchAction(currentOffset);

			if (newItems.length === 0) {
				// No more items in the database
				setHasMore(false);
			} else {
				// Simple comment: Append the new items to the bottom of the list
				setNewlyLoadedData((prev) => [...prev, ...newItems]);

				// Increase the offset by exactly how many items we just fetched
				setCurrentOffset((prev) => prev + newItems.length);
			}
		} catch (error) {
			console.error("Failed to lazy load items:", error);
		} finally {
			setIsFetching(false);
		}
	};

	return {
		isFetching,
		hasMore,
		loadMore,
		newlyLoadedData,
	};
}
