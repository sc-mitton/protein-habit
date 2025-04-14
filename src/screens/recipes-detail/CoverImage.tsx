import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Box, ProgressiveBlur, RecipeThumbnail } from "@components";

export const IMAGE_HEIGHT = Dimensions.get("window").height * 0.55;

const styles = StyleSheet.create({
  coverPhoto: {
    width: "100%",
    height: "100%",
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});

const AnimatedRecipeThumbnail =
  Animated.createAnimatedComponent(RecipeThumbnail);

const AnimatedBox = Animated.createAnimatedComponent(Box);

const CategoryPicture = ({
  uri,
  scale,
}: {
  uri?: string;
  scale: SharedValue<number>;
}) => {
  const animation = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedBox
      height={IMAGE_HEIGHT}
      width="100%"
      style={[styles.container, animation]}
    >
      <ProgressiveBlur end={0.7}>
        <AnimatedRecipeThumbnail
          key={uri}
          source={{
            uri: uri,
            cache: "reload",
          }}
          style={styles.coverPhoto}
          contentFit="cover"
          transition={100}
          recyclingKey={uri}
        />
      </ProgressiveBlur>
    </AnimatedBox>
  );
};

export default CategoryPicture;
