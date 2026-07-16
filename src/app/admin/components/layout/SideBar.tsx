import { SidebarContent } from "./SideBarContent";

interface SidebarProps {
	onLogoutClick: () => void;
}

/** always-visible sidebar for md+ screens. Hidden on mobile. */
export function Sidebar({ onLogoutClick }: SidebarProps) {
	return (
		<nav
			aria-label="Admin navigation"
			className="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col border-r border-outline-variant bg-surface md:flex"
		>
			<SidebarContent onLogoutClick={onLogoutClick} />
		</nav>
	);
}
