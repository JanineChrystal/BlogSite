import { getAllPosts } from "@/lib/data/post";
import { CategoryPostsSection } from "../components/sections/category-posts-section";
import { HeroSection } from "../components/sections/hero";

const AllPostsPage = async () => {
	const { posts, hasMore } = await getAllPosts();

	return (
		<div className="w-full bg-surface">
			<HeroSection
				variant="feature"
				kicker="BLOG"
				title="Words & Wonder"
				description="A collection of thoughts, stories, and reviews. Dive into a world of creative expression and honest reflections."
			/>

			<CategoryPostsSection
				categoryName="All Posts"
				posts={posts}
				hasMore={hasMore}
			/>
		</div>
	);
};

export default AllPostsPage;
