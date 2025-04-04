import { memo } from "react";
import { useTheme } from "@shopify/restyle";
import { TouchableHighlight, StyleSheet } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Box, Text, Icon } from "@components";
import { Delete } from "geist-native-icons";

const KeypadButton = ({
  value,
  onPress,
  disabled,
}: {
  value: string | number;
  onPress: (value: string | number) => void;
  disabled: boolean;
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        { flex: 1, width: "100%" },
        animatedStyle,
        styles.keyTouchContainer,
      ]}
    >
      <TouchableHighlight
        style={styles.keyTouch}
        onPress={() => onPress(value)}
        onPressIn={() => {
          scale.value = withSpring(0.85, { mass: 0.5, damping: 8 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { mass: 0.5, damping: 8 });
        }}
        activeOpacity={1}
        disabled={disabled}
        underlayColor={theme.colors.primaryButton}
      >
        <Box flex={1} justifyContent="center" alignItems="center" width="100%">
          <Text textAlign="center" fontSize={32} lineHeight={36}>
            {value === "del" ? (
              <Icon
                icon={Delete}
                size={24}
                color="primaryText"
                strokeWidth={2}
              />
            ) : (
              value
            )}
          </Text>
        </Box>
      </TouchableHighlight>
    </Animated.View>
  );
};

const KeyPad = memo(
  ({
    handleKeyPress,
    disabled,
  }: {
    handleKeyPress: (key: number | string) => void;
    disabled: boolean;
  }) => {
    return (
      <Box width="100%" gap="s" padding="l" justifyContent="center" flex={3}>
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          ["", 0, "del"],
        ].map((row, i) => (
          <Box
            key={`keypad-row-${i}`}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-evenly"
            flex={1}
          >
            {row.map((key) => (
              <KeypadButton
                disabled={key === "" || (disabled && key !== "del")}
                key={`keypad-button-${key}`}
                value={key}
                onPress={() => handleKeyPress(key)}
              />
            ))}
          </Box>
        ))}
      </Box>
    );
  },
);

const styles = StyleSheet.create({
  entry: {
    fontSize: 84,
    lineHeight: 84,
  },
  keyTouchContainer: {
    flex: 1,
  },
  keyTouch: {
    width: "100%",
    flex: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 64,
  },
  mask: {
    width: "100%",
    justifyContent: "center",
    alignItems: "baseline",
    flexDirection: "row",
  },
  successLottie: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
});

export default KeyPad;
