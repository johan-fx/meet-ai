import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
	UpgradeView,
	UpgradeViewError,
	UpgradeViewLoading,
} from "@/modules/premium/ui/views/upgrade-view";
import { getQueryClient, trpc } from "@/trpc/server";
import type { PageProps } from "@/types/page";

const Page = async ({ params }: PageProps) => {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.premium.getCurrentSubscription.queryOptions(),
	);
	void queryClient.prefetchQuery(trpc.premium.getProducts.queryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<UpgradeViewLoading />}>
				<ErrorBoundary fallback={<UpgradeViewError />}>
					<UpgradeView />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default Page;
