import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/src/components/ui/button";

export function HeroSection() {
	return (
		<section className="relative w-full min-h-[60vh] md:min-h-[80vh] flex items-center px-4 md:px-8 py-12 md:py-16 bg-black">
			{/* background image container */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/posts/aloe.png"
					alt="The Art of Stillness"
					fill
					priority
					className="w-full h-full object-cover opacity-40"
				/>
				<div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-black via-black/80 to-transparent" />
			</div>

			{/* foreground content wrapper */}
			<div className="relative z-10 w-full max-w-2xl text-white mt-12 md:mt-0">
				<h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 md:mb-6 leading-tight tracking-tight">
					The Art of <br className="hidden md:block" /> Stillness
				</h1>
				<p className="text-base md:text-lg text-zinc-300 mb-6 md:mb-8 max-w-md leading-relaxed">
					A deep dive into meditative photography and finding quiet moments in a
					chaotic urban landscape. An exclusive visual essay.
				</p>

				{/* badge tags */}
				<div className="flex flex-wrap gap-2 md:space-x-3 mb-8 md:mb-10">
					<span className="px-3 md:px-4 py-1 text-[10px] md:text-xs font-semibold rounded-full border border-zinc-600">
						Photography
					</span>
					<span className="px-3 md:px-4 py-1 text-[10px] md:text-xs font-semibold rounded-full border border-zinc-600">
						Editorial
					</span>
				</div>

				{/* responsive button stack */}
				<div className="flex flex-col sm:flex-row gap-4">
					<Link
						href="/post/art-of-stillness"
						className={cn(
							buttonVariants({ variant: "default" }),
							"bg-red-600 hover:bg-red-700 text-white font-bold rounded-none px-8 py-6 flex items-center justify-center",
						)}
					>
						READ POST
					</Link>
				</div>
			</div>
		</section>
	);
}
