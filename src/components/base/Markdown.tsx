import { forwardRef } from "react";
import { color, VariantProps } from "@shopify/restyle";
import Mark, { MarkdownProps } from "react-native-markdown-display";

import {
  useRestyle,
  createVariant,
  typography,
  composeRestyleFunctions,
  TypographyProps,
  opacity,
  OpacityProps,
  ColorProps,
} from "@shopify/restyle";
import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";

import { Theme } from "@theme";

const variant = createVariant({ themeKey: "textVariants" });

type RestyleProps = TypographyProps<Theme> &
  VariantProps<Theme, "textVariants"> &
  OpacityProps<Theme> &
  ColorProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  variant,
  typography,
  opacity,
  color,
]);

export type Props = RestyleProps &
  MarkdownProps & {
    accent?: boolean;
    children: React.ReactNode;
  };

export const Markdown = forwardRef<Mark, Props>(
  ({ children, accent = false, ...rest }, ref) => {
    const accentColor = useAppSelector(selectAccent);
    const updatedProps = {
      ...rest,
      color: accent && accentColor ? accentColor : rest.color || "primaryText",
    } as any;
    const props = useRestyle(restyleFunctions, updatedProps);

    return <Mark {...props}>{children}</Mark>;
  },
);
