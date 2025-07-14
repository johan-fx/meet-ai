import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { requireEnv } from "./env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
		},
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
	},
	socialProviders: {
		github: {
			clientId: requireEnv("GITHUB_CLIENT_ID"),
			clientSecret: requireEnv("GITHUB_CLIENT_SECRET"),
		},
		google: {
			prompt: "select_account",
			clientId: requireEnv("GOOGLE_CLIENT_ID"),
			clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	rateLimit: {
		window: 15 * 60 * 1000, // 15 minutes
		max: 100, // max requests per window per IP
	},
	secret: requireEnv("BETTER_AUTH_SECRET"),
	trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? ""],
});
