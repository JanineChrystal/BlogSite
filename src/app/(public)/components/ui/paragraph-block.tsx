import { cn } from "@/lib/utils/utils";

interface ParagraphBlockProps {
	text: string;
	lead?: boolean;
}

export function ParagraphBlock({ text, lead }: ParagraphBlockProps) {
	return (
		<p
			className={cn(
				"font-body text-body-lg leading-relaxed text-secondary",
				lead && "text-xl text-on-surface",
			)}
		>
			{text}
		</p>
	);
}
