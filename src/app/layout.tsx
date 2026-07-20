import type { Metadata } from "next";
import "@/app/globals.css";
import { Geist, Inter, Montserrat } from "next/font/google";
import { cn } from "@/lib/utils/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
	weight: ["700", "900"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
	title: "Chrystl.Blog",
	description: "A personal blog in variety.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cn(
				"font-sans",
				geist.variable,
				montserrat.variable,
				inter.variable,
			)}
		>
			<head>
				{/* Simple comment: Load the Material Symbols font to render the search and delete icons correctly */}
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body
				className="relative min-h-screen flex flex-col m-0 p-0"
				suppressHydrationWarning
			>
				{children}
			</body>
		</html>
	);
}
