import Footer from "./components/layout/tempFooter";
import { Navbar } from "./components/layout/tempNav";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			<main className="w-full grow">{children}</main>
			<Footer />
		</>
	);
}
