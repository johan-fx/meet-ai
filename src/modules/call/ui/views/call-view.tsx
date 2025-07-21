"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";
import { MeetingStatus } from "@/modules/meetings/types";
import { useTRPC } from "@/trpc/client";
import { CallProvider } from "../components/call-provider";

interface Props {
	meetingId: string;
}

export const CallView = ({ meetingId }: Props) => {
	const t = useTranslations("call");
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(
		trpc.meetings.getOne.queryOptions({ id: meetingId }),
	);

	if (data.status === MeetingStatus.COMPLETED) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="bg-white p-8 m-8 rounded-lg max-w-md">
					<EmptyState
						title={t("completed.title")}
						description={t("completed.description")}
						image="/images/cancelled.svg"
					/>
				</div>
			</div>
		);
	}

	return <CallProvider meetingId={meetingId} meetingName={data.name} />;
};

export const CallViewLoading = () => {
	return <div>CallViewLoading</div>;
};

export const CallViewError = () => {
	return <div>CallViewError</div>;
};
