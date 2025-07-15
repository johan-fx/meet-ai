import { z } from "zod";

export const newAgentSchema = z.object({
	name: z.string().min(1, { message: "agents.form.errors.nameRequired" }),
	instructions: z
		.string()
		.min(1, { message: "agents.form.errors.instructionsRequired" }),
});

export const updateAgentSchema = newAgentSchema.extend({
	id: z.string().min(1, { message: "agents.form.errors.idRequired" }),
});
