export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="flex min-h-screen">
				{/* Sidebar */}
				<aside className="w-64 bg-gray-900 text-white p-4">
					<h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
					<nav className="space-y-2">
						<a href="/admin/dashboard" className="block hover:text-gray-300">
							Dashboard
						</a>
						<a
							href="/admin/post-management"
							className="block hover:text-gray-300"
						>
							Posts
						</a>
						<a href="/admin/settings" className="block hover:text-gray-300">
							Settings
						</a>
					</nav>
				</aside>

				{/* Main content */}
				<main className="flex-1 bg-gray-50 p-6">{children}</main>
			</body>
		</html>
	);
}
