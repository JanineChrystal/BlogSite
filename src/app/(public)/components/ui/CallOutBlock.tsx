import Link from "next/link";
import { buttonVariants } from "@/components/ui/buttons/Button";
import { cn } from "@/lib/utils/utils";

interface CalloutBlockProps {
	title: string;
	description: string;
	cta: { label: string; href: string };
}

export function CalloutBlock({ title, description, cta }: CalloutBlockProps) {
	return (
		<div className="relative my-12 overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-high p-8 transition-shadow duration-300 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.5)]">
			<div className="absolute inset-y-0 left-0 w-1 bg-primary-container" />
			<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
				<div>
					<h3 className="mb-2 font-heading text-2xl text-on-surface">
						{title}
					</h3>
					<p className="font-body text-body-md text-secondary">{description}</p>
				</div>
				<Link
					href={cta.href}
					className={cn(
						buttonVariants({ variant: "default" }),
						"h-auto shrink-0 rounded bg-primary-container px-8 py-4 font-heading text-label-sm uppercase tracking-wider text-white hover:bg-inverse-primary",
					)}
				>
					{cta.label}
				</Link>
			</div>
		</div>
	);
}
