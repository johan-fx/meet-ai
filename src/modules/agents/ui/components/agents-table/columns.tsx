"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import type { AgentGetMany } from "../../../types";

export const useColumns = (): ColumnDef<AgentGetMany[number]>[] => {
	const t = useTranslations("agents.list");

	return [
		{
			accessorKey: "name",
			header: t("headers.name"),
			meta: {
				className: "w-full",
			},
			cell: ({ row }) => {
				return (
					<div className="flex flex-col gap-y-1">
						<div className=" flex items-center gap-x-2">
							<GeneratedAvatar
								seed={row.original.name}
								variant="botttsNeutral"
								className="size-6"
							/>
							<span className="font-semibold capitalize">
								{row.original.name}
							</span>
						</div>

						<div className="flex items-center gap-x-1 ml-3">
							<CornerDownRightIcon className="size-3 text-muted-foreground" />
							<span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
								{row.original.instructions}
							</span>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "meetingCount",
			header: t("headers.meetings"),
			meta: {
				className: "w-36",
			},
			cell: ({ row }) => {
				const { meetingCount } = row.original;
				return (
					<Badge
						variant="outline"
						className="flex items-center gap-x-2 [&>svg]:size-4"
					>
						<VideoIcon />
						<span className="text-xs">
							{meetingCount}{" "}
							{meetingCount === 1
								? t("headers.meeting")
								: t("headers.meetings")}
						</span>
					</Badge>
				);
			},
		},
	];
};
