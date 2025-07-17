"use client";

import {
	type Call,
	CallingState,
	StreamCall,
	StreamVideo,
	StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useTRPC } from "@/trpc/client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CallLoader } from "./call-loader";
import { CallUI } from "./call-ui";

interface Props {
	meetingId: string;
	meetingName: string;
	userId: string;
	userName: string;
	userImage: string;
}

export const CallConnect = ({
	meetingId,
	meetingName,
	userId,
	userName,
	userImage,
}: Props) => {
	const trpc = useTRPC();
	const { mutateAsync: generateToken } = useMutation(
		trpc.meetings.generateToken.mutationOptions(),
	);

	const [client, setClient] = useState<StreamVideoClient | null>(null);
	const [call, setCall] = useState<Call | null>(null);

	useEffect(() => {
		const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY ?? "";
		const videoClient = new StreamVideoClient({
			apiKey,
			user: {
				id: userId,
				name: userName,
				image: userImage,
			},
			tokenProvider: generateToken,
		});

		setClient(videoClient);

		return () => {
			videoClient.disconnectUser();
			setClient(null);
		};
	}, [generateToken, userId, userName, userImage]);

	useEffect(() => {
		if (!client) return;

		const videoCall = client.call("default", meetingId);
		videoCall.camera.disable();
		videoCall.microphone.disable();
		setCall(videoCall);

		return () => {
			if (videoCall.state.callingState !== CallingState.LEFT) {
				videoCall.leave();
				videoCall.endCall();
				setCall(null);
			}
		};
	}, [client, meetingId]);

	if (!client || !call) {
		return <CallLoader />;
	}

	return (
		<StreamVideo client={client}>
			<StreamCall call={call}>
				<CallUI meetingName={meetingName} />
			</StreamCall>
		</StreamVideo>
	);
};
