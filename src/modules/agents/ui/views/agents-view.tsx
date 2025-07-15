"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataPagination } from "@/components/data-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { useColumns } from "../components/agents-table/columns";
import { DataTable } from "../components/agents-table/data-table";

export const AgentsView = () => {
	const router = useRouter();
	const trpc = useTRPC();
	const [filters, setFilters] = useAgentsFilters();

	const { data } = useSuspenseQuery(
		trpc.agents.getMany.queryOptions({
			...filters,
		}),
	);

	const columns = useColumns();

	return (
		<div className="flex flex-1 flex-col pb-4 px-4 gap-y-4 md:px-8">
			<DataTable
				columns={columns}
				data={data.items}
				onRowClick={(row) => router.push(`/agents/${row.id}`)}
			/>
			{data.totalPages > 0 && (
				<DataPagination
					totalPages={data.totalPages}
					page={filters.page}
					onPageChange={(page: number) => setFilters({ ...filters, page })}
				/>
			)}
		</div>
	);
};

export const AgentsViewLoading = () => {
	return (
		<div className="flex flex-1 flex-col pb-4 px-4 md:px-8">
			<div className="rounded-lg border bg-background p-4">
				<div className="flex gap-x-3 items-center">
					<Skeleton className="size-7 rounded-full self-start" />

					<div className="flex flex-col gap-3 flex-1">
						<Skeleton className="h-5 w-[200px]" />
						<Skeleton className="h-5 w-[300px]" />
					</div>

					<Skeleton className="h-6 w-[100px]" />
				</div>
			</div>
		</div>
	);
};

export const AgentsViewError = () => {
	return <div>Error</div>;
};
