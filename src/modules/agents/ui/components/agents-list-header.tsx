"use client";

import { PlusIcon, XCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE } from "@/constants";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { AgentsSearchFilter } from "./agents-search-filter";
import { NewAgentDialog } from "./new-agent-dialog";

const AgentsListHeader = () => {
	const t = useTranslations("agents.list");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [filters, setFilters] = useAgentsFilters();

	const isAnyFilterApplied = !!filters.search;

	const onClearFilters = () => {
		setFilters({ search: "", page: DEFAULT_PAGE });
	};

	return (
		<>
			<div className="py-6 px-4 md:px-8 flex flex-col gap-y-4">
				<div className="flex items-center justify-between">
					<h5 className="text-xl font-semibold">{t("title")}</h5>
					<Button onClick={() => setIsDialogOpen(true)}>
						<PlusIcon />
						{t("newAgent")}
					</Button>
				</div>
				<div className="flex items-center">
					<AgentsSearchFilter />
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
			<NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
		</>
	);
};

export { AgentsListHeader };
