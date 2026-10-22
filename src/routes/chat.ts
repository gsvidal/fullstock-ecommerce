import type { ActionFunctionArgs } from "react-router";
import {
  chatParamsFromRequestBody,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { chatbotStream } from "../services/chatbot.service";

export async function action({ request }: ActionFunctionArgs) {
  const { messages } = await chatParamsFromRequestBody(await request.json());

  const chatStream = chatbotStream(messages);

  return toServerSentEventsResponse(chatStream);
}
