import { CategorySection } from "../components/sections/category";
import { HeroSection } from "../components/sections/hero";

const HomePage = async () => {
	// Temporary mock data.
	const trendingReviews = [
		{
			id: "1",
			title: "The Minimalist's Phone",
			categoryLabel: "Tech Review",
			imageUrl: "/posts/aloe.png",
			slug: "minimalist-phone",
		},
		{
			id: "2",
			title: "Typing in the Dark",
			categoryLabel: "Workspace",
			imageUrl: "/posts/gg.png",
			slug: "typing-in-the-dark",
		},
		{
			id: "3",
			title: "Soundscapes",
			categoryLabel: "Audio Gear",
			imageUrl: "/posts/nosibalasi.png",
			slug: "soundscapes",
		},
	];

	return (
		<div className="w-full block">
			<HeroSection />

			{/* Now we are passing all the required props to satisfy TypeScript */}
			<CategorySection
				title="Trending Reviews"
				categorySlug="products-review"
				posts={trendingReviews}
				cardOrientation="landscape"
			/>
		</div>
	);
};

export default HomePage;
