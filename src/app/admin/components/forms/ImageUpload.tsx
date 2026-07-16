"use client";

import Image from "next/image";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";

interface ImageUploadProps {
	defaultValue?: string | null;
}

export function ImageUpload({ defaultValue }: ImageUploadProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		defaultValue || null,
	);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	// Process the file when it is dropped into the zone
	const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const file = e.dataTransfer?.files?.[0];

		if (file?.type.startsWith("image/")) {
			updatePreview(file);
			if (fileInputRef.current) {
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(file);
				fileInputRef.current.files = dataTransfer.files;
			}
		}
	};

	// Process the file when the user clicks to browse
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];
		if (file) {
			updatePreview(file);
		}
	};

	// Generate a temporary browser URL to show the image preview
	const updatePreview = (file: File) => {
		const objectUrl = URL.createObjectURL(file);
		setPreviewUrl(objectUrl);
	};

	return (
		<div className="w-full">
			{/* The id here connects directly to the label's htmlFor attribute */}
			<input
				id="featuredImageInput"
				type="file"
				name="featuredImage"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept="image/jpeg, image/png"
				className="sr-only"
			/>

			{/* Using a label automatically triggers the file input on click and keyboard activation */}
			<label
				htmlFor="featuredImageInput"
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`relative block w-full rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-container ${
					isDragging
						? "border-primary-container bg-primary-container/10"
						: "border-surface-container-highest bg-[#141414] hover:bg-white/5"
				}`}
			>
				{previewUrl ? (
					<div className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-lg">
						<Image
							src={previewUrl}
							alt="Featured Preview"
							fill
							className="object-contain"
						/>
						<div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
							<span className="text-white font-label-sm uppercase tracking-wider">
								Click to change
							</span>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-4 py-6">
						<span className="material-symbols-outlined text-4xl text-[#D8A7A7]">
							cloud_upload
						</span>
						<div className="space-y-1">
							<p className="text-on-surface font-body-md">
								Drag and drop your thumbnail image here, or click to browse
								files
							</p>
							<p className="text-on-surface-variant font-body-sm">
								Supports JPG, PNG up to 4MB
							</p>
						</div>
					</div>
				)}
			</label>
		</div>
	);
}
