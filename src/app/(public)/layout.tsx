import Footer from "./components/layout/Footer";
import { Navbar } from "./components/layout/Nav";

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
