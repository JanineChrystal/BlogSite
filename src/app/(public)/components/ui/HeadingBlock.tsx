interface HeadingBlockProps {
	text: string;
}

export function HeadingBlock({ text }: HeadingBlockProps) {
	return (
		<h2 className="mt-12 mb-6 font-heading text-headline-md text-on-surface">
			{text}
		</h2>
	);
}
