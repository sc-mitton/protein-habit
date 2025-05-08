import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Appearance, Dimensions, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useTheme } from "@shopify/restyle";
import Animated from "react-native-reanimated";

import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  edgeContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
    opacity: Appearance.getColorScheme() === "dark" ? 0.25 : 0.6,
  },
  edge: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

const EdgeAnimation = () => {
  const { height, progress } = useReanimatedKeyboardAnimation();
  const edgeRotation = useSharedValue(0);
  const theme = useTheme();
  const accent = useAppSelector(selectAccent);

  useEffect(() => {
    edgeRotation.value = withRepeat(
      withTiming(360, { duration: 5000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const edgeAnimation = useAnimatedStyle(() => {
    const width = progress.value > 0 ? WINDOW_WIDTH : WINDOW_WIDTH * 1.5;
    const height = progress.value > 0 ? WINDOW_HEIGHT : WINDOW_HEIGHT * 1.5;
    return {
      // Rotate edge infinitely
      transform: [
        {
          rotate: `${edgeRotation.value}deg`,
        },
      ],
      width: progress.value > 0 ? width : width * 1.5,
      height: progress.value > 0 ? height : height * 1.5,
    };
  });

  return (
    <View style={[styles.edgeContainer]}>
      <Animated.View style={[edgeAnimation, styles.edge]}>
        <LinearGradient
          style={styles.edge}
          colors={[
            accent ? theme.colors[accent] : theme.colors.secondaryText,
            accent ? theme.colors[accent] : theme.colors.secondaryText,
            theme.colors.tertiaryText,
            theme.colors.tertiaryText,
            accent ? theme.colors[accent] : theme.colors.secondaryText,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </View>
  );
};

export default EdgeAnimation;
