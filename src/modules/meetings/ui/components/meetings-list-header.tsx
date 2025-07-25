"use client";

import { PlusIcon, XCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE } from "@/constants";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { MeetingsAgentFilter } from "./meetings-agent-filter";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { MeetingsStatusFilter } from "./meetings-status-filter";
import { NewMeetingDialog } from "./new-meeting-dialog";

const MeetingsListHeader = () => {
	const t = useTranslations("meetings.list");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [filters, setFilters] = useMeetingsFilters();

	const isAnyFilterApplied =
		!!filters.search || !!filters.status || !!filters.agentId;

	const onClearFilters = () => {
		setFilters({
			search: "",
			page: DEFAULT_PAGE,
			status: null,
			agentId: null,
		});
	};

	return (
		<>
			<div className="py-6 px-4 md:px-8 flex flex-col gap-y-4">
				<div className="flex items-center justify-between">
					<h5 className="text-xl font-semibold">{t("title")}</h5>
					<Button onClick={() => setIsDialogOpen(true)}>
						<PlusIcon />
						{t("newMeeting")}
					</Button>
				</div>
				<div className="flex flex-col md:flex-row md:items-center gap-2">
					<MeetingsSearchFilter />
					<MeetingsStatusFilter />
					<MeetingsAgentFilter />

					{isAnyFilterApplied && (
						<Button
							onClick={onClearFilters}
							variant="ghost"
							className="text-primary"
						>
							<XCircleIcon />
						</Button>
					)}
				</div>
			</div>
			<NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
		</>
	);
};

export { MeetingsListHeader };
