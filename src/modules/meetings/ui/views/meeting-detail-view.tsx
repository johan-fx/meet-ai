"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface Props {
	meetingId: string;
}

export const MeetingDetailView = ({ meetingId }: Props) => {
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(
		trpc.meetings.getOne.queryOptions({ id: meetingId }),
	);

	return <div>{JSON.stringify(data)}</div>;
};

export const MeetingDetailViewLoading = () => {
	return <div>MeetingDetailView Loading...</div>;
};

export const MeetingDetailViewError = () => {
	return <div>MeetingDetailView Error...</div>;
};
