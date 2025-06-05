import { auth } from "@/lib/auth";
import { getDictionary, SupportedLocale } from "@/lib/dictionary";
import { loadAgentsFilterParams } from "@/modules/agents/server/params";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { PageProps } from "@/types/page";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async ({ params, searchParams }: PageProps) => {
  const { locale } = await params;
  const filters = await loadAgentsFilterParams(searchParams);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  const dictionary = await getDictionary(locale as SupportedLocale);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <>
      <AgentsListHeader dictionary={dictionary} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading />}>
          <ErrorBoundary fallback={<AgentsViewError />}>
            <AgentsView dictionary={dictionary} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
