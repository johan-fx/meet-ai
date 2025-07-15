import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadMeetingsFilterParams } from "@/modules/meetings/server/params";
import {
	MeetingsView,
	MeetingsViewError,
	MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import type { PageProps } from "@/types/page";

const Page = async ({ params, searchParams }: PageProps) => {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	const filters = await loadMeetingsFilterParams(searchParams);

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.meetings.getMany.queryOptions({
			...filters,
		}),
	);

	return (
		<>
			<div>Meetings Header here!</div>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<MeetingsViewLoading />}>
					<ErrorBoundary fallback={<MeetingsViewError />}>
						<MeetingsView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	);
};

export default Page;
