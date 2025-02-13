import { useMemo, useRef, useEffect } from "react";
import { useColorScheme, Dimensions, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ConfettiCannon from "react-native-confetti-cannon";
import { useTheme } from "@shopify/restyle";
import Animated, {
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Box, Text, Button, BackDrop } from "@components";
import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";
import { Theme } from "@theme";

const SuccessModal = () => {
  const navigation = useNavigation();
  const confettiOpacity = useSharedValue(0);
  const theme = useTheme<Theme>();
  const confetti = useRef<ConfettiCannon>(null);
  const accent = useAppSelector(selectAccent);
  const scheme = useColorScheme();
  const colors = useMemo(() => {
    return accent
      ? Array.from({ length: 4 }, (_, i) =>
          theme.colors[accent].replace(/([\d.]+)%\)$/, (_, lightness) => {
            const newLightness =
              scheme === "dark"
                ? Number(lightness) - i * 10
                : Number(lightness) + i * 10;
            return `${newLightness}%)`;
          }),
        )
      : undefined;
  }, [accent, scheme]);

  useEffect(() => {
    const t = setTimeout(() => {
      confetti.current?.start();
      confettiOpacity.value = withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 3000 }),
      );
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const confettiOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: confettiOpacity.value,
    };
  });

  return (
    <Box flex={1} justifyContent="center" alignItems="center" padding="l">
      <BackDrop />
      <Animated.View layout={LinearTransition}>
        <Text variant="header" textAlign="center" marginBottom="s">
          You've reached your goal
        </Text>
        <Text variant="header" textAlign="center" marginBottom="l">
          for the day!&nbsp;&nbsp;🎉
        </Text>
        <Button
          onPress={() => navigation.goBack()}
          variant="primary"
          width={300}
          padding="m"
          borderRadius="m"
        >
          <Text color="primaryText" accent>
            Dismiss
          </Text>
        </Button>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, confettiOpacityStyle]}>
        <ConfettiCannon
          count={200}
          origin={{ x: Dimensions.get("window").width / 2, y: 0 }}
          fadeOut={true}
          autoStart={false}
          colors={colors}
          ref={confetti}
        />
      </Animated.View>
    </Box>
  );
};

export default SuccessModal;
