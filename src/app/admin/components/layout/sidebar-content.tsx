import { BOTTOM_NAV_ITEMS, NAV_ITEMS } from "@/app/admin/constants/nav";
import { SidebarNavItem } from "./sidebar-items";

interface SidebarContentProps {
	onLogoutClick: () => void;
	onNavigate?: () => void;
}

/**
 * Pure navigation markup shared by the desktop sidebar and the mobile drawer.
 * It has no idea whether it's rendered fixed on the left or inside a Sheet —
 * that's the wrappers' job (Sidebar / MobileHeader).
 */
export function SidebarContent({
	onLogoutClick,
	onNavigate,
}: SidebarContentProps) {
	return (
		<div className="flex h-full flex-col justify-between py-8">
			<div>
				<div className="mb-12 px-6">
					<h1 className="font-heading text-body-lg font-black tracking-tighter text-on-surface">
						Chrystl.Blogs
					</h1>
					<p className="mt-2 text-body-md font-medium uppercase tracking-widest text-on-surface-variant opacity-70">
						Admin
					</p>
				</div>

				<ul className="space-y-2">
					{NAV_ITEMS.map((item) => (
						<SidebarNavItem key={item.id} item={item} onNavigate={onNavigate} />
					))}
				</ul>
			</div>

			<ul className="space-y-2">
				{BOTTOM_NAV_ITEMS.map((item) => (
					<SidebarNavItem
						key={item.id}
						item={item}
						onLogoutClick={onLogoutClick}
						onNavigate={onNavigate}
					/>
				))}
			</ul>
		</div>
	);
}
