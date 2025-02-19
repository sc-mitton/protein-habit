import { memo } from "react";
import { View, StyleSheet, TextStyle, Text } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

import { tickHeight } from "./constants";

interface TickProps {
  item: {
    value: number;
    index: number;
  };
  fontStyle: TextStyle;
  width: number;
  backgroundColor: string;
  scrollProgress: SharedValue<number>;
}

const styles = StyleSheet.create({
  tickContainer: {
    position: "absolute",
    left: "50%",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  tick: {
    borderRadius: 100,
    bottom: 0,
  },
  spacer: {
    width: "50%",
  },
  tickLabelContainer: {
    position: "absolute",
    left: "50%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tickLabel: {
    position: "absolute",
    top: "100%",
  },
  tickLabelSpacer: {
    opacity: 0,
  },
});

export const Tick = ({
  item,
  backgroundColor,
  fontStyle,
  scrollProgress,
  width,
}: TickProps) => {
  const tickAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollProgress.value,
        [
          width * (item.index - 3),
          width * (item.index - 2),
          width * (item.index - 1),
          width * item.index,
          width * (item.index + 1),
          width * (item.index + 2),
          width * (item.index + 3),
        ],
        [
          tickHeight * 0.15,
          tickHeight * 0.2,
          tickHeight * 0.27,
          tickHeight * 0.6,
          tickHeight * 0.27,
          tickHeight * 0.2,
          tickHeight * 0.15,
        ],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      ),
      opacity: interpolate(
        scrollProgress.value,
        [
          width * (item.index - 2),
          width * (item.index - 1),
          width * item.index,
          width * (item.index + 1),
          width * (item.index + 2),
        ],
        [0.1, 0.4, 1, 0.4, 0.1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      ),
    };
  });

  const labelContainerAnimation = useAnimatedStyle(() => {
    return {
      top: interpolate(
        scrollProgress.value,
        [
          width * (item.index - 2),
          width * (item.index - 1),
          width * item.index,
          width * (item.index + 1),
          width * (item.index + 2),
        ],
        [
          tickHeight * 0.35,
          tickHeight * 0.35,
          0,
          tickHeight * 0.35,
          tickHeight * 0.35,
        ],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      ),
      opacity: interpolate(
        scrollProgress.value,
        [
          width * (item.index - 2),
          width * (item.index - 1),
          width * item.index,
          width * (item.index + 1),
          width * (item.index + 2),
        ],
        [0, 0.4, 1, 0.4, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ),
    };
  });

  const labelAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollProgress.value,
            [
              width * (item.index - 1),
              width * item.index,
              width * (item.index + 1),
            ],
            [0.8, 1.1, 0.8],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        },
      ],
    };
  });

  return (
    <View style={[{ width, height: tickHeight }]}>
      <Animated.View
        style={[styles.tickLabelContainer, labelContainerAnimation]}
      >
        <Animated.Text style={[fontStyle, styles.tickLabel, labelAnimation]}>
          {item.value}
        </Animated.Text>
      </Animated.View>
      <View style={styles.tickContainer}>
        <Animated.View
          style={[
            tickAnimation,
            styles.tick,
            {
              width: 3,
              backgroundColor,
            },
          ]}
        />
      </View>
    </View>
  );
};

// Only memo for
export default memo(Tick);
