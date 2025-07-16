import { z } from "zod";

export const meetingStatusEnum = z.enum([
	"upcoming",
	"active",
	"completed",
	"processing",
	"cancelled",
]);

export const newMeetingSchema = z.object({
	name: z.string().min(1, { message: "meetings.form.errors.nameRequired" }),
	agentId: z.string().min(1, { message: "meetings.form.errors.agentRequired" }),
	status: meetingStatusEnum,
});

export const updateMeetingSchema = newMeetingSchema
	.extend({
		id: z.string().min(1, { message: "meetings.form.errors.idRequired" }),
		transcriptUrl: z.string().url().optional().nullable(),
		recordingUrl: z.string().url().optional().nullable(),
		summary: z.string().optional().nullable(),
		startedAt: z.date().optional().nullable(),
		endedAt: z.date().optional().nullable(),
	})
	.partial()
	.required({ id: true });

export const updateMeetingStatusSchema = z.object({
	id: z.string().min(1, { message: "meetings.form.errors.idRequired" }),
	status: meetingStatusEnum,
	startedAt: z.date().optional().nullable(),
	endedAt: z.date().optional().nullable(),
});
