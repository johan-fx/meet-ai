import { Input } from "@/components/ui/input";
import { ViewProps } from "@/types/view";
import { SearchIcon } from "lucide-react";
import { useAgentsFilters } from "../../hooks/use-agents-filters";

const AgentsSearchFilter = ({ dictionary }: ViewProps) => {
  const [filters, setFilters] = useAgentsFilters();

  return (
    <div className="relative">
      <Input
        className="h-9 w-[200px] pl-8 bg-white"
        placeholder={dictionary.agents.list.searchPlaceholder}
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};

export { AgentsSearchFilter };
