import { HeroSection } from "../components/sections/hero";

const CategoriesPage = async () => {
	return (
		<div className="w-full block">
			<HeroSection
				backgroundImage="/posts/aloe.png"
				backgroundAlt="The Art of Stillness"
				title={
					<>
						The Art of <br className="hidden md:block" /> Stillness
					</>
				}
				description="A deep dive into meditative photography and finding quiet moments in a chaotic urban landscape. An exclusive visual essay."
				tags={["Photography", "Editorial"]}
				actions={[{ label: "READ POST", href: "/post/art-of-stillness" }]}
			/>
		</div>
	);
};

export default CategoriesPage;
