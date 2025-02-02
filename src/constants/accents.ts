export const accentOptions = [
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
] as const;

export type AccentOption = (typeof accentOptions)[number];
