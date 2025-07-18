import type {
	CallSessionParticipantLeftEvent,
	CallSessionStartedEvent,
} from "@stream-io/video-react-sdk";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { requireEnv } from "@/lib/env";
import { streamVideo } from "@/lib/stream-video";
import { MeetingStatus } from "@/modules/meetings/types";

function verifySignatureWithSDK(body: string, signature: string): boolean {
	return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
	const signature = req.headers.get("x-signature");
	const apiKey = req.headers.get("x-api-key");

	if (!signature || !apiKey) {
		return NextResponse.json(
			{ error: "No signature or api key" },
			{ status: 400 },
		);
	}
	const body = await req.text();
	const isVerified = verifySignatureWithSDK(body, signature);

	if (!isVerified) {
		return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
	}

	let payload: unknown;
	try {
		payload = JSON.parse(body);
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const eventType = (payload as Record<string, unknown>)?.type;

	if (eventType === "call.session_started") {
		const event = payload as CallSessionStartedEvent;
		const meetingId = event.call.custom?.meetingId;

		if (!meetingId) {
			return NextResponse.json(
				{ error: "Meeting ID not found" },
				{ status: 400 },
			);
		}

		const [existingMeeting] = await db
			.select()
			.from(meetings)
			.where(
				and(
					eq(meetings.id, meetingId),
					eq(meetings.status, MeetingStatus.UPCOMING),
				),
			);

		if (!existingMeeting) {
			return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
		}

		console.log("existingMeeting", existingMeeting);

		await db
			.update(meetings)
			.set({
				status: MeetingStatus.ACTIVE,
				startedAt: new Date(),
			})
			.where(eq(meetings.id, meetingId));

		const [existingAgent] = await db
			.select()
			.from(agents)
			.where(eq(agents.id, existingMeeting.agentId));

		if (!existingAgent) {
			return NextResponse.json({ error: "Agent not found" }, { status: 404 });
		}

		console.log("existingAgent", existingAgent);

		const call = streamVideo.video.call("default", meetingId);
		const openAiApiKey = requireEnv("OPENAI_API_KEY");
		const realtimeClient = await streamVideo.video.connectOpenAi({
			call,
			openAiApiKey,
			agentUserId: existingAgent.id,
		});

		realtimeClient.updateSession({
			instructions: existingAgent.instructions,
		});
	} else if (eventType === "call.session_participant_left") {
		const event = payload as CallSessionParticipantLeftEvent;
		const meetingId = event.call_cid?.split(":")[1]; // call_cid is in the format of "type:id"

		if (!meetingId) {
			return NextResponse.json(
				{ error: "Meeting ID not found" },
				{ status: 400 },
			);
		}

		const call = streamVideo.video.call("default", meetingId);
		await call.end();
	}

	return NextResponse.json({ status: "ok" });
}
