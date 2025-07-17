import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
	CallView,
	CallViewError,
	CallViewLoading,
} from "@/modules/call/ui/views/call-view";
import { getQueryClient, trpc } from "@/trpc/server";
import type { PageProps } from "@/types/page";

interface Props extends PageProps {
	params: Promise<{
		meetingId: string;
	}> &
		PageProps["params"];
}

const Page = async ({ params }: Props) => {
	const { meetingId } = await params;

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.meetings.getOne.queryOptions({ id: meetingId }),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<CallViewLoading />}>
				<ErrorBoundary fallback={<CallViewError />}>
					<CallView meetingId={meetingId} />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default Page;
