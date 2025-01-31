import { forwardRef } from "react";
import { ViewProps, View } from "react-native";
import {
  useRestyle,
  createVariant,
  backgroundColor,
  spacing,
  layout,
  shadow,
  border,
  opacity,
  ShadowProps,
  SpacingProps,
  BorderProps,
  LayoutProps,
  VariantProps,
  OpacityProps,
  BackgroundColorProps,
  composeRestyleFunctions,
} from "@shopify/restyle";

import { Theme } from "@theme";

type RestyleProps = SpacingProps<Theme> &
  VariantProps<Theme, "boxVariants"> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  LayoutProps<Theme> &
  OpacityProps<Theme>;

const variant = createVariant({ themeKey: "boxVariants" });

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  variant,
  backgroundColor,
  spacing,
  layout,
  shadow,
  border,
  opacity,
]);

export type BoxProps = RestyleProps & ViewProps;

export const Box = forwardRef<View, BoxProps>(({ children, ...rest }, ref) => {
  const props = useRestyle(restyleFunctions, rest);

  return (
    <View ref={ref} {...props}>
      {children}
    </View>
  );
});
