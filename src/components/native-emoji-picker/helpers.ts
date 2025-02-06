// @ts-ignore
import e from "emoji-datasource";
import type { Category, Emoji } from "./types";

export const emojis: Emoji[] = e;

export function charFromUtf16(utf16: string) {
  return String.fromCodePoint(
    ...(utf16.split("-").map((u) => "0x" + u) as any),
  );
}

export function charFromEmojiObject(obj: Emoji) {
  return charFromUtf16(obj.unified);
}

const filteredEmojis = emojis.filter((e) => !e["obsoleted_by"]);

export function getEmojisByCategory(category: string) {
  return filteredEmojis.filter((e) => e.category === category);
}
