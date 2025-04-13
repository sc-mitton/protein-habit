import { useAppSelector } from "@store/hooks";
import { selectCategory } from "@store/slices/bookmarksSlice";
import { Dimensions, StyleSheet } from "react-native";

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

const IMAGE_HEIGHT = Dimensions.get("window").height * 0.25;

const CustomHeader = () => {
  const category = useAppSelector(selectCategory);
  const coverPhoto = category?.coverPhoto;

  return (
    <Box height={IMAGE_HEIGHT} width="100%" style={styles.container}>
      <ProgressiveBlur>
        <RecipeThumbnail
          source={{ uri: coverPhoto }}
          style={styles.coverPhoto}
          contentFit="cover"
        />
      </ProgressiveBlur>
    </Box>
  );
};

export default CustomHeader;
