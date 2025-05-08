import { ViewProps } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface Props extends ViewProps {
  children: React.ReactNode;
  offset?: number;
  type?: "padding" | "height";
}

export const KeyboardAvoidingView2 = ({
  children,
  offset = 32,
  style,
  ...props
}: Props) => {
  const { height } = useReanimatedKeyboardAnimation();

  const animation = useAnimatedStyle(() => {
    return {
      height: -height.value + offset,
    };
  });

  return (
    <Animated.View style={[animation, style]} {...props}>
      {children}
    </Animated.View>
  );
};
