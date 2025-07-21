import "server-only";

import { StreamClient } from "@stream-io/node-sdk";
import { requireEnv } from "./env";

const apiKey = requireEnv("NEXT_PUBLIC_STREAM_VIDEO_API_KEY");
const secretKey = requireEnv("STREAM_VIDEO_SECRET_KEY");

export const streamVideo = new StreamClient(apiKey, secretKey);
