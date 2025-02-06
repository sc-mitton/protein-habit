export const accentOptions = [
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "red",
] as const;

export type AccentOption = (typeof accentOptions)[number];
