import { notFound } from "next/navigation";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/data/post";
import { CategoryPostsSection } from "../../components/sections/category-posts-section";
import { HeroSection } from "../../components/sections/hero";

interface CategoryPageProps {
	params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	const { slug } = await params;

	// Fetch category details and posts in parallel
	const [category, paginatedPosts] = await Promise.all([
		getCategoryBySlug(slug),
		getPostsByCategory(slug),
	]);

	// If the category doesn't exist, show a 404 page
	if (!category) {
		notFound();
	}

	const { posts, hasMore } = paginatedPosts;

	return (
		<div className="w-full bg-surface">
			<HeroSection
				variant="category"
				backgroundImage={
					category.heroImage ?? "/images/default-category-hero.jpg"
				}
				backgroundAlt={`Hero image for ${category.name}`}
				title={category.name}
				description={category.description}
			/>
			<CategoryPostsSection
				categoryName={category.name}
				posts={posts}
				hasMore={hasMore}
			/>
		</div>
	);
}
