import { useEffect, useId, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "@shopify/restyle";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";
import { Box, Text } from "./base";
import checkMark from "@lotties/checkmark.json";
import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";

export interface CheckboxProps {
  default?: "checked" | "unchecked";
  value?: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  size?: number;
}

export function Checkbox(props: CheckboxProps) {
  const [checked, setChecked] = useState(
    props.default === "checked" ? true : false,
  );
  const key = useId();
  const { size = 24 } = props;
  const accent = useAppSelector(selectAccent);
  const animation = useRef<LottieView>(null);
  const theme = useTheme();
  const pressScale = useSharedValue(1);

  const press = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pressScale.value }],
    };
  });

  const checkContainerAnimation = useAnimatedStyle(() => {
    return {
      opacity: checked ? 1 : 0,
    };
  });

  useEffect(() => {
    if (props.value !== undefined) setChecked(props.value);
  }, [props.value]);

  useEffect(() => {
    if (checked) {
      animation.current?.play();
    } else {
      animation.current?.reset();
    }
    pressScale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );

    return () => {
      animation.current?.reset();
    };
  }, [checked]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => {
        setChecked(!checked);
        props.onChange(!checked);
      }}
    >
      <Animated.View style={press}>
        <Box
          backgroundColor={checked ? accent || "selected" : "primaryButton"}
          borderColor={checked ? "transparent" : "borderColor"}
          borderWidth={1.5}
          borderRadius="sm"
          style={{
            width: size,
            height: size,
          }}
        >
          <Animated.View
            style={[styles.checkIconContainer, checkContainerAnimation]}
            pointerEvents="none"
          >
            <LottieView
              ref={animation}
              source={checkMark}
              autoPlay={false}
              speed={3}
              loop={false}
              colorFilters={[
                {
                  keypath: "checkmark",
                  color: "white",
                },
              ]}
              style={{ width: size - 4, height: size - 4 }}
            />
          </Animated.View>
        </Box>
      </Animated.View>
      <Text fontSize={15}>{props.label}</Text>
    </TouchableOpacity>
  );
}

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  checkIconContainer: {
    position: "absolute",
    width: 2,
    height: 2,
    top: "50%",
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  checkIcon: {
    transform: [{ translateX: -1 }, { translateY: -0.5 }],
    position: "absolute",
  },
});
