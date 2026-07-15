import type { ContentBlock } from "@/lib/types/post";
import { CalloutBlock } from "./callout-block";
import { HeadingBlock } from "./heading-block";
import { ParagraphBlock } from "./paragraph-block";
import { QuoteBlock } from "./quote-block";

interface BlogBodyProps {
	blocks: ContentBlock[];
}

export function BlogBody({ blocks }: BlogBodyProps) {
	return (
		<div className="space-y-8">
			{blocks.map((block) => {
				switch (block.type) {
					case "paragraph":
						return (
							<ParagraphBlock
								key={block.id}
								text={block.text}
								lead={block.lead}
							/>
						);
					case "heading":
						return <HeadingBlock key={block.id} text={block.text} />;
					case "quote":
						return <QuoteBlock key={block.id} lines={block.lines} />;
					case "callout":
						return <CalloutBlock key={block.id} {...block} />;
					default:
						return null;
				}
			})}
		</div>
	);
}
