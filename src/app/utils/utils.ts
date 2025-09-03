import { Message } from "@/lib/native-client";

export function extractStringFromMessageContent(message: Message): string {
  let content = message.content;

  // Si content es string, primero intentamos parsearlo como JSON
  if (typeof content === "string") {
    try {
      // Intentar parsear como JSON en caso de que sea un array stringificado
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        content = parsed;
      } else {
        // Si no es array, devolver el string original
        return content;
      }
    } catch {
      // Si falla el parsing, devolver el string original
      return content;
    }
  }

  // Si ya es array o lo convertimos a array, procesarlo
  if (Array.isArray(content)) {
    return content
      .filter((c: unknown) => {
        // Filtrar elementos de texto
        return (
          (typeof c === "object" && c !== null && (c as Record<string, unknown>).type === "text") ||
          typeof c === "string"
        );
      })
      .map((c: unknown) => {
        if (typeof c === "string") {
          return c;
        }
        if (typeof c === "object" && c !== null) {
          const obj = c as Record<string, unknown>;
          return obj.text || "";
        }
        return "";
      })
      .join("");
  }

  return "";
}
