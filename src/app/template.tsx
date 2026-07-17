"use client";

import { motion } from "framer-motion";

export default function AdminTemplate({
	children,
}: {
	children: React.ReactNode;
}) {
	const variants = {
		hidden: { opacity: 0, y: 20 },
		enter: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			variants={variants}
			initial="hidden"
			animate="enter"
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="w-full h-full"
		>
			{children}
		</motion.div>
	);
}
