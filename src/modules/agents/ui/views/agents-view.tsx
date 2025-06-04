"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { ViewProps } from "@/types/view";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AgentsView = ({ dictionary }: ViewProps) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div>
      {data?.map((agent) => (
        <div key={agent.id}>{agent.name}</div>
      ))}
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <Card className="p-4">
      <div>Loading...</div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
};

export const AgentsViewError = () => {
  return <div>Error</div>;
};
