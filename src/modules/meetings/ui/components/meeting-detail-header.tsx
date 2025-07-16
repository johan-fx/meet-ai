import {
	ChevronRightIcon,
	MoreHorizontalIcon,
	PencilIcon,
	TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
	meetingId?: string;
	meetingName?: string;
	onEdit?: () => void;
	onRemove?: () => void;
}

export const MeetingDetailHeader = ({
	meetingId,
	meetingName,
	onEdit = () => {},
	onRemove = () => {},
}: Props) => {
	const tList = useTranslations("meetings.list");
	const tForm = useTranslations("meetings.form");

	return (
		<div className="flex items-center justify-between">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild className="font-semibold text-xl">
							<Link href="/meetings">{tList("title")}</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator className="text-foreground text-xl font-semibold [&>svg]:size-4">
						<ChevronRightIcon />
					</BreadcrumbSeparator>
					<BreadcrumbItem>
						{meetingId ? (
							<BreadcrumbLink
								asChild
								className="font-semibold text-xl text-foreground"
							>
								<Link href={`/meetings/${meetingId}`}>{meetingName}</Link>
							</BreadcrumbLink>
						) : (
							<Skeleton className="h-7 w-40 rounded bg-neutral-200" />
						)}
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost">
						<MoreHorizontalIcon />
					</Button>
				</DropdownMenuTrigger>
				{meetingId && (
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={onEdit}>
							<PencilIcon className="size-4 text-black" />
							{tForm("edit")}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onRemove}>
							<TrashIcon className="size-4 text-black" />
							{tForm("delete")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				)}
			</DropdownMenu>
		</div>
	);
};
