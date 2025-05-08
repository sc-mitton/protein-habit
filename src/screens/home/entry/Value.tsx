import { useRef, useEffect } from "react";
import { StyleSheet, View, Text as RNText } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
  FadeOut,
} from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";
import LottieView from "lottie-react-native";

import fontStyles from "@styles/fonts";
import { Box, Text } from "@components";
import { useAppSelector } from "@store/hooks";
import { selectAccent, selectFont } from "@store/slices/uiSlice";
import { success as successLottie } from "@assets/lotties";

const styles = StyleSheet.create({
  entry: {
    fontSize: 84,
    lineHeight: 84,
  },
  successLottie: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  placeholder: {
    opacity: 0,
  },
});

const AnimatedValue = ({ value }: { value: number }) => {
  const theme = useTheme();
  const font = useAppSelector(selectFont);

  return (
    <Box
      flexDirection="row"
      alignItems="baseline"
      justifyContent="center"
      marginTop="sm"
    >
      {value
        .toString()
        .split("")
        .map((char, i) => (
          <Animated.Text
            key={`num-${char}-${i}`}
            entering={FadeInUp.springify().damping(15).stiffness(150)}
            exiting={FadeOutDown.springify().damping(15).stiffness(150)}
            layout={LinearTransition}
            style={[
              fontStyles[font],
              styles.entry,
              { color: theme.colors.primaryText },
            ]}
          >
            {char}
          </Animated.Text>
        ))}
      <Animated.View layout={LinearTransition}>
        <Box paddingBottom="s">
          <Text variant="bold" marginLeft="xs" fontSize={32} lineHeight={44}>
            g
          </Text>
        </Box>
      </Animated.View>
    </Box>
  );
};

const Value = ({
  value,
  showSuccess,
}: {
  value: number;
  showSuccess: boolean;
}) => {
  const theme = useTheme();
  const font = useAppSelector(selectFont);
  const accent = useAppSelector(selectAccent);
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    setTimeout(() => {
      animation.current?.reset();
    }, 0);
  }, []);

  useEffect(() => {
    if (showSuccess) {
      animation.current?.reset();
      animation.current?.play();
    }
  }, [showSuccess]);

  return (
    <Box gap="s" width="100%">
      <View style={styles.successLottie}>
        <LottieView
          ref={animation}
          loop={false}
          autoPlay={false}
          style={{ width: 48, height: 48 }}
          speed={1.4}
          source={successLottie}
          colorFilters={[
            {
              keypath: "check",
              color: theme.colors[accent] || theme.colors.primaryText,
            },
            {
              keypath: "circle",
              color: theme.colors[accent] || theme.colors.primaryText,
            },
          ]}
        />
      </View>
      {showSuccess ? (
        <Box style={styles.placeholder}>
          <RNText style={[fontStyles[font], styles.entry]}>1</RNText>
        </Box>
      ) : (
        <Animated.View exiting={FadeOut}>
          <AnimatedValue value={value} />
        </Animated.View>
      )}
    </Box>
  );
};

export default Value;
