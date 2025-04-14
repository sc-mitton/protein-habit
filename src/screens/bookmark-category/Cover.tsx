import { useAppSelector } from "@store/hooks";
import { selectCategory } from "@store/slices/bookmarksSlice";
import { Image } from "expo-image";
import { Animated, Dimensions, StyleSheet } from "react-native";

import { ProgressiveBlur, Box, RecipeThumbnail } from "@components";

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
  categoryId,
}: {
  scale: Animated.AnimatedInterpolation<string | number>;
  categoryId: string;
}) => {
  const category = useAppSelector((state) => selectCategory(state, categoryId));
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
        {coverPhoto ? (
          <Image
            key={coverPhoto}
            source={{
              uri: coverPhoto,
              cache: "reload",
            }}
            style={styles.coverPhoto}
            contentFit="cover"
            transition={100}
            recyclingKey={coverPhoto}
          />
        ) : (
          <Box style={styles.coverPhoto} backgroundColor="primaryButton" />
        )}
      </ProgressiveBlur>
    </AnimatedBox>
  );
};

export default CategoryPicture;
