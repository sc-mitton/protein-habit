import { useRef, useLayoutEffect } from "react";
import { Dimensions, View, ViewProps } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface Props extends ViewProps {
  children: React.ReactNode;
  offset?: number;
  type?: "padding" | "height";
}

export const KeyboardAvoidingView = ({
  children,
  offset = 32,
  style,
  ...props
}: Props) => {
  const viewRef = useRef<View>(null);
  const { height, progress } = useReanimatedKeyboardAnimation();
  const topEdgeY = useSharedValue(0);

  useLayoutEffect(() => {
    setTimeout(() => {
      viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
        topEdgeY.value =
          Dimensions.get("window").height - pageY - height - offset;
      });
    }, 0);
  }, []);

  const animation = useAnimatedStyle(() => {
    return {
      paddingBottom: withTiming(
        progress.value > 0 ? -height.value - topEdgeY.value : offset,
        {
          duration: 200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
      ),
    };
  });

  return (
    <Animated.View ref={viewRef} style={[animation, style]} {...props}>
      {children}
    </Animated.View>
  );
};
