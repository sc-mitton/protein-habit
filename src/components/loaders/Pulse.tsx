import { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
} from "react-native-reanimated";

import styles from "./styles/pulse";
import { Box, BoxProps } from "../base/Box";

export const Pulse = (props: BoxProps) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      Math.random() * 1500,
      withRepeat(withTiming(0.5, { duration: 1000 }), -1, true),
    );
  }, []);

  return (
    <Animated.View style={[{ opacity }, styles.pulse]}>
      <Box
        backgroundColor="primaryButton"
        height={"100%"}
        width={"100%"}
        {...props}
      />
    </Animated.View>
  );
};

export default Pulse;
