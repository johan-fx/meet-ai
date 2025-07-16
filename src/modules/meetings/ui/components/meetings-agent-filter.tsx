import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const MeetingsAgentFilter = () => {
	const t = useTranslations("meetings.form");
	const [filters, setFilters] = useMeetingsFilters();
	const [agentSearch, setAgentSearch] = useState("");
	const trpc = useTRPC();

	const { data } = useQuery(
		trpc.agents.getMany.queryOptions({
			pageSize: 100,
			search: agentSearch,
		}),
	);

	const options = useMemo(() => {
		return data?.items.map((agent) => ({
			id: agent.id,
			value: agent.id,
			children: (
				<div className="flex items-center gap-x-2">
					<GeneratedAvatar
						seed={agent.name}
						variant="botttsNeutral"
						className="size-6 border"
					/>
					<span>{agent.name}</span>
				</div>
			),
		}));
	}, [data]);

	return (
		<CommandSelect
			onSearch={setAgentSearch}
			placeholder={t("agentPlaceholder")}
			className="h-9"
			options={options ?? []}
			value={filters.agentId ?? ""}
			onSelect={(value) => setFilters({ ...filters, agentId: value as string })}
		/>
	);
};
