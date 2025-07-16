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
import { useConfirm } from "@/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";
import { EditMeetingDialog } from "../components/edit-meeting-dialog";
import { MeetingDetailHeader } from "../components/meeting-detail-header";

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

	const removeMeeting = useMutation(
		trpc.meetings.remove.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.meetings.getMany.queryOptions({}),
				);
				// TODO: Invalidate free tier usage

				router.push("/meetings");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

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

	return (
		<>
			<RemoveMeetingConfirmDialog />
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
						{JSON.stringify(data)}
					</div>
				</div>
			</div>
		</>
	);
};

export const MeetingDetailViewLoading = () => {
	return <div>MeetingDetailView Loading...</div>;
};

export const MeetingDetailViewError = () => {
	return <div>MeetingDetailView Error...</div>;
};
