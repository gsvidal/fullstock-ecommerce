import { createGeminiChat } from "@tanstack/ai-gemini";
import { env } from "../env.server";

export function chatModel() {
  return createGeminiChat("gemini-3.5-flash-lite", env.GEMINI_API_KEY);
}
