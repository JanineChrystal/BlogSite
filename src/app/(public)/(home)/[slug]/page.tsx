import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
	getCategorizedPosts,
	getCategoryBySlug,
	getInitialPostCount,
	getTagsByCategory,
} from "@/lib/db/queries/data";
import { CategoryPostsSection } from "../../components/sections/CategoryPostSection";
import { HeroSection } from "../../components/sections/HeroSection";
import type { Tag } from "../../components/ui/CategoryToolBar";
import { CategoryPostsSectionSkeleton } from "./loading";

interface CategoryPageProps {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{
		tags?: string;
		sort?: string;
		page?: string;
	}>;
}

async function PostsList({
	categorySlug,
	categoryName,
	tags,
	tagSlugs,
	sort,
	page,
}: {
	categorySlug: string;
	categoryName: string;
	tags: Tag[];
	tagSlugs?: string[];
	sort?: string;
	page?: string;
}) {
	const { posts, hasMore } = await getCategorizedPosts({
		categorySlug,
		tagSlugs,
		sortBy: sort,
		page,
	});

	return (
		<CategoryPostsSection
			categoryName={categoryName}
			posts={posts}
			tags={tags}
			hasMore={hasMore}
		/>
	);
}

export default async function CategoryPage({
	params,
	searchParams,
}: CategoryPageProps) {
	const { slug } = await params;
	const resolvedSearchParams = await searchParams;
	const tagSlugs = resolvedSearchParams.tags?.split(",").filter(Boolean);

	// Fetch metadata and the initial post count for the skeleton
	const [category, tags, initialPostCount] = await Promise.all([
		getCategoryBySlug(slug),
		getTagsByCategory(slug),
		getInitialPostCount({ categorySlug: slug, tagSlugs }),
	]);

	// If the category doesn't exist, show a 404 page
	if (!category) {
		notFound();
	}

	// NOTE: Because we are deferring the post fetching to the <PostsList>
	// component, we can't use the first post's image for the hero section
	// during the initial render. We'll use a default image instead.
	const heroImage = "/images/default-category-hero.jpg";

	return (
		<div className="w-full bg-surface">
			<HeroSection
				variant="category"
				backgroundImage={heroImage}
				backgroundAlt={`Hero image for ${category.name}`}
				title={category.name}
			/>
			<Suspense
				// The key prop is important here to make Suspense re-render the
				// fallback when search params change (e.g., filtering by tags).
				key={resolvedSearchParams.tags ?? "all"}
				fallback={<CategoryPostsSectionSkeleton postCount={initialPostCount} />}
			>
				<PostsList
					categorySlug={slug}
					categoryName={category.name}
					tags={tags}
					tagSlugs={tagSlugs}
					sort={resolvedSearchParams.sort}
					page={resolvedSearchParams.page}
				/>
			</Suspense>
		</div>
	);
}
