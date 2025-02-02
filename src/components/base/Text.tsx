import { forwardRef } from "react";
import { TextProps } from "react-native";
import { createText } from "@shopify/restyle";
import { ColorProps, TextProps as RestyledTextProps } from "@shopify/restyle";

import { Theme } from "@theme";
import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";

const RestyleText = createText<Theme>();

export type RestyledColorProps = ColorProps<Theme> & RestyledTextProps<Theme>;

type Props = TextProps & RestyledColorProps & { accent?: boolean };

export const Text = forwardRef<TextProps, Props>((props, ref) => {
  const accentColor = useAppSelector(selectAccent);
  const { children, accent = false, ...rest } = props;

  return (
    <RestyleText
      {...rest}
      {...(accentColor && accent
        ? { color: accentColor }
        : { color: rest.color })}
    >
      {children}
    </RestyleText>
  );
});

export default Text;
