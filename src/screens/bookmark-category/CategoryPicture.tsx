import { useAppSelector } from "@store/hooks";
import { selectCategory } from "@store/slices/bookmarksSlice";
import { Animated, Dimensions, StyleSheet } from "react-native";

import { ProgressiveBlur, Box, RecipeThumbnail } from "@components";
import { SharedValue } from "react-native-reanimated";

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

export const IMAGE_HEIGHT = Dimensions.get("window").height * 0.5;

const AnimatedBox = Animated.createAnimatedComponent(Box);

const CategoryPicture = ({
  scale,
}: {
  scale: Animated.AnimatedInterpolation<string | number>;
}) => {
  const category = useAppSelector(selectCategory);
  const coverPhoto = category?.coverPhoto;

  return (
    <AnimatedBox
      height={IMAGE_HEIGHT}
      width="100%"
      style={[
        styles.container,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <ProgressiveBlur end={0.7}>
        <RecipeThumbnail
          source={{ uri: coverPhoto }}
          style={styles.coverPhoto}
          contentFit="cover"
        />
      </ProgressiveBlur>
    </AnimatedBox>
  );
};

export default CategoryPicture;
