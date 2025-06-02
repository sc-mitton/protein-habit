import convert from "color-convert";

export const convertHex2Hsl = (hex: string) => {
  const hsl = convert.hex.hsl(hex);
  return `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)`;
};

export const lightenColor = (color: string, amount: number) => {
  const hsl = convert.hex.hsl(color).toString();
  return hsl
    .replace(
      /(\d+)%,\s\d\)/,
      (match) => `${Math.max(0, parseInt(match) + amount)}%, 1)`,
    )
    .toString();
};
