import { useEffect, useLayoutEffect, useRef } from "react";
import { Dimensions, Keyboard, View, ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

interface Props extends ViewProps {
  children: React.ReactNode;
  offset?: number;
  type?: "padding" | "height";
}

export const KeyboardAvoidingView = ({
  children,
  offset = 128,
  type = "padding",
  style,
  ...props
}: Props) => {
  const viewRef = useRef<View>(null);
  const avoidValue = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const contentPageY = useSharedValue(0);

  const measureView = () => {
    if (viewRef.current) {
      viewRef.current.measure((x, y, width, height, pageX, pageY) => {
        contentHeight.value = height;
        contentPageY.value = pageY;
      });
    }
  };

  useLayoutEffect(() => {
    runOnJS(measureView)();
  });

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      const overlap = Math.max(
        e.endCoordinates.height -
          (Dimensions.get("window").height -
            contentPageY.value -
            contentHeight.value),
        0,
      );

      if (overlap > 0) {
        avoidValue.value = withTiming(overlap + offset);
      }
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      avoidValue.value = withTiming(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [offset]);

  const animatedStyle = useAnimatedStyle(() => {
    return type === "padding"
      ? { paddingBottom: avoidValue.value }
      : { height: avoidValue.value };
  });

  return (
    <Animated.View ref={viewRef} style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
};
