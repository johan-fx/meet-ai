import { Polar } from "@polar-sh/sdk";
import { requireEnv } from "./env";

export const polarClient = new Polar({
	accessToken: requireEnv("POLAR_ACCESS_TOKEN"),
	server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});
