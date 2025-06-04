"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { ViewProps } from "@/types/view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getColumns } from "../components/agents-table/columns";
import { DataTable } from "../components/agents-table/data-table";

export const AgentsView = ({ dictionary }: ViewProps) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  const columns = getColumns(dictionary);

  return (
    <div className="flex flex-1 flex-col pb-4 px-4 md:px-8">
      <DataTable columns={columns} data={data} dictionary={dictionary} />
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
