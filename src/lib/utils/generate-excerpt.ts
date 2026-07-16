import type { ContentBlock } from "@/lib/types/post";

export function generateExcerpt(body: string): string {
	try {
		// Assuming body is a JSON string of content blocks
		const content: ContentBlock[] = JSON.parse(body);
		const firstParagraph = content.find(
			(block): block is Extract<ContentBlock, { type: "paragraph" }> =>
				block.type === "paragraph" && !!block.text,
		);
		if (firstParagraph) {
			return `${firstParagraph.text.substring(0, 150)}...`;
		}
	} catch {
		// If parsing fails, it might be plain text
		return `${body.substring(0, 150)}...`;
	}
	return "";
}
