import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarUri } from "@/lib/avatar";
import { cn } from "@/lib/utils";

interface GeneratedAvatarProps {
	seed: string;
	className?: string;
	variant: "botttsNeutral" | "initials";
}

const GeneratedAvatar = ({
	seed,
	className,
	variant,
}: GeneratedAvatarProps) => {
	if (!seed) {
		return (
			<Avatar className={cn(className)}>
				<AvatarFallback>??</AvatarFallback>
			</Avatar>
		);
	}

	const avatarUri = generateAvatarUri({ seed, variant });

	return (
		<Avatar className={cn(className)}>
			<AvatarImage src={avatarUri} alt={seed} />
			<AvatarFallback>{seed.slice(0, 2).toUpperCase()}</AvatarFallback>
		</Avatar>
	);
};

export { GeneratedAvatar };
