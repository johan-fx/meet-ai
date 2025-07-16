import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { CommandSelect } from "@/components/command-select";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { MeetingStatus } from "../../types";
import { statusIconMap } from "./meetings-table/columns";

export const MeetingsStatusFilter = () => {
	const t = useTranslations("meetings.status");
	const [filters, setFilters] = useMeetingsFilters();

	const options = useMemo(() => {
		return Object.values(MeetingStatus).map((status) => {
			const Icon = statusIconMap[status];

			return {
				id: status,
				value: status,
				children: (
					<div className="flex items-center gap-x-2 capitalize">
						<Icon />
						{t(status)}
					</div>
				),
			};
		});
	}, [t]);

	return (
		<CommandSelect
			placeholder={t("placeholder")}
			className="h-9"
			options={options}
			value={filters.status ?? ""}
			onSelect={(value) =>
				setFilters({ ...filters, status: value as MeetingStatus })
			}
		/>
	);
};
