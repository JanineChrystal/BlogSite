// This file centralizes the configuration for the homepage sections,
// making it easier to manage the layout and content of the homepage.

// This interface is specific to the post data needed for homepage cards.
export interface HomePagePost {
	id: string;
	title: string;
	categoryLabel?: string | null;
	imageUrl: string;
	slug: string;
}

export interface SectionProps {
	id: string;
	title: string;
	viewMoreHref: string;
	posts: HomePagePost[];
	cardOrientation?: "landscape" | "portrait";
	layout?: "grid" | "carousel";
	captionEmphasis?: "bold" | "medium";
}

interface HomeSectionsData {
	whatsNew: HomePagePost[];
	popularCreativeWriting: HomePagePost[];
	popularEntertainment: HomePagePost[];
	popularProductReviews: HomePagePost[];
}

/**
 * Generates the configuration for the homepage sections.
 * This function takes the dynamically fetched post data and maps it
 * to a static structure that defines the homepage layout.
 * @param data - The fetched post data for each section.
 * @returns An array of section configurations.
 */
export const getHomeSections = (data: HomeSectionsData): SectionProps[] => {
	const {
		whatsNew,
		popularCreativeWriting,
		popularEntertainment,
		popularProductReviews,
	} = data;

	return [
		{
			id: "whats-new",
			title: "What's New",
			viewMoreHref: "/blog",
			posts: whatsNew,
			cardOrientation: "landscape",
			layout: "grid",
		},
		{
			id: "creative-writing",
			title: "Creative Writing",
			viewMoreHref: "/category/creative-writing",
			posts: popularCreativeWriting,
			cardOrientation: "portrait",
			layout: "carousel",
		},
		{
			id: "entertainment",
			title: "Entertainment",
			viewMoreHref: "/category/entertainment",
			posts: popularEntertainment,
			cardOrientation: "portrait",
			layout: "carousel",
			captionEmphasis: "medium",
		},
		{
			id: "product-reviews",
			title: "Product Reviews",
			viewMoreHref: "/category/products-review",
			posts: popularProductReviews,
			cardOrientation: "portrait",
			layout: "carousel",
			captionEmphasis: "medium",
		},
	];
};
