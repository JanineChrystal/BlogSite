"use client";

import type { ReactNode } from "react";
import { useAdminSidebar } from "@/app/hooks/useAdminSideBar";
import { LogoutDialog } from "../ui/dialogs/log-out";
import { MobileHeader } from "../ui/mobile-header";
import { Sidebar } from "./sidebar";

interface AdminShellProps {
	children: ReactNode;
}

/**
 * Composes the sidebar, mobile drawer and logout confirmation into a single
 * client boundary, so `app/(admin)/layout.tsx` itself can stay a server component.
 */
export function AdminShell({ children }: AdminShellProps) {
	const {
		isMobileNavOpen,
		setMobileNavOpen,
		isLogoutDialogOpen,
		requestLogout,
		cancelLogout,
	} = useAdminSidebar();

	return (
		<div className="min-h-screen bg-surface">
			<Sidebar onLogoutClick={requestLogout} />

			<MobileHeader
				isOpen={isMobileNavOpen}
				onOpenChange={setMobileNavOpen}
				onLogoutClick={requestLogout}
			/>

			<main className="min-h-screen bg-surface p-6 md:ml-64 md:p-16">
				{children}
			</main>

			<LogoutDialog open={isLogoutDialogOpen} onOpenChange={cancelLogout} />
		</div>
	);
}
