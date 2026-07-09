import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Footer from "./public/components/layout/footer";
import { Navbar } from "./public/components/layout/nav";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Chrystl.Blog",
	description: "A personal in variety.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={cn("font-sans", geist.variable)}>
			<body className="relative min-h-screen flex flex-col m-0 p-0">
				<Navbar />
				<main className="w-full grow">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
