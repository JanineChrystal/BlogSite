import { notFound } from "next/navigation";
import {
	getCategorizedPosts,
	getCategoryBySlug,
	getTagsByCategory,
} from "@/lib/data";
import { CategoryPostsSection } from "../../components/sections/category-posts-section";
import { HeroSection } from "../../components/sections/hero";

interface CategoryPageProps {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{
		tags?: string;
		sort?: string;
		page?: string;
	}>;
}

export default async function CategoryPage({
	params,
	searchParams,
}: CategoryPageProps) {
	const { slug } = await params;
	const resolvedSearchParams = await searchParams;
	const tagSlugs = resolvedSearchParams.tags?.split(",").filter(Boolean);

	// Fetch category details and posts in parallel
	const [category, postsResult, tags] = await Promise.all([
		getCategoryBySlug(slug),
		getCategorizedPosts({
			categorySlug: slug,
			tagSlugs,
			sortBy: resolvedSearchParams.sort,
			page: resolvedSearchParams.page,
		}),
		getTagsByCategory(slug),
	]);

	// If the category doesn't exist, show a 404 page
	if (!category) {
		notFound();
	}

	const { posts, hasMore } = postsResult;

	const heroImage = posts[0]?.coverImage ?? "/images/default-category-hero.jpg";

	return (
		<div className="w-full bg-surface">
			<HeroSection
				variant="category"
				backgroundImage={heroImage}
				backgroundAlt={`Hero image for ${category.name}`}
				title={category.name}
			/>
			<CategoryPostsSection
				categoryName={category.name}
				posts={posts}
				tags={tags}
				hasMore={hasMore}
			/>
		</div>
	);
}
