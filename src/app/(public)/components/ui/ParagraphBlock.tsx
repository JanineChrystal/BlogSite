interface ParagraphBlockProps {
	text: string;
	lead?: boolean;
}

export function ParagraphBlock({ text, lead }: ParagraphBlockProps) {
	return (
		// Added whitespace-pre-wrap to respect line breaks and text-left to prevent justification stretching
		<p
			className={`whitespace-pre-wrap text-left text-on-surface ${
				lead
					? "font-body-lg font-medium leading-relaxed"
					: "font-body-md leading-relaxed"
			}`}
		>
			{text}
		</p>
	);
}
