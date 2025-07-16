import type { inferRouterOutputs } from "@trpc/server";
import type { agentsRouter } from "./server/procedures";

type RouterOutputs = inferRouterOutputs<typeof agentsRouter>;

export type AgentGetOne = RouterOutputs["getOne"];
export type AgentGetMany = RouterOutputs["getMany"]["items"];
