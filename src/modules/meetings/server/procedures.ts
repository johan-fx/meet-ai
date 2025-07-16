import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import z from "zod";
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	MIN_PAGE_SIZE,
} from "@/constants";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
	newMeetingSchema,
	updateMeetingSchema,
	updateMeetingStatusSchema,
} from "../schemas";

export const meetingsRouter = createTRPCRouter({
	getOne: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const [existingMeeting] = await db
				.select({
					...getTableColumns(meetings),
				})
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
					.enum(["upcoming", "active", "completed", "processing", "cancelled"])
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
				.select({ id: agents.id })
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

			// TODO: Create Stream Call, Upsert Stream Users

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
				status:
					| "upcoming"
					| "active"
					| "completed"
					| "processing"
					| "cancelled";
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

	getByStatus: protectedProcedure
		.input(
			z.object({
				status: z.enum([
					"upcoming",
					"active",
					"completed",
					"processing",
					"cancelled",
				]),
				limit: z.number().optional().default(10),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { status, limit } = input;

			const data = await db
				.select({
					...getTableColumns(meetings),
				})
				.from(meetings)
				.where(
					and(
						eq(meetings.userId, ctx.auth.user.id),
						eq(meetings.status, status),
					),
				)
				.orderBy(desc(meetings.createdAt))
				.limit(limit);

			return data;
		}),

	getUpcoming: protectedProcedure
		.input(z.object({ limit: z.number().optional().default(5) }))
		.query(async ({ ctx, input }) => {
			return db
				.select({
					...getTableColumns(meetings),
				})
				.from(meetings)
				.where(
					and(
						eq(meetings.userId, ctx.auth.user.id),
						eq(meetings.status, "upcoming"),
					),
				)
				.orderBy(meetings.createdAt)
				.limit(input.limit);
		}),

	getStats: protectedProcedure.query(async ({ ctx }) => {
		const stats = await db
			.select({
				status: meetings.status,
				count: count(),
			})
			.from(meetings)
			.where(eq(meetings.userId, ctx.auth.user.id))
			.groupBy(meetings.status);

		return stats.reduce(
			(acc, stat) => {
				acc[stat.status] = stat.count;
				return acc;
			},
			{
				upcoming: 0,
				active: 0,
				completed: 0,
				processing: 0,
				cancelled: 0,
			} as Record<string, number>,
		);
	}),
});
