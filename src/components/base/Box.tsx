import { forwardRef } from "react";
import { ViewProps, View } from "react-native";
import { position } from "@shopify/restyle";

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
  PositionProps,
  OpacityProps,
  BackgroundColorProps,
  composeRestyleFunctions,
} from "@shopify/restyle";
import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";

import { Theme } from "@theme";

type RestyleProps = SpacingProps<Theme> &
  VariantProps<Theme, "boxVariants"> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  PositionProps<Theme> &
  LayoutProps<Theme> &
  OpacityProps<Theme>;

const variant = createVariant({ themeKey: "boxVariants" });

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  variant,
  backgroundColor,
  spacing,
  layout,
  position as any,
  shadow,
  border,
  opacity,
]);

export type BoxProps = RestyleProps & ViewProps & { accent?: boolean };

export const Box = forwardRef<View, BoxProps>(
  ({ children, accent = false, ...rest }, ref) => {
    const accentColor = useAppSelector(selectAccent);
    const updatedProps = {
      ...rest,
      backgroundColor:
        accent && accentColor ? accentColor : rest.backgroundColor,
    } as any;
    const props = useRestyle(restyleFunctions, updatedProps);

    return (
      <View ref={ref} {...props}>
        {children}
      </View>
    );
  },
);
