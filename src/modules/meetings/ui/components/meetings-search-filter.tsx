import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

const MeetingsSearchFilter = () => {
	const t = useTranslations("meetings.list");
	const [filters, setFilters] = useMeetingsFilters();

	return (
		<div className="relative">
			<Input
				className="h-9 w-[200px] pl-8 bg-white"
				placeholder={t("searchPlaceholder")}
				value={filters.search}
				onChange={(e) => setFilters({ ...filters, search: e.target.value })}
			/>
			<SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
		</div>
	);
};

export { MeetingsSearchFilter };
