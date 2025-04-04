import { View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import LottieView from "lottie-react-native";

import fontStyles from "@styles/fonts";
import { Box, Text } from "@components";
import success from "@lotties/success.json";

const SuccessAnimation = () => {
  return (
    <Box gap="s" width="100%">
      <Box>
        <View style={styles.successLottie}>
          <LottieView
            ref={animation}
            loop={false}
            autoPlay={false}
            style={{ width: 48, height: 48 }}
            source={success}
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
        {showSuccess && (
          <Text style={[fontStyles[font], styles.entry]} color="transparent">
            1
          </Text>
        )}
      </Box>
      {!showSuccess && (
        <Animated.View exiting={FadeOut}>
          <Value value={value} />
        </Animated.View>
      )}
    </Box>
  );
};

export default SuccessAnimation;
