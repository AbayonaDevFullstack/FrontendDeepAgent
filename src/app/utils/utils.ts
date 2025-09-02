import { Message } from "@langchain/langgraph-sdk";

export function extractStringFromMessageContent(message: Message): string {
  return typeof message.content === "string"
    ? message.content
    : Array.isArray(message.content)
      ? message.content
          .filter((c: unknown) => (typeof c === "object" && c !== null && (c as Record<string, unknown>).type === "text") || typeof c === "string")
          .map((c: unknown) => (typeof c === "string" ? c : (c as Record<string, unknown>).text || ""))
          .join("")
      : "";
}
