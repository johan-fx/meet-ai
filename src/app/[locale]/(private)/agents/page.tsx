import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadAgentsFilterParams } from "@/modules/agents/server/params";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import {
	AgentsView,
	AgentsViewError,
	AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import type { PageProps } from "@/types/page";

const Page = async ({ params, searchParams }: PageProps) => {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	const filters = await loadAgentsFilterParams(searchParams);

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.agents.getMany.queryOptions({
			...filters,
		}),
	);

	return (
		<>
			<AgentsListHeader />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<AgentsViewLoading />}>
					<ErrorBoundary fallback={<AgentsViewError />}>
						<AgentsView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	);
};

export default Page;
