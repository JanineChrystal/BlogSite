interface QuoteBlockProps {
	lines: string[];
}

export function QuoteBlock({ lines }: QuoteBlockProps) {
	return (
		<blockquote className="my-8 whitespace-pre-line border-l-4 border-primary-container pl-6 font-body text-body-lg italic text-on-surface">
			{lines.join("\n")}
		</blockquote>
	);
}
