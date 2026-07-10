import { getCategoryBySlug, getPostsByCategory } from "@/lib/data/post";
import { CategoryPostsSection } from "../components/sections/category-posts-section";
import { HeroSection } from "../components/sections/hero";

// TEMP: hardcoded until category selection is wired up (navbar link -> slug, or searchParams)
const TEMP_CATEGORY_SLUG = "travel-lifestyle";

const CategoriesPage = async () => {
	const category = await getCategoryBySlug(TEMP_CATEGORY_SLUG);
	if (!category) return null; // mock data guarantees this won't hit right now

	const { posts, hasMore } = await getPostsByCategory(TEMP_CATEGORY_SLUG);

	return (
		<div className="w-full bg-surface">
			<HeroSection
				variant="category"
				backgroundImage={category.heroImage}
				backgroundAlt={category.name}
				kicker="CATEGORY"
				title={category.name}
				description={category.description}
				actions={[{ label: "Read Post", href: "#" }]}
			/>

			<CategoryPostsSection
				categoryName={category.name}
				posts={posts}
				hasMore={hasMore}
			/>
		</div>
	);
};

export default CategoriesPage;
