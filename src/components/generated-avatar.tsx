import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { botttsNeutral, initials } from "@dicebear/collection";
import { type Result, createAvatar } from "@dicebear/core";

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

  let avatar: Result | undefined;

  switch (variant) {
    case "botttsNeutral":
      avatar = createAvatar(botttsNeutral, {
        seed,
      });
      break;
    case "initials":
      avatar = createAvatar(initials, {
        seed,
        fontWeight: 500,
        fontSize: 42,
      });
      break;
    default:
      // Default to initials variant for unknown variants
      avatar = createAvatar(initials, {
        seed,
        fontWeight: 500,
        fontSize: 42,
      });
  }

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar?.toDataUri()} alt={seed} />
      <AvatarFallback>{seed.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default GeneratedAvatar;
