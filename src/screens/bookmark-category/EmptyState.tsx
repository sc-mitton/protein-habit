import React from "react";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { tagImages } from "@components";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Grayscale } from "react-native-color-matrix-image-filters";

import { Box, Text, Button } from "@components";

import { RootStackParamList } from "@types";
import { IMAGE_HEIGHT } from "./Cover";

const styles = StyleSheet.create({
  emptyContainer: {
    marginTop: IMAGE_HEIGHT * 0.5,
  },
  tagImage: {
    width: 48,
    height: 48,
  },
  imagesContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  image1: {
    transform: [{ translateX: -25 }, { translateY: -35 }, { scale: 0.8 }],
  },
  image2: {
    transform: [{ translateX: 33 }, { translateY: -40 }, { scale: 0.9 }],
  },
  image3: {
    transform: [{ translateX: 0 }, { translateY: 10 }, { scale: 0.66 }],
  },
  messageButton: {
    transform: [{ translateY: 100 }],
  },
});

const boxVariant = {
  backgroundColor: "secondaryBackground",
  padding: "xs",
  borderRadius: "full",
  borderWidth: 1,
  borderColor: "primaryButton",
  alignItems: "center",
  justifyContent: "center",
} as const;

const EmptyState = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      style={styles.emptyContainer}
    >
      <Box {...boxVariant} position="absolute" style={styles.image1}>
        <Grayscale>
          <Image source={tagImages["chicken"]} style={styles.tagImage} />
        </Grayscale>
      </Box>
      <Box {...boxVariant} position="absolute" style={styles.image2}>
        <Grayscale>
          <Image source={tagImages["steak"]} style={styles.tagImage} />
        </Grayscale>
      </Box>
      <Box {...boxVariant} position="absolute" style={styles.image3}>
        <Grayscale>
          <Image source={tagImages["shrimp"]} style={styles.tagImage} />
        </Grayscale>
      </Box>
      <Box
        style={styles.messageButton}
        width="66%"
        alignItems="center"
        gap="xs"
      >
        <Text
          variant="body"
          color="quaternaryText"
          textAlign="center"
          fontSize={15}
        >
          You haven't saved any recipes yet to this category.
        </Text>
        <Button
          onPress={() =>
            navigation.navigate("BottomTabs", {
              screen: "Recipes",
              params: { screen: "List" },
            })
          }
          paddingHorizontal="m"
          alignItems="center"
          gap="s"
        >
          <Text
            accent
            variant="body"
            color="tertiaryText"
            fontSize={15}
            textAlign="center"
          >
            Add Recipes
          </Text>
        </Button>
      </Box>
    </Box>
  );
};

export default EmptyState;
