import { inferRouterOutputs } from "@trpc/server";
import { agentsRouter } from "./server/procedures";

type RouterOutputs = inferRouterOutputs<typeof agentsRouter>;

export type AgentGetOne = RouterOutputs["getOne"];
