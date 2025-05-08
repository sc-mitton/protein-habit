import { forwardRef } from "react";
import { TextProps as RNTextProps, Text as RNText } from "react-native";
import {
  ColorProps,
  TextProps as RestyledTextProps,
  createVariant,
  VariantProps,
  composeRestyleFunctions,
  useRestyle,
  color,
  typography,
  TypographyProps,
  spacing,
  SpacingProps,
} from "@shopify/restyle";

import { Theme } from "@theme";
import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";

const variant = createVariant({ themeKey: "textVariants" });

export type RestyledColorProps = ColorProps<Theme> &
  RestyledTextProps<Theme> &
  VariantProps<Theme, "textVariants"> &
  ColorProps<Theme> &
  TypographyProps<Theme> &
  SpacingProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyledColorProps>([
  variant,
  color,
  typography,
  spacing,
]);

export type TextProps = RestyledColorProps & {
  accent?: boolean;
  children: React.ReactNode;
  style?: RNTextProps["style"];
};

export const Text = forwardRef<RNText, TextProps>((props, ref) => {
  const { children, color, accent, style, ...rest } = props;
  const accentColor = useAppSelector(selectAccent);
  const updatedProps = {
    ...rest,
    color: accent && accentColor ? accentColor : color,
  } as any;
  const restyledProps = useRestyle(restyleFunctions, updatedProps);

  return (
    <RNText style={[restyledProps.style]} ref={ref}>
      {children}
    </RNText>
  );
});

export default Text;
