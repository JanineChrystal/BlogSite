"use client";

import { Button } from "@/components/ui/buttons/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/tempDialog";
import { logoutAction } from "@/lib/actions/auth-admin/log-out";

interface LogoutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm?: () => void;
}

export function LogoutDialog({
	open,
	onOpenChange,
	onConfirm,
}: LogoutDialogProps) {
	const handleConfirm = async () => {
		onConfirm?.();
		onOpenChange(false);

		// Trigger the server action to securely delete the cookie and redirect
		await logoutAction();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="border-outline-variant bg-surface-container text-on-surface"
			>
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
