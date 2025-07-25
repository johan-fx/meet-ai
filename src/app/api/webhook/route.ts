import type {
	CallRecordingReadyEvent,
	CallSessionEndedEvent,
	CallSessionParticipantLeftEvent,
	CallSessionStartedEvent,
	CallTranscriptionReadyEvent,
	MessageNewEvent,
} from "@stream-io/node-sdk";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { generateAvatarUri } from "@/lib/avatar";
import { requireEnv } from "@/lib/env";
import { chatMessagePrompt } from "@/lib/prompts";
import { streamChat } from "@/lib/stream-chat";
import { streamVideo } from "@/lib/stream-video";
import { CHAT_CHANNEL_TYPE } from "@/modules/meetings/constants";
import { MeetingStatus } from "@/modules/meetings/types";

const openAiClient = new OpenAI({
	apiKey: requireEnv("OPENAI_API_KEY"),
});

/**
 * Verifies the webhook signature using Stream's SDK
 */
function verifySignatureWithSDK(body: string, signature: string): boolean {
	return streamVideo.verifyWebhook(body, signature);
}

/**
 * Handles call session started events
 * - Updates meeting status to ACTIVE
 * - Connects OpenAI realtime client with agent instructions
 */
async function handleCallSessionStarted(event: CallSessionStartedEvent) {
	const meetingId = event.call.custom?.meetingId;

	if (!meetingId) {
		return NextResponse.json(
			{ error: "Meeting ID not found" },
			{ status: 400 },
		);
	}

	// Find the meeting and verify it's in upcoming status
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

	// Update meeting status to active and set start time
	await db
		.update(meetings)
		.set({
			status: MeetingStatus.ACTIVE,
			startedAt: new Date(),
		})
		.where(eq(meetings.id, meetingId));

	// Get the associated agent for this meeting
	const [existingAgent] = await db
		.select()
		.from(agents)
		.where(eq(agents.id, existingMeeting.agentId));

	if (!existingAgent) {
		return NextResponse.json({ error: "Agent not found" }, { status: 404 });
	}

	// Connect OpenAI realtime client with agent configuration
	const call = streamVideo.video.call("default", meetingId);
	const openAiApiKey = requireEnv("OPENAI_API_KEY");
	const realtimeClient = await streamVideo.video.connectOpenAi({
		call,
		openAiApiKey,
		agentUserId: existingAgent.id,
	});

	// Configure the AI agent with custom instructions
	realtimeClient.updateSession({
		instructions: existingAgent.instructions,
	});

	return NextResponse.json({ status: "ok" });
}

/**
 * Handles call session participant left events
 * - Ends the call when participants leave
 */
async function handleCallSessionParticipantLeft(
	event: CallSessionParticipantLeftEvent,
) {
	const meetingId = event.call_cid?.split(":")[1]; // call_cid is in the format of "type:id"

	if (!meetingId) {
		return NextResponse.json(
			{ error: "Meeting ID not found" },
			{ status: 400 },
		);
	}

	// End the call when participant leaves
	const call = streamVideo.video.call("default", meetingId);
	await call.end();

	return NextResponse.json({ status: "ok" });
}

/**
 * Handles call session ended events
 * - Updates meeting status to PROCESSING
 * - Sets the end timestamp
 */
async function handleCallSessionEnded(event: CallSessionEndedEvent) {
	const meetingId = event.call.custom?.meetingId;

	if (!meetingId) {
		return NextResponse.json(
			{ error: "Meeting ID not found" },
			{ status: 400 },
		);
	}

	// Update meeting status to processing and set end time
	await db
		.update(meetings)
		.set({
			status: MeetingStatus.PROCESSING,
			endedAt: new Date(),
		})
		.where(
			and(
				eq(meetings.id, meetingId),
				eq(meetings.status, MeetingStatus.ACTIVE),
			),
		);

	return NextResponse.json({ status: "ok" });
}

/**
 * Handles call transcription ready events
 * - Updates meeting with transcript URL
 */
async function handleCallTranscriptionReady(
	event: CallTranscriptionReadyEvent,
) {
	const meetingId = event.call_cid?.split(":")[1]; // call_cid is in the format of "type:id"

	const [updatedMeeting] = await db
		.update(meetings)
		.set({
			transcriptUrl: event.call_transcription.url,
		})
		.where(eq(meetings.id, meetingId))
		.returning();

	if (!updatedMeeting) {
		return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
	}

	await inngest.send({
		name: "meetings/processing",
		data: {
			meetingId,
			transcriptUrl: updatedMeeting.transcriptUrl,
		},
	});

	return NextResponse.json({ status: "ok" });
}

