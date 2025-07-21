import "server-only";

import { StreamChat } from "stream-chat";
import { requireEnv } from "./env";

const apiKey = requireEnv("NEXT_PUBLIC_STREAM_CHAT_API_KEY");
const secretKey = requireEnv("STREAM_CHAT_SECRET_KEY");

export const streamChat = StreamChat.getInstance(apiKey, secretKey);
