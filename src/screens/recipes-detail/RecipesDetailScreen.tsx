import React from "react";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { RootScreenProps } from "@types";
import { Box, Markdown } from "@components";

type Props = RootScreenProps<"RecipeDetail">;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "auto",
  },
});

const DetailScreen: React.FC<Props> = (props) => {
  return (
    <Box flex={1} backgroundColor="matchBlurBackground" padding="m">
      <Image
        source={{
          uri: props.route.params.recipe
            ? "https://protein-count-recipe-thumbnails.s3.us-west-1.amazonaws.com/a3d4e7c9-4f85-4d8e-bfde-1e3f6d8b0986.jpg"
            : "",
        }}
        style={styles.image}
        contentFit={"cover"}
        transition={100}
      />
      <Markdown>{props.route.params.recipe?.instructions}</Markdown>
    </Box>
  );
};

export default DetailScreen;
