import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const pricingCardVariants = cva("rounded-lg p-4 py-6 w-full", {
	variants: {
		variant: {
			default: "bg-white text-black",
			highlighted: "bg-primary text-white",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const pricingCardIconVariants = cva("size-5", {
	variants: {
		variant: {
			default: "fill-primary text-white",
			highlighted: "fill-white text-primary",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const pricingCardSecondaryTextVariants = cva("text-neutral-700", {
	variants: {
		variant: {
			default: "text-neutral-700",
			highlighted: "text-white",
		},
	},
});

const pricingCardBadgeVariants = cva("text-black text-xs font-normal p-1", {
	variants: {
		variant: {
			default: "bg-primary/20",
			highlighted: "bg-white",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

interface PricingCardProps extends VariantProps<typeof pricingCardVariants> {
	badge?: string | null;
	price: number;
	features: string[];
	title: string;
	description?: string | null;
	priceSuffix: string;
	className?: string;
	buttonText: string;
	onClick: () => void;
}

export const PricingCard = ({
	variant,
	title,
	badge,
	price,
	features,
	description,
	priceSuffix,
	className,
	buttonText,
	onClick,
}: PricingCardProps) => {
	const t = useTranslations("premium.pricing");

	return (
		<div className={cn(pricingCardVariants({ variant }), className, "border")}>
			<div className="flex items-end gap-x-4 justify-between">
				<div className="flex flex-col gap-y-2">
					<div className="flex items-center gap-x-2">
						<h6 className="text-xl font-medium">{title}</h6>
						{badge ? (
							<Badge className={cn(pricingCardBadgeVariants({ variant }))}>
								{t(badge)}
							</Badge>
						) : null}
					</div>
					<p
						className={cn(
							pricingCardSecondaryTextVariants({ variant }),
							"text-xs",
						)}
					>
						{description}
					</p>
				</div>
				<div className="flex items-end shrink-0 gap-x-0.5">
					<h4 className="text-3xl font-medium">
						{Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
							minimumFractionDigits: 0,
							maximumFractionDigits: 2,
						}).format(price)}
					</h4>
					<span
						className={cn(
							pricingCardSecondaryTextVariants({ variant }),
							"pb-1",
						)}
					>
						{priceSuffix}
					</span>
				</div>
			</div>
			<div className="py-6">
				<Separator className="opacity-50" />
			</div>
			<Button
				className={cn(
					variant === "highlighted" &&
						"bg-white/20 hover:bg-white/30 border border-white/20",
					"w-full",
				)}
				size="lg"
				onClick={onClick}
				variant={variant === "highlighted" ? "default" : "outline"}
			>
				{buttonText}
			</Button>
			<div className="flex flex-col gap-y-2 mt-6">
				<p className="font-medium uppercase">Features</p>
				<ul
					className={cn(
						pricingCardSecondaryTextVariants({ variant }),
						"flex flex-col gap-y-2",
					)}
				>
					{features.map((feature) => (
						<li key={feature} className="flex items-center gap-x-2.5">
							<CircleCheckIcon
								className={cn(pricingCardIconVariants({ variant }))}
							/>
							{feature}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
