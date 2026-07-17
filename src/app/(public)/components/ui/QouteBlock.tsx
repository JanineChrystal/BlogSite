interface QuoteBlockProps {
	lines: string[];
}

export function QuoteBlock({ lines }: QuoteBlockProps) {
	return (
		<blockquote className="border-l-4 border-primary-container pl-6 my-8">
			<div className="whitespace-pre-wrap text-left italic text-on-surface-variant font-body-lg leading-relaxed">
				{lines.map((line) => (
					<span key={line} className="block">
						{line}
					</span>
				))}
			</div>
		</blockquote>
	);
}
