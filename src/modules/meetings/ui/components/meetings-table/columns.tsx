"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
	CircleCheckIcon,
	CircleXIcon,
	ClockArrowUpIcon,
	ClockFadingIcon,
	CornerDownRightIcon,
	LoaderIcon,
	VideoIcon,
} from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatDuration } from "@/lib/utils";
import type { MeetingGetMany } from "../../../types";

export const statusIconMap = {
	upcoming: ClockArrowUpIcon,
	active: VideoIcon,
	completed: CircleCheckIcon,
	processing: LoaderIcon,
	cancelled: CircleXIcon,
};

const statusColorMap = {
	upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
	active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
	completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
	processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
	cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
};

export const useColumns = (): ColumnDef<MeetingGetMany[number]>[] => {
	const t = useTranslations("meetings.list");
	const format = useFormatter();
	const locale = useLocale();

	return [
		{
			accessorKey: "name",
			header: t("headers.name"),
			meta: {
				className: "md:w-full",
			},
			cell: ({ row }) => {
				return (
					<div className="flex flex-col gap-y-1">
						<span className="font-semibold capitalize">
							{row.original.name}
						</span>
						<div className=" flex items-center gap-x-2">
							<div className=" flex items-center gap-x-2">
								<CornerDownRightIcon className="size-3 text-muted-foreground" />

								<span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
									{row.original.agent.name}
								</span>
								<GeneratedAvatar
									seed={row.original.agent.name}
									variant="botttsNeutral"
									className="size-4"
								/>
								<span className="text-sm text-muted-foreground">
									{row.original.startedAt
										? format.dateTime(new Date(row.original.startedAt), {
												dateStyle: "medium",
											})
										: ""}
								</span>
							</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "status",
			header: t("headers.status"),
			meta: {
				className: "md:w-36",
			},
			cell: ({ row }) => {
				const Icon = statusIconMap[row.original.status];
				const color = statusColorMap[row.original.status];

				return (
					<Badge
						variant="outline"
						className={cn(
							"capitalize [&>svg]:size-4 text-muted-foreground",
							color,
						)}
					>
						<Icon
							className={cn(
								row.original.status === "processing" && "animate-spin",
							)}
						/>
						{row.original.status}
					</Badge>
				);
			},
		},
		{
			accessorKey: "duration",
			header: t("headers.duration"),
			meta: {
				className: "md:w-40",
			},
			cell: ({ row }) => {
				const duration = row.original.duration || 0;

				return (
					<Badge
						variant="outline"
						className="flex items-center gap-x-2 capitalize [&>svg]:size-4"
					>
						<ClockFadingIcon />
						{duration > 0
							? formatDuration(duration, locale)
							: t("durationUnknown")}
					</Badge>
				);
			},
		},
	];
};
