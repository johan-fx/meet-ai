"use client";

import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";
import { MeetingStatus } from "../../types";
import { EditMeetingDialog } from "../components/edit-meeting-dialog";
import { MeetingDetailHeader } from "../components/meeting-detail-header";
import { ActiveState } from "../components/meeting-states/active-state";
import { CancelledState } from "../components/meeting-states/cancelled-state";
import { CompletedState } from "../components/meeting-states/completed-state";
import { ProcessingState } from "../components/meeting-states/processing-state";
import { UpcomingState } from "../components/meeting-states/upcoming-state";

interface Props {
	meetingId: string;
}

export const MeetingDetailView = ({ meetingId }: Props) => {
	const tList = useTranslations("meetings.list");
	const tDetail = useTranslations("meetings.detail");
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [editMeetingDialogOpen, setEditMeetingDialogOpen] = useState(false);

	const { data } = useSuspenseQuery(
		trpc.meetings.getOne.queryOptions({ id: meetingId }),
	);

	const [RemoveMeetingConfirmDialog, removeMeetingConfirm] = useConfirm({
		title: tDetail("deleteDialog.title"),
		description: tDetail("deleteDialog.description"),
	});

	const [CancelMeetingConfirmDialog, cancelMeetingConfirm] = useConfirm({
		title: tDetail("cancelDialog.title"),
		description: tDetail("cancelDialog.description"),
	});

	const removeMeeting = useMutation(
		trpc.meetings.remove.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.meetings.getMany.queryOptions({}),
				);
				await queryClient.invalidateQueries(
					trpc.premium.getFreeUsage.queryOptions(),
				);

				router.push("/meetings");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const cancelMeeting = useMutation(
		trpc.meetings.updateStatus.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.meetings.getOne.queryOptions({ id: meetingId }),
				);
				toast.success(tDetail("cancelSuccess"));
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const handleCancelMeeting = async () => {
		const confirmed = await cancelMeetingConfirm();

		if (!confirmed) {
			return;
		}

		await cancelMeeting.mutateAsync({
			id: meetingId,
			status: MeetingStatus.CANCELLED,
		});
	};

	const handleRemoveMeeting = async () => {
		const confirmed = await removeMeetingConfirm();

		if (!confirmed) {
			return;
		}

		await removeMeeting.mutateAsync({ id: meetingId });
	};

	if (removeMeeting.isPending || removeMeeting.isSuccess) {
		return <MeetingDetailViewLoading />;
	}

	const isActive = data.status === MeetingStatus.ACTIVE;
	const isUpcoming = data.status === MeetingStatus.UPCOMING;
	const isCancelled = data.status === MeetingStatus.CANCELLED;
	const isCompleted = data.status === MeetingStatus.COMPLETED;
	const isProcessing = data.status === MeetingStatus.PROCESSING;

	return (
		<>
			<RemoveMeetingConfirmDialog />
			<CancelMeetingConfirmDialog />
			<EditMeetingDialog
				open={editMeetingDialogOpen}
				initialValues={data}
				onOpenChange={setEditMeetingDialogOpen}
			/>
			<div className="flex-1 py-7 px-4 md:px-8 flex flex-col gap-4">
				<MeetingDetailHeader
					meetingId={meetingId}
					meetingName={data.name}
					onEdit={() => setEditMeetingDialogOpen(true)}
					onRemove={handleRemoveMeeting}
				/>
				<div className="bg-white rounded-lg border">
					<div className="flex flex-col px-4 py-5 gap-y-5 col-span-5">
						{isActive && <ActiveState meetingId={meetingId} />}
						{isUpcoming && (
							<UpcomingState
								meetingId={meetingId}
								onCancelMeeting={handleCancelMeeting}
								isCancelling={cancelMeeting.isPending}
							/>
						)}
						{isCancelled && <CancelledState />}
						{isCompleted && <CompletedState meeting={data} />}
						{isProcessing && <ProcessingState />}
					</div>
				</div>
			</div>
		</>
	);
};

export const MeetingDetailViewLoading = () => {
	return (
		<div className="flex-1 py-7 px-4 md:px-8 flex flex-col gap-4">
			{/* Header skeleton (breadcrumb + menu) */}
			<MeetingDetailHeader />

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

export const MeetingDetailViewError = () => {
	return <div>MeetingDetailView Error...</div>;
};
