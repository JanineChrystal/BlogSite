"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/buttons/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface LogoutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Hook up your real sign-out call (clear session/cookies, call API, etc.) here. */
	onConfirm?: () => void;
}

export function LogoutDialog({
	open,
	onOpenChange,
	onConfirm,
}: LogoutDialogProps) {
	const router = useRouter();

	const handleConfirm = () => {
		onConfirm?.();
		onOpenChange(false);
		router.push("/login");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-outline-variant bg-surface-container text-on-surface">
				<DialogHeader>
					<DialogTitle>Log out</DialogTitle>
					<DialogDescription className="text-on-surface-variant">
						Are you sure you want to log out of the admin dashboard?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						className="bg-primary-container text-on-primary-container hover:bg-primary-container/90"
						onClick={handleConfirm}
					>
						Log out
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
