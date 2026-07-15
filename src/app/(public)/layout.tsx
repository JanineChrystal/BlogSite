import Footer from "./components/layout/footer";
import { Navbar } from "./components/layout/nav";

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
