import "server-only";

import { StreamClient } from "@stream-io/node-sdk";
import { requireEnv } from "./env";

export const streamVideo = new StreamClient(
	requireEnv("NEXT_PUBLIC_STREAM_VIDEO_API_KEY"),
	requireEnv("STREAM_VIDEO_SECRET_KEY"),
);
