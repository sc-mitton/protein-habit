import { View } from "react-native";

import {
  ColorProps,
  BorderProps,
  composeRestyleFunctions,
  color,
  border,
  useRestyle,
} from "@shopify/restyle";
import { Theme } from "@theme";
import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";

const restyleFunctions = composeRestyleFunctions([color, border]);

export type IconProps = {
  size: number;
  stroke: string;
  fill: string;
};

interface ExtraProps {
  strokeWidth?: number;
  icon: React.ComponentType<IconProps>;
  size?: number;
  rotate?: number;
}
type Props = ColorProps<Theme> &
  BorderProps<Theme> &
  ExtraProps & { accent?: true };

export const Icon = (props: Props) => {
  const accentColor = useAppSelector(selectAccent);
  const {
    accent,
    color = "primaryText",
    icon: Icon,
    size,
    rotate,
    ...rest
  } = props;
  const updatedColor = accent ? accentColor || color : color;
  const restyleProps = useRestyle(restyleFunctions as any, {
    color: updatedColor,
    ...rest,
  });

  return (
    <View style={{ transform: [{ rotate: `${rotate || 0}deg` }] }}>
      <Icon
        size={size || 20}
        stroke={
          (restyleProps as any).style[0].borderColor ||
          (restyleProps as any).style[0].color
        }
        fill={
          (restyleProps as any).style[0].borderColor
            ? (restyleProps as any).style[0].borderColor
            : "none"
        }
        {...props}
      />
    </View>
  );
};