/**
 * Handles call recording ready events
 * - Updates meeting with recording URL
 */
async function handleCallRecordingReady(event: CallRecordingReadyEvent) {
	const meetingId = event.call_cid?.split(":")[1]; // call_cid is in the format of "type:id"

	const [updatedMeeting] = await db
		.update(meetings)
		.set({
			recordingUrl: event.call_recording.url,
		})
		.where(eq(meetings.id, meetingId))
		.returning();

	if (!updatedMeeting) {
		return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
	}

	return NextResponse.json({ status: "ok" });
}

async function handleChatMessageNew(event: MessageNewEvent) {
	const userId = event.user?.id;
	const meetingId = event.channel_id;
	const text = event.message?.text;

	if (!userId || !meetingId || !text) {
		return NextResponse.json({ error: "Invalid message" }, { status: 400 });
	}

	const [existingMeeting] = await db
		.select()
		.from(meetings)
		.where(
			and(
				eq(meetings.id, meetingId),
				eq(meetings.status, MeetingStatus.COMPLETED),
			),
		);

	if (!existingMeeting) {
		return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
	}

	const [existingAgent] = await db
		.select()
		.from(agents)
		.where(eq(agents.id, existingMeeting.agentId));

	if (!existingAgent) {
		return NextResponse.json({ error: "Agent not found" }, { status: 404 });
	}

	// Check if the message is from the AI Assistant
	if (userId !== existingAgent.id) {
		const instructions = chatMessagePrompt(
			existingMeeting.summary ?? "",
			existingAgent.instructions,
		);

		const channel = streamChat.channel(CHAT_CHANNEL_TYPE, meetingId);
		await channel.watch();

		const previousMessages = channel.state.messages
			.slice(-5)
			.filter((msg) => msg.text?.trim() !== "")
			.map<ChatCompletionMessageParam>((msg) => ({
				role: msg.user?.id === existingAgent.id ? "assistant" : "user",
				content: msg.text ?? "",
			}));

		const response = await openAiClient.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{ role: "system", content: instructions },
				...previousMessages,
				{ role: "user", content: text },
			],
		});

		const message = response.choices[0].message.content;

		if (!message) {
			return NextResponse.json(
				{ error: "No response from AI" },
				{ status: 500 },
			);
		}

		const agentAvatar = generateAvatarUri({
			seed: existingAgent.name,
			variant: "botttsNeutral",
		});

		const chatUser = {
			id: existingAgent.id,
			name: existingAgent.name,
			image: agentAvatar,
		};

    await streamChat.upsertUser(chatUser);
		await channel.sendMessage({
			text: message,
			user: chatUser,
		});
	}

	return NextResponse.json({ status: "ok" });
}

/**
 * Main webhook handler for Stream Video events
 * Validates signature and routes to appropriate event handlers
 */
export async function POST(req: NextRequest) {
	const signature = req.headers.get("x-signature");
	const apiKey = req.headers.get("x-api-key");

	// Validate required headers
	if (!signature || !apiKey) {
		return NextResponse.json(
			{ error: "No signature or api key" },
			{ status: 400 },
		);
	}

	// Get request body and verify webhook signature
	const body = await req.text();
	const isVerified = verifySignatureWithSDK(body, signature);

	if (!isVerified) {
		return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
	}

	// Parse the webhook payload
	let payload: unknown;
	try {
		payload = JSON.parse(body);
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const eventType = (payload as Record<string, unknown>)?.type;

	// Route to appropriate event handler based on event type
	switch (eventType) {
		case "call.session_started":
			return await handleCallSessionStarted(payload as CallSessionStartedEvent);

		case "call.session_participant_left":
			return await handleCallSessionParticipantLeft(
				payload as CallSessionParticipantLeftEvent,
			);

		case "call.session_ended":
			return await handleCallSessionEnded(payload as CallSessionEndedEvent);

		case "call.transcription_ready":
			return await handleCallTranscriptionReady(
				payload as CallTranscriptionReadyEvent,
			);

		case "call.recording_ready":
			return await handleCallRecordingReady(payload as CallRecordingReadyEvent);

		case "message.new":
			return await handleChatMessageNew(payload as MessageNewEvent);

		default:
			// For unknown event types, just return ok without processing
			return NextResponse.json({ status: "ok" });
	}
}
