import type { LucideIcon } from "lucide-react";

/**
 * Shape of a single sidebar entry. Both the primary and bottom nav groups
 * use this same interface (DRY) — components render off this abstraction
 * rather than knowing about "top items" vs "bottom items" (DIP).
 */
export interface NavItem {
	/** Stable identifier. Used for React keys and to special-case actions like logout. */
	id: string;
	label: string;
	href: string;
	icon: LucideIcon;
}
