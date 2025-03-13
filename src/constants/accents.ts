export const accentOptions = [
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
] as const;

export type AccentOption = (typeof accentOptions)[number];
