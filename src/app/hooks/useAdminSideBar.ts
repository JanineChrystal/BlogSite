"use client";

import { useCallback, useState } from "react";

/**
 * Encapsulates the interactive state for the admin shell:
 * - mobile drawer open/close
 * - logout confirmation dialog open/close
 *
 * Keeping this in a hook (rather than inline in components) is what lets
 * Sidebar / MobileHeader / LogoutDialog stay presentational and easy to
 * test or reuse on their own (single responsibility per file).
 */
export function useAdminSidebar() {
	const [isMobileNavOpen, setMobileNavOpen] = useState(false);
	const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

	const requestLogout = useCallback(() => {
		setMobileNavOpen(false);
		setLogoutDialogOpen(true);
	}, []);

	const cancelLogout = useCallback(() => setLogoutDialogOpen(false), []);

	return {
		isMobileNavOpen,
		setMobileNavOpen,
		isLogoutDialogOpen,
		requestLogout,
		cancelLogout,
	};
}
