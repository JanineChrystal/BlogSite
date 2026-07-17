"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onClose: () => void;
}

export function ConfirmModal({
	isOpen,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	onClose,
}: ConfirmModalProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!isOpen || !mounted) return null;
	return createPortal(
		<div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left">
			<div
				className="w-full max-w-md rounded-xl bg-[#141414] border border-white/10 shadow-2xl p-6"
				role="dialog"
				aria-modal="true"
			>
				<h2 className="text-xl font-medium text-white mb-2">{title}</h2>
				<p className="text-on-surface-variant font-body-md mb-6">{message}</p>

				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 rounded-DEFAULT border border-white/10 text-on-surface-variant hover:bg-white/5 hover:text-white transition-colors font-label-sm"
					>
						{cancelText}
					</button>
					<button
						type="button"
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className="px-4 py-2 rounded-DEFAULT bg-red-600 text-white hover:bg-red-700 transition-colors font-label-sm"
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
