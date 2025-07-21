import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import "stream-chat-react/dist/css/v2/index.css";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Channel as StreamChatChannel } from "stream-chat";
import {
	Channel,
	Chat,
	MessageInput,
	MessageList,
	Thread,
	useCreateChatClient,
	Window,
} from "stream-chat-react";
import { CHAT_CHANNEL_TYPE } from "../../constants";

interface Props {
	meetingId: string;
	userId: string;
	userName: string;
	userImage?: string;
}

export const ChatUI = ({ meetingId, userId, userName, userImage }: Props) => {
	const trpc = useTRPC();
	const [channel, setChannel] = useState<StreamChatChannel | null>(null);

	const { mutateAsync: generateChatToken } = useMutation(
		trpc.meetings.generateChatToken.mutationOptions(),
	);

	const client = useCreateChatClient({
		apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY ?? "",
		tokenOrProvider: generateChatToken,
		userData: {
			id: userId,
			name: userName,
			image: userImage,
		},
	});

	useEffect(() => {
		if (!client) return;

		const chatChannel = client.channel(CHAT_CHANNEL_TYPE, meetingId, {
			members: [userId],
		});

		setChannel(chatChannel);
	}, [client, meetingId, userId]);

	if (!client || !channel) {
		return (
			<div className="flex items-center justify-center h-full p-8">
				<LoaderIcon className="size-4 animate-spin" />
			</div>
		);
	}

	return (
		<Chat client={client}>
			<Channel channel={channel}>
				<Window>
					<div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
						<MessageList />
					</div>
					<MessageInput />
				</Window>
				<Thread />
			</Channel>
		</Chat>
	);
};
