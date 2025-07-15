import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
	AgentDetailView,
	AgentsDetailViewError,
	AgentsDetailViewLoading,
} from "@/modules/agents/ui/views/agent-detail-view";
import { getQueryClient, trpc } from "@/trpc/server";
import type { PageProps } from "@/types/page";

interface Props extends PageProps {
	params: Promise<{
		agentId: string;
	}> &
		PageProps["params"];
}

const Page = async ({ params }: Props) => {
	const { agentId, locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.agents.getOne.queryOptions({ id: agentId }),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<AgentsDetailViewLoading />}>
				<ErrorBoundary fallback={<AgentsDetailViewError />}>
					<AgentDetailView agentId={agentId} />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default Page;
