import React, { useRef, useState } from "react";
import { Image } from "expo-image";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@shopify/restyle";
import { useHeaderHeight } from "@react-navigation/elements";

import { RootScreenProps } from "@types";
import {
  Box,
  Markdown,
  Text,
  tagImages,
  LinearGradientEdges,
} from "@components";
import { Theme } from "@theme";
import { capitalize } from "@utils";
import { useSelectRecipe } from "@hooks";

type Props = RootScreenProps<"RecipeDetail">;

const AnimatedImage = Animated.createAnimatedComponent(Image);

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: Dimensions.get("window").height * 0.2,
    borderRadius: 0,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    zIndex: 1,
  },
  tagImage: {
    width: 32,
    height: 32,
  },
  metaText: {
    width: "50%",
  },
  tags: {
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionHeader: {
    paddingTop: 16,
  },
});

const DetailScreen: React.FC<Props> = (props) => {
  const theme = useTheme<Theme>();
  const recipeData = useSelectRecipe(props.route.params.recipe?.id);
  const [currentSection, setCurrentSection] = useState<string>("");
  const sectionRefs = useRef<{ [key: string]: number }>({});
  const headerHeight = useHeaderHeight();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    // If we're near the top, clear the title to show the recipe title
    if (scrollY < 100) {
      if (currentSection !== "") {
        setCurrentSection("");
        props.navigation.setOptions({
          title: "",
        });
      }
      return;
    }

    // Find the current section based on scroll position
    const sections = Object.entries(sectionRefs.current);
    for (let i = sections.length - 1; i >= 0; i--) {
      const [section, position] = sections[i];
      if (scrollY >= position - 100) {
        // Offset to trigger slightly before reaching the section
        if (currentSection !== section) {
          setCurrentSection(section);
          props.navigation.setOptions({
            title: capitalize(section),
          });
        }
        break;
      }
    }
  };

  const onLayout = (section: string) => (event: any) => {
    const { y } = event.nativeEvent.layout;
    sectionRefs.current[section] = y;
  };

  return (
    <Box flex={1} backgroundColor="matchBlurBackground">
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <AnimatedImage
          // sharedTransitionTag={`image${props.route.params.recipe?.id}`}
          source={{
            uri: props.route.params.recipe
              ? "https://protein-count-recipe-thumbnails.s3.us-west-1.amazonaws.com/a3d4e7c9-4f85-4d8e-bfde-1e3f6d8b0986.jpg"
              : "",
          }}
          style={styles.image}
          contentFit={"cover"}
          transition={100}
        />
        <Box
          paddingHorizontal="l"
          paddingTop="l"
          paddingBottom="m"
          backgroundColor="matchBlurBackground"
          borderBottomWidth={1.5}
          borderBottomColor="borderColor"
        >
          <Text variant="largeHeader">
            {capitalize(props.route.params.recipe?.title)}
          </Text>
        </Box>
        <Box>
          <LinearGradientEdges height={60} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.tags}
            showsHorizontalScrollIndicator={false}
          >
            {recipeData.recipe?.proteins?.map((protein) => (
              <Box
                key={`protein-${protein.name}`}
                variant="smallPill"
                backgroundColor="primaryButton"
              >
                <Image
                  source={tagImages[protein.name]}
                  style={styles.tagImage}
                />
                <Text variant="body">{capitalize(protein.name)}</Text>
              </Box>
            ))}
            {recipeData.recipe?.cuisines?.map((cuisine) => (
              <Box
                key={`cuisine-${cuisine.name}`}
                variant="smallPill"
                backgroundColor="primaryButton"
              >
                <Image
                  source={tagImages[cuisine.name]}
                  style={styles.tagImage}
                />
                <Text variant="body">{capitalize(cuisine.name)}</Text>
              </Box>
            ))}
            {recipeData.recipe?.mealTypes?.map((mealType) => (
              <Box
                key={`mealType-${mealType.name}`}
                variant="smallPill"
                backgroundColor="primaryButton"
              >
                <Image
                  source={tagImages[mealType.name]}
                  style={styles.tagImage}
                />
                <Text variant="body">{capitalize(mealType.name)}</Text>
              </Box>
            ))}
            {recipeData.recipe?.dishTypes?.map((dishType) => (
              <Box
                key={`dishType-${dishType.name}`}
                variant="smallPill"
                backgroundColor="primaryButton"
              >
                <Image
                  source={tagImages[dishType.name]}
                  style={styles.tagImage}
                />
                <Text variant="body">{capitalize(dishType.name)}</Text>
              </Box>
            ))}
          </ScrollView>
        </Box>
        <Box paddingHorizontal="l" paddingTop="xl" paddingBottom="xl">
          <Box flexDirection="row" gap="s" width="100%">
            <Box flex={0.75} gap="s">
              <Text variant="body" style={styles.metaText}>
                🍽️ {recipeData.recipe?.meta.numberOfServings} servings
              </Text>
              <Text variant="body" style={styles.metaText}>
                ⏱️ {recipeData.recipe?.meta.prepTime} prep time
              </Text>
            </Box>
            <Box flex={1} gap="s">
              <Text variant="body" style={styles.metaText}>
                🥩 {recipeData.recipe?.meta.proteinPerServing}g protein /
                serving
              </Text>
              <Text variant="body" style={styles.metaText}>
                ⏱️ {recipeData.recipe?.meta.cookTime} cooking time
              </Text>
            </Box>
          </Box>
        </Box>
        <Box
          borderBottomWidth={1.5}
          borderBottomColor="borderColor"
          paddingBottom="m"
          paddingTop="l"
          paddingHorizontal="l"
          backgroundColor="matchBlurBackground"
          onLayout={onLayout("ingredients")}
        >
          <Text variant="header">Ingredients</Text>
        </Box>
        <Box paddingHorizontal="l">
          <Markdown>
            {props.route.params.recipe?.ingredients.replace(/\\n/g, "\n")}
          </Markdown>
        </Box>
        <Box
          borderBottomWidth={1.5}
          borderBottomColor="borderColor"
          paddingBottom="m"
          paddingTop="l"
          paddingHorizontal="l"
          backgroundColor="matchBlurBackground"
          onLayout={onLayout("instructions")}
        >
          <Text variant="header">Instructions</Text>
        </Box>
        <Box paddingHorizontal="l">
          <Markdown>
            {props.route.params.recipe?.instructions.replace(/\\n/g, "\n")}
          </Markdown>
        </Box>
      </ScrollView>
      <LinearGradient
        colors={[theme.colors.transparentRGB, theme.colors.secondaryBackground]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.8 }}
        style={styles.gradient}
      />
    </Box>
  );
};

export default DetailScreen;
