"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOGOUT_ITEM_ID } from "@/app/admin/constants/nav";
import type { NavItem } from "@/lib/types/nav";
import { isNavItemActive } from "@/lib/utils/nav";
import { cn } from "@/lib/utils/utils";

interface SidebarNavItemProps {
	item: NavItem;
	/** Called instead of navigating when this row is the logout action. */
	onLogoutClick?: () => void;
	/** Called after navigating — used to close the mobile drawer on selection. */
	onNavigate?: () => void;
}

export function SidebarNavItem({
	item,
	onLogoutClick,
	onNavigate,
}: SidebarNavItemProps) {
	const pathname = usePathname();
	const Icon = item.icon;
	const isLogout = item.id === LOGOUT_ITEM_ID;
	const active = !isLogout && isNavItemActive(item.href, pathname);

	const rowClasses = cn(
		"flex items-center gap-4 px-6 py-4 text-label-sm uppercase tracking-widest transition-colors duration-200",
		active
			? "border-r-2 border-primary-container bg-primary-container/10 font-bold text-primary-container"
			: "font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
	);

	if (isLogout) {
		return (
			<li>
				<button
					type="button"
					onClick={onLogoutClick}
					className={cn(rowClasses, "w-full text-left")}
				>
					<Icon className="size-5 shrink-0" aria-hidden />
					<span>{item.label}</span>
				</button>
			</li>
		);
	}

	return (
		<li>
			<Link
				href={item.href}
				onClick={onNavigate}
				className={rowClasses}
				aria-current={active ? "page" : undefined}
			>
				<Icon className="size-5 shrink-0" aria-hidden />
				<span>{item.label}</span>
			</Link>
		</li>
	);
}
