import { FileText, LogOut, MessagesSquare } from "lucide-react";
import type { NavItem } from "@/lib/types/nav";

/** Id used to identify the logout entry so the sidebar can open a dialog instead of routing. */
export const LOGOUT_ITEM_ID = "logout";

/**
 * Primary navigation, rendered in the upper section of the sidebar.
 * To add/remove/reorder a menu item, edit this array only.
 */
export const NAV_ITEMS: NavItem[] = [
	{
		id: "posts",
		label: "Manage Posts",
		href: "/admin/post-management",
		icon: FileText,
	},
	{
		id: "comments",
		label: "Moderate Comments",
		href: "/admin/comments",
		icon: MessagesSquare,
	},
];

/** Secondary navigation, pinned to the bottom of the sidebar. */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
	{
		id: LOGOUT_ITEM_ID,
		label: "Logout",
		href: "#",
		icon: LogOut,
	},
];
