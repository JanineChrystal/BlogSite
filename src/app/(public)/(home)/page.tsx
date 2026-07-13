import { Play } from "lucide-react";
import {
	getLatestPost,
	getPopularCreativeWriting,
	getPopularEntertainment,
	getPopularProductReviews,
	getWhatsNew,
} from "@/lib/data";
import { getHomeSections } from "@/lib/types/home";
import { CategorySection } from "../components/sections/category";
import { HeroSection } from "../components/sections/hero";

const HomePage = async () => {
	// Fetch data for all sections in parallel using the Drizzle ORM functions.
	const [
		latestPost,
		whatsNew,
		popularCreativeWriting,
		popularEntertainment,
		popularProductReviews,
	] = await Promise.all([
		getLatestPost(),
		getWhatsNew(),
		getPopularCreativeWriting(),
		getPopularEntertainment(),
		getPopularProductReviews(),
	]);

	const homeSections = getHomeSections({
		whatsNew,
		popularCreativeWriting,
		popularEntertainment,
		popularProductReviews,
	});

	return (
		<div className="w-full block">
			{latestPost && (
				<HeroSection
					backgroundImage={latestPost.imageUrl}
					backgroundAlt={latestPost.title}
					title={latestPost.title}
					tags={latestPost.category.name ? [latestPost.category.name] : []}
					actions={[
						{
							label: "Read Post",
							href: `/post/${latestPost.slug}`,
							icon: Play,
						},
					]}
				/>
			)}

			{homeSections.map((section) => (
				<CategorySection key={section.id} {...section} />
			))}
		</div>
	);
};

export default HomePage;
