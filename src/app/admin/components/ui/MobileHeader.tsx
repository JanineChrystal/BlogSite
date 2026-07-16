"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/buttons/Button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/Sheet";
import { SidebarContent } from "../layout/SideBarContent";

interface MobileHeaderProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onLogoutClick: () => void;
}

/** Sticky top bar + slide-over drawer, shown only below the md breakpoint. */
export function MobileHeader({
	isOpen,
	onOpenChange,
	onLogoutClick,
}: MobileHeaderProps) {
	return (
		<header className="sticky top-0 z-40 flex items-center justify-between border-b border-outline-variant bg-surface px-4 py-3 md:hidden">
			<span className="font-heading text-body-lg font-black tracking-tighter text-on-surface">
				Chrystl.Blogs
			</span>

			<Sheet open={isOpen} onOpenChange={onOpenChange}>
				<SheetTrigger
					render={
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label="Open navigation menu"
							className="text-on-surface hover:bg-surface-container-high hover:text-on-surface"
						/>
					}
				>
					<Menu className="size-6" />
				</SheetTrigger>

				<SheetContent
					side="left"
					className="w-64 border-outline-variant bg-surface p-0"
				>
					<SheetTitle className="sr-only">Admin navigation</SheetTitle>
					<SidebarContent
						onLogoutClick={onLogoutClick}
						onNavigate={() => onOpenChange(false)}
					/>
				</SheetContent>
			</Sheet>
		</header>
	);
}
