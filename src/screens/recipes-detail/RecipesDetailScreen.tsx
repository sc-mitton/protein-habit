import React, { useRef, useState } from "react";
import { Image } from "expo-image";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
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

const IMAGE_HEIGHT = Dimensions.get("window").height * 0.25;

const AnimatedImage = Animated.createAnimatedComponent(Image);

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: IMAGE_HEIGHT,
    borderRadius: 0,
    zIndex: -1,
    position: "absolute",
    top: 0,
  },
  blurredImage: {
    width: "100%",
    height: IMAGE_HEIGHT,
    borderRadius: 0,
    position: "absolute",
    top: 0,
    zIndex: -1,
  },
  scrollView: {
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 64,
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

const TAG_TYPES = ["proteins", "cuisines", "mealTypes", "dishTypes"] as const;

const DetailScreen: React.FC<Props> = (props) => {
  const theme = useTheme<Theme>();
  const recipeData = useSelectRecipe(props.route.params.recipe?.id);
  const [currentSection, setCurrentSection] = useState<string>("");
  const sectionRefs = useRef<{ [key: string]: number }>({});
  const headerHeight = useHeaderHeight();
  const scrollY = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    scrollY.value = currentScrollY;

    if (currentScrollY < 100) {
      if (currentSection !== "") {
        setCurrentSection("");
        props.navigation.setOptions({ title: "" });
      }
      return;
    }

    const sections = Object.entries(sectionRefs.current);
    for (let i = sections.length - 1; i >= 0; i--) {
      const [section, position] = sections[i];
      if (currentScrollY >= position - 100) {
        if (currentSection !== section) {
          setCurrentSection(section);
          props.navigation.setOptions({ title: capitalize(section) });
        }
        break;
      }
    }
  };

  const imageAnimation = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-100, 0, 1000000], [1.05, 1, 1]);
    return {
      transform: [{ scale }, { translateY: headerHeight }],
    };
  });

  const onLayout = (section: string) => (event: any) => {
    sectionRefs.current[section] = event.nativeEvent.layout.y;
  };

  const renderTag = (type: string, item: { name: string }) => (
    <Box
      key={`${type}-${item.name}`}
      variant="smallPill"
      backgroundColor="primaryButton"
    >
      <Image source={tagImages[item.name]} style={styles.tagImage} />
      <Text variant="body">{capitalize(item.name)}</Text>
    </Box>
  );

  const renderSectionHeader = (title: string) => (
    <Box
      borderBottomWidth={1.5}
      borderBottomColor="borderColor"
      paddingBottom="m"
      paddingTop="xxl"
      paddingHorizontal="l"
      backgroundColor="matchBlurBackground"
      onLayout={onLayout(title.toLowerCase())}
    >
      <Text variant="header">{title}</Text>
    </Box>
  );

  const renderMetaInfo = (icon: string, text: string) => (
    <Text variant="body" style={styles.metaText}>
      {icon} {text}
    </Text>
  );

  return (
    <Box flex={1} backgroundColor="matchBlurBackground">
      <AnimatedImage
        source={{
          uri: props.route.params.recipe
            ? "https://protein-count-recipe-thumbnails.s3.us-west-1.amazonaws.com/a3d4e7c9-4f85-4d8e-bfde-1e3f6d8b0986.jpg"
            : "",
        }}
        style={[styles.blurredImage]}
        contentFit="cover"
        transition={100}
      />
      <AnimatedImage
        // sharedTransitionTag={`image${props.route.params.recipe?.id}`}
        source={{
          uri: props.route.params.recipe
            ? "https://protein-count-recipe-thumbnails.s3.us-west-1.amazonaws.com/a3d4e7c9-4f85-4d8e-bfde-1e3f6d8b0986.jpg"
            : "",
        }}
        style={[styles.image, imageAnimation]}
        contentFit="cover"
        transition={100}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight + IMAGE_HEIGHT },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: IMAGE_HEIGHT }}
      >
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
        <Box backgroundColor="matchBlurBackground" paddingTop="s">
          <LinearGradientEdges height={60} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.tags}
            showsHorizontalScrollIndicator={false}
          >
            {TAG_TYPES.map((type) =>
              recipeData.recipe?.[type]?.map((item) => renderTag(type, item)),
            )}
          </ScrollView>
        </Box>
        <Box
          paddingHorizontal="l"
          paddingTop="xl"
          paddingBottom="m"
          backgroundColor="matchBlurBackground"
        >
          <Box flexDirection="row" gap="s" width="100%">
            <Box flex={0.75} gap="s">
              {renderMetaInfo(
                "🍽️",
                `${recipeData.recipe?.meta.numberOfServings} servings`,
              )}
              {renderMetaInfo(
                "⏱️",
                `${recipeData.recipe?.meta.prepTime} prep time`,
              )}
            </Box>
            <Box flex={1} gap="s">
              {renderMetaInfo(
                "🥩",
                `${recipeData.recipe?.meta.proteinPerServing}g protein / serving`,
              )}
              {renderMetaInfo(
                "⏱️",
                `${recipeData.recipe?.meta.cookTime} cooking time`,
              )}
            </Box>
          </Box>
        </Box>
        {renderSectionHeader("Ingredients")}
        <Box paddingHorizontal="l" backgroundColor="matchBlurBackground">
          <Markdown>
            {props.route.params.recipe?.ingredients.replace(/\\n/g, "\n")}
          </Markdown>
        </Box>
        {renderSectionHeader("Instructions")}
        <Box paddingHorizontal="l" backgroundColor="matchBlurBackground">
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
