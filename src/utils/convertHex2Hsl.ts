import convert from "color-convert";

export const convertHex2Hsl = (hex: string) => {
  const hsl = convert.hex.hsl(hex);
  return `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)`;
};
