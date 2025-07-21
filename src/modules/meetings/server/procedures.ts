import { TRPCError } from "@trpc/server";
import {
	and,
	count,
	desc,
	eq,
	getTableColumns,
	ilike,
	inArray,
	sql,
} from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";
import z from "zod";
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	MIN_PAGE_SIZE,
} from "@/constants";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { defaultLocale } from "@/i18n/routing";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";
import { streamVideo } from "@/lib/stream-video";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
	newMeetingSchema,
	updateMeetingSchema,
	updateMeetingStatusSchema,
} from "../schemas";
import { MeetingStatus, type StreamTranscriptItem } from "../types";

export const meetingsRouter = createTRPCRouter({
	getOne: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const [existingMeeting] = await db
				.select({
					...getTableColumns(meetings),
					agent: agents,
					duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
						"duration",
					),
				})
				.from(meetings)
				.innerJoin(agents, eq(meetings.agentId, agents.id))
				.where(
					and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, input.id)),
				);

			if (!existingMeeting) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Meeting not found",
				});
			}

			return existingMeeting;
		}),

	getMany: protectedProcedure
		.input(
			z.object({
				page: z.number().default(DEFAULT_PAGE),
				pageSize: z
					.number()
					.min(MIN_PAGE_SIZE)
					.max(MAX_PAGE_SIZE)
					.default(DEFAULT_PAGE_SIZE),
				search: z.string().nullish(),
				status: z
					.enum([
						MeetingStatus.UPCOMING,
						MeetingStatus.ACTIVE,
						MeetingStatus.COMPLETED,
						MeetingStatus.PROCESSING,
						MeetingStatus.CANCELLED,
					])
					.nullish(),
				agentId: z.string().nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { page, pageSize, search, status, agentId } = input;

			const where = and(
				eq(meetings.userId, ctx.auth.user.id),
				search ? ilike(meetings.name, `%${search}%`) : undefined,
				status ? eq(meetings.status, status) : undefined,
				agentId ? eq(meetings.agentId, agentId) : undefined,
			);

			const data = await db
				.select({
					...getTableColumns(meetings),
					agent: agents,
					duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
						"duration",
					),
				})
				.from(meetings)
				.innerJoin(agents, eq(meetings.agentId, agents.id))
				.where(where)
				.orderBy(desc(meetings.createdAt), desc(meetings.id))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			const [total] = await db
				.select({ count: count() })
				.from(meetings)
				.innerJoin(agents, eq(meetings.agentId, agents.id))
				.where(where);

			const totalPages = Math.ceil(total.count / pageSize);

			return { items: data, total: total.count, totalPages };
		}),

	create: protectedProcedure
		.input(newMeetingSchema)
		.mutation(async ({ ctx, input }) => {
			// Verify that the agent belongs to the user
			const [existingAgent] = await db
				.select()
				.from(agents)
				.where(
					and(
						eq(agents.userId, ctx.auth.user.id),
						eq(agents.id, input.agentId),
					),
				);

			if (!existingAgent) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Agent not found or doesn't belong to user",
				});
			}

			const [createdMeeting] = await db
				.insert(meetings)
				.values({
					...input,
					userId: ctx.auth.user.id,
				})
				.returning();

			// Create Stream Call
			const call = streamVideo.video.call("default", createdMeeting.id);
			await call.create({
				data: {
					created_by_id: ctx.auth.user.id,
					custom: {
						meetingId: createdMeeting.id,
						meetingName: createdMeeting.name,
					},
					settings_override: {
						transcription: {
							language: (ctx.auth.user.locale ?? defaultLocale) as "en" | "es",
							mode: "auto-on",
							closed_caption_mode: "auto-on",
						},
						recording: {
							mode: "auto-on",
							quality: "1080p",
						},
					},
				},
			});

			// Upsert Stream current Agent
			await streamVideo.upsertUsers([
				{
					id: existingAgent.id,
					name: existingAgent.name,
					role: "user",
					image: generateAvatarUri({
						seed: existingAgent.name,
						variant: "botttsNeutral",
					}),
				},
			]);

			return createdMeeting;
		}),

	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const [removedMeeting] = await db
				.delete(meetings)
				.where(
					and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, input.id)),
				)
				.returning();

			if (!removedMeeting) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Meeting not found",
				});
			}

			return removedMeeting;
		}),

	update: protectedProcedure
		.input(updateMeetingSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, agentId, ...updateData } = input;

			// If agentId is being updated, verify it belongs to the user
			if (agentId) {
				const [existingAgent] = await db
					.select({ id: agents.id })
					.from(agents)
					.where(
						and(eq(agents.userId, ctx.auth.user.id), eq(agents.id, agentId)),
					);

				if (!existingAgent) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Agent not found or doesn't belong to user",
					});
				}
			}

			const [updatedMeeting] = await db
				.update(meetings)
				.set({
					...updateData,
					...(agentId && { agentId }),
					updatedAt: new Date(),
				})
				.where(and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, id)))
				.returning();

			if (!updatedMeeting) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Meeting not found",
				});
			}

			return updatedMeeting;
		}),

	updateStatus: protectedProcedure
		.input(updateMeetingStatusSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, status, startedAt, endedAt } = input;

			const updateData: {
				status: MeetingStatus;
				updatedAt: Date;
				startedAt?: Date | null;
				endedAt?: Date | null;
			} = {
				status,
				updatedAt: new Date(),
			};

			// Set timestamps based on status
			if (status === "active" && startedAt) {
				updateData.startedAt = startedAt;
			}
			if ((status === "completed" || status === "processing") && endedAt) {
				updateData.endedAt = endedAt;
			}

			const [updatedMeeting] = await db
				.update(meetings)
				.set(updateData)
				.where(and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, id)))
				.returning();

			if (!updatedMeeting) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Meeting not found",
				});
			}

			return updatedMeeting;
		}),

	generateToken: protectedProcedure.mutation(async ({ ctx }) => {
		await streamVideo.upsertUsers([
			{
				id: ctx.auth.user.id,
				name: ctx.auth.user.name,
				role: "admin",
				image:
					ctx.auth.user.image ??
					generateAvatarUri({ seed: ctx.auth.user.id, variant: "initials" }),
			},
		]);

		const token = streamVideo.generateUserToken({
			user_id: ctx.auth.user.id,
		});

		return token;
	}),
	getTranscript: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const [existingMeeting] = await db
				.select()
				.from(meetings)
				.where(
					and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, input.id)),
				);

			if (!existingMeeting) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Meeting not found",
				});
			}

			if (!existingMeeting.transcriptUrl) {
				return [];
			}

			const transcript = await fetch(existingMeeting.transcriptUrl)
				.then((res) => res.text())
				.then((text) => JSONL.parse<StreamTranscriptItem>(text))
				.catch(() => {
					console.error(
						"Error parsing transcript",
						existingMeeting.transcriptUrl,
					);
					return [];
				});

			const speakersIds = [
				...new Set(transcript.map((item) => item.speaker_id)),
			];

			const userSpeakers = await db
				.select()
				.from(user)
				.where(inArray(user.id, speakersIds))
				.then((items) =>
					items.map((item) => ({
						...item,
						image:
							item.image ??
							generateAvatarUri({ seed: item.name, variant: "initials" }),
					})),
				);

			const agentSpeakers = await db
				.select()
				.from(agents)
				.where(inArray(agents.id, speakersIds))
				.then((items) =>
					items.map((item) => ({
						...item,
						image: generateAvatarUri({
							seed: item.name,
							variant: "botttsNeutral",
						}),
					})),
				);

			const speakersMap = new Map(
				[...userSpeakers, ...agentSpeakers].map((speaker) => [
					speaker.id,
					speaker,
				]),
			);

			const transcriptWithSpeakers = transcript.map((item) => {
				const speaker = speakersMap.get(item.speaker_id);

				return {
					...item,
					user: {
						name: speaker?.name ?? "Unknown",
						image:
							speaker?.image ??
							generateAvatarUri({ seed: "Unknown", variant: "initials" }),
					},
				};
			});

			return transcriptWithSpeakers;
		}),
	generateChatToken: protectedProcedure.mutation(async ({ ctx }) => {
		const token = streamChat.createToken(ctx.auth.user.id);
		await streamChat.upsertUser({
			id: ctx.auth.user.id,
			role: "admin",
		});

		return token;
	}),
});
