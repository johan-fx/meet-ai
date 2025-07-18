import type { inferRouterOutputs } from "@trpc/server";
import type { z } from "zod";
import type { meetings } from "@/db/schema";
import type {
	newMeetingSchema,
	updateMeetingSchema,
	updateMeetingStatusSchema,
} from "./schemas";
import type { meetingsRouter } from "./server/procedures";

type RouterOutputs = inferRouterOutputs<typeof meetingsRouter>;

export type MeetingGetOne = RouterOutputs["getOne"];
export type MeetingGetMany = RouterOutputs["getMany"]["items"];

export type Meeting = typeof meetings.$inferSelect;
export type NewMeeting = z.infer<typeof newMeetingSchema>;
export type UpdateMeeting = z.infer<typeof updateMeetingSchema>;
export type UpdateMeetingStatus = z.infer<typeof updateMeetingStatusSchema>;

export enum MeetingStatus {
	UPCOMING = "upcoming",
	ACTIVE = "active",
	COMPLETED = "completed",
	PROCESSING = "processing",
	CANCELLED = "cancelled",
}

export type StreamTranscriptItem = {
	speaker_id: string;
	type: string;
	text: string;
	start_ts: number;
	stop_ts: number;
};
