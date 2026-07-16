/**
 * Determines whether a nav item should render as "active" for the current pathname.
 * Exact match for the dashboard root, prefix match for nested routes
 * (e.g. "/admin/posts/123" keeps "Manage Posts" highlighted).
 */
export function isNavItemActive(href: string, pathname: string): boolean {
	if (href === "/admin") {
		return pathname === href;
	}
	return pathname === href || pathname.startsWith(`${href}/`);
}
