import { createAgent, openai, type TextMessage } from "@inngest/agent-kit";
import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { requireEnv } from "@/lib/env";
import { transcriptToSummaryPrompt } from "@/lib/prompts";
import {
	MeetingStatus,
	type StreamTranscriptItem,
} from "@/modules/meetings/types";
import { inngest } from "./client";

const openAiApiKey = requireEnv("OPENAI_API_KEY");

const summarizer = createAgent({
	name: "summarizer",
	system: transcriptToSummaryPrompt.trim(),
	model: openai({ model: "gpt-4o-mini", apiKey: openAiApiKey }),
});

export const meetingsProcessing = inngest.createFunction(
	{ id: "meetings/processing" },
	{ event: "meetings/processing" },
	async ({ event, step }) => {
		const response = await step.run("fetch-transcript", async () => {
			return fetch(event.data.transcriptUrl).then((res) => res.text());
		});

		const transcript = await step.run("parse-transcript", async () => {
			return JSONL.parse<StreamTranscriptItem>(response);
		});

		const transcriptWithSpeakers = await step.run("add-speakers", async () => {
			const speakerIds = [
				...new Set(transcript.map((item) => item.speaker_id)),
			];
			const userSpeakers = await db
				.select()
				.from(user)
				.where(inArray(user.id, speakerIds))
				.then((res) =>
					res.map((user) => ({
						...user,
					})),
				);

			const agentSpeakers = await db
				.select()
				.from(agents)
				.where(inArray(agents.id, speakerIds))
				.then((res) =>
					res.map((agent) => ({
						...agent,
					})),
				);

			const speakers = [...userSpeakers, ...agentSpeakers];

			return transcript.map((item) => {
				const speaker = speakers.find(
					(speaker) => speaker.id === item.speaker_id,
				);

				return {
					...item,
					user: {
						name: speaker?.name ?? "Unknown",
					},
				};
			});
		});

		const { output } = await summarizer.run(
			`Summary the following transcript: ${JSON.stringify(transcriptWithSpeakers)}`,
		);

		await step.run("save-summary", async () => {
			await db
				.update(meetings)
				.set({
					summary: (output[0] as TextMessage).content as string,
					status: MeetingStatus.COMPLETED,
				})
				.where(eq(meetings.id, event.data.meetingId));
		});
	},
);
