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
import { agents } from "@/db/schema";
import {
	createTRPCRouter,
	premiumProcedure,
	protectedProcedure,
} from "@/trpc/init";
import { newAgentSchema, updateAgentSchema } from "../schemas";

export const agentsRouter = createTRPCRouter({
	getOne: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const [existingAgent] = await db
				.select({
					...getTableColumns(agents),
					meetingCount: sql<number>`5`,
				})
				.from(agents)
				.where(
					and(eq(agents.userId, ctx.auth.user.id), eq(agents.id, input.id)),
				);

			if (!existingAgent) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Agent not found",
				});
			}

			return existingAgent;
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
			}),
		)
		.query(async ({ ctx, input }) => {
			const { page, pageSize, search } = input;

			const where = and(
				eq(agents.userId, ctx.auth.user.id),
				search ? ilike(agents.name, `%${search}%`) : undefined,
			);

			const data = await db
				.select({
					...getTableColumns(agents),
					meetingCount: sql<number>`5`,
				})
				.from(agents)
				.where(where)
				.orderBy(desc(agents.createdAt), desc(agents.id))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			const [total] = await db
				.select({ count: count() })
				.from(agents)
				.where(where);

			const totalPages = Math.ceil(total.count / pageSize);

			return { items: data, total: total.count, totalPages };
		}),
	create: premiumProcedure("agents")
		.input(newAgentSchema)
		.mutation(async ({ ctx, input }) => {
			const [createdAgent] = await db
				.insert(agents)
				.values({
					...input,
					userId: ctx.auth.user.id,
				})
				.returning();

			return createdAgent;
		}),
	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const [removedAgent] = await db
				.delete(agents)
				.where(
					and(eq(agents.userId, ctx.auth.user.id), eq(agents.id, input.id)),
				)
				.returning();

			if (!removedAgent) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Agent not found",
				});
			}

			return removedAgent;
		}),
	update: protectedProcedure
		.input(updateAgentSchema)
		.mutation(async ({ ctx, input }) => {
			const [updatedAgent] = await db
				.update(agents)
				.set(input)
				.where(
					and(eq(agents.userId, ctx.auth.user.id), eq(agents.id, input.id)),
				)
				.returning();

			if (!updatedAgent) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Agent not found",
				});
			}

			return updatedAgent;
		}),
});
