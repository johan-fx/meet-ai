"use client";

import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";
import { AgentDetailHeader } from "../components/agent-detail-header";
import { EditAgentDialog } from "../components/edit-agent-dialog";

interface Props {
	agentId: string;
}

export const AgentDetailView = ({ agentId }: Props) => {
	const tList = useTranslations("agents.list");
	const tDetail = useTranslations("agents.detail");
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [editAgentDialogOpen, setEditAgentDialogOpen] = useState(false);

	const { data } = useSuspenseQuery(
		trpc.agents.getOne.queryOptions({ id: agentId }),
	);

	const [RemoveAgentConfirmDialog, removeAgentConfirm] = useConfirm({
		title: tDetail("deleteDialog.title"),
		description: tDetail("deleteDialog.description", {
			meetingCount: data.meetingCount,
		}),
	});

	const removeAgent = useMutation(
		trpc.agents.remove.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.agents.getMany.queryOptions({}),
				);
				// TODO: Invalidate free tier usage

				router.push("/agents");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const handleRemoveAgent = async () => {
		const confirmed = await removeAgentConfirm();

		if (!confirmed) {
			return;
		}

		await removeAgent.mutateAsync({ id: agentId });
	};

	if (removeAgent.isPending || removeAgent.isSuccess) {
		return <AgentsDetailViewLoading />;
	}

	return (
		<>
			<RemoveAgentConfirmDialog />
			<EditAgentDialog
				open={editAgentDialogOpen}
				initialValues={data}
				onOpenChange={setEditAgentDialogOpen}
			/>
			<div className="flex-1 py-7 px-4 md:px-8 flex flex-col gap-4">
				<AgentDetailHeader
					agentId={agentId}
					agentName={data.name}
					onEdit={() => setEditAgentDialogOpen(true)}
					onRemove={handleRemoveAgent}
				/>
				<div className="bg-white rounded-lg border">
					<div className="flex flex-col px-4 py-5 gap-y-5 col-span-5">
						<div className="flex items-center gap-x-3">
							<GeneratedAvatar seed={data.name} variant="botttsNeutral" />
							<h2 className="font-medium text-2xl">{data.name}</h2>
						</div>
						<Badge
							variant="outline"
							className="flex items-center gap-x-2 [&>svg]:size-4"
						>
							<VideoIcon />
							{data.meetingCount}{" "}
							{data.meetingCount === 1
								? tList("headers.meeting")
								: tList("headers.meetings")}
						</Badge>
						<div className="flex flex-col gap-y-4">
							<p className="text-lg font-semibold">
								{tList("headers.instructions")}
							</p>
							<p className="text-neutral-800">{data.instructions}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export const AgentsDetailViewLoading = () => {
	return (
		<div className="flex-1 py-7 px-4 md:px-8 flex flex-col gap-4">
			{/* Header skeleton (breadcrumb + menu) */}
			<AgentDetailHeader />

			{/* Main card skeleton */}
			<div className="bg-white rounded-lg border">
				<div className="flex flex-col px-4 py-5 gap-y-5 col-span-5">
					<div className="flex items-center gap-x-3">
						<Skeleton className="size-8 rounded-full" />
						<Skeleton className="h-7 w-40 rounded" />
					</div>
					<Skeleton className="h-7 w-28 rounded-md" />
					<div className="flex flex-col gap-y-4">
						<Skeleton className="h-6 w-32 rounded" />
						<Skeleton className="h-5 w-full max-w-md rounded" />
					</div>
				</div>
			</div>
		</div>
	);
};

export const AgentsDetailViewError = () => {
	return <div>Error</div>;
};
