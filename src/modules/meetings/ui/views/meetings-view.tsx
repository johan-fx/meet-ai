"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataPagination } from "@/components/data-pagination";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { useColumns } from "../components/meetings-table/columns";
import { MeetingsTableEmptyState } from "../components/meetings-table/empty-state";

export const MeetingsView = () => {
	const trpc = useTRPC();
	const router = useRouter();
	const [filters, setFilters] = useMeetingsFilters();

	const { data } = useSuspenseQuery(
		trpc.meetings.getMany.queryOptions({
			...filters,
		}),
	);

	const columns = useColumns();

	return (
		<div className="flex flex-1 flex-col pb-4 px-4 gap-y-4 md:px-8">
			<DataTable
				columns={columns}
				data={data.items}
				onRowClick={(row) => router.push(`/meetings/${row.id}`)}
				emptyState={<MeetingsTableEmptyState />}
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

export const MeetingsViewLoading = () => {
	return (
		<div className="flex flex-1 flex-col pb-4 px-4 md:px-8">
			<div className="rounded-lg border bg-background p-4">
				<div className="flex gap-x-3 items-center">
					<div className="flex flex-col gap-3 flex-1">
						<Skeleton className="h-5 w-[200px]" />
						<Skeleton className="h-5 w-[300px]" />
					</div>
					<div className="w-30">
						<Skeleton className="h-6 w-[100px]" />
					</div>
					<div className="w-30">
						<Skeleton className="h-6 w-[100px]" />
					</div>
				</div>
			</div>
		</div>
	);
};

export const MeetingsViewError = () => {
	return <div>Meetings Error...</div>;
};
