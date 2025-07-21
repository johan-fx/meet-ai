"use client";

import { LoaderIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ChatUI } from "./chat-ui";

interface Props {
	meetingId: string;
}

export const ChatProvider = ({ meetingId }: Props) => {
	const { data, isPending } = authClient.useSession();

	if (isPending || !data?.user) {
		return (
			<div className="flex items-center justify-center h-full p-8">
				<LoaderIcon className="size-4 animate-spin" />
			</div>
		);
	}

	return (
		<ChatUI
			meetingId={meetingId}
			userId={data.user.id}
			userName={data.user.name}
			userImage={data.user.image ?? undefined}
		/>
	);
};
