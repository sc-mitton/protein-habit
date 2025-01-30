export const fontOptions = ["inter", "nyHeavy", "sfStencil"] as const;

export type FontOption = (typeof fontOptions)[number];
