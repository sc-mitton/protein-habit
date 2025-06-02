import convert from "color-convert";

export const convertHex2Hsl = (hex: string) => {
  const hsl = convert.hex.hsl(hex);
  return `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)`;
};

export const lightenColor = (amount: number, color?: string) => {
  if (!color) return color;
  const hsl = convert.hex.hsl(color);
  hsl[2] = Number(hsl[2]) + amount;
  return convert.hsl.hex(hsl);
};
