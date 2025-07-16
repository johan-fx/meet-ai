import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
	MeetingDetailView,
	MeetingDetailViewError,
	MeetingDetailViewLoading,
} from "@/modules/meetings/ui/views/meeting-detail-view";
import { getQueryClient, trpc } from "@/trpc/server";
import type { PageProps } from "@/types/page";

interface Props extends PageProps {
	params: Promise<{
		meetingId: string;
	}> &
		PageProps["params"];
}

const Page = async ({ params }: Props) => {
	const { meetingId, locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.meetings.getOne.queryOptions({ id: meetingId }),
	);

	// TODO: Prefetch `meetings.getTranscript`

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<MeetingDetailViewLoading />}>
				<ErrorBoundary fallback={<MeetingDetailViewError />}>
					<MeetingDetailView meetingId={meetingId} />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default Page;
