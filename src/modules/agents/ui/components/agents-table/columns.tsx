"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { Dictionary } from "@/types/dictionary";
import { ColumnDef } from "@tanstack/react-table";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { AgentGetOne } from "../../../types";

export const getColumns = (
  dictionary: Dictionary
): ColumnDef<AgentGetOne>[] => [
  {
    accessorKey: "name",
    header: dictionary.agents.list.headers.name,
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
    header: dictionary.agents.list.headers.meetings,
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
              ? dictionary.agents.list.headers.meeting
              : dictionary.agents.list.headers.meetings}
          </span>
        </Badge>
      );
    },
  },
];
