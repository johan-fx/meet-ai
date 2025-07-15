"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { DataPagination } from "@/components/data-pagination";
import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const MeetingsView = () => {
	const trpc = useTRPC();
	const [filters, setFilters] = useMeetingsFilters();

	const { data } = useSuspenseQuery(
		trpc.meetings.getMany.queryOptions({
			...filters,
		}),
	);
	return (
		<div className="flex flex-1 flex-col pb-4 px-4 gap-y-4 md:px-8">
			<div>{JSON.stringify(data)}</div>
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
	return <div>Meetings Loading...</div>;
};

export const MeetingsViewError = () => {
	return <div>Meetings Error...</div>;
};
