import React from "react";
import { Image } from "expo-image";
import Reanimated from "react-native-reanimated";
import { Dimensions, StyleSheet } from "react-native";

import { RootScreenProps } from "@types";
import { Box } from "@components";

type Props = RootScreenProps<"RecipeDetail">;

const AnimatedImage = Reanimated.createAnimatedComponent(Image);

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: Dimensions.get("window").height / 4,
  },
});

const DetailScreen: React.FC<Props> = (props) => {
  return (
    <Box flex={1} backgroundColor="matchBlurBackground" padding="m">
      <AnimatedImage
        sharedTransitionTag={`thumbnail-${props.route.params.recipe?.id}`}
        source={{
          uri: props.route.params.recipe
            ? "https://protein-count-recipe-thumbnails.s3.us-west-1.amazonaws.com/a3d4e7c9-4f85-4d8e-bfde-1e3f6d8b0986.jpg"
            : "",
        }}
        style={styles.image}
        contentFit="cover"
        transition={100}
      />
    </Box>
  );
};

export default DetailScreen;
