import React, { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@shopify/restyle";
import { useHeaderHeight } from "@react-navigation/elements";
import { SymbolView } from "expo-symbols";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useKeepAwake } from "expo-keep-awake";

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
import HeaderRight from "./HeaderRight";
import CoverImage, { IMAGE_HEIGHT } from "./CoverImage";

const styles = StyleSheet.create({
  scrollView: {
    zIndex: 2,
    marginTop: -24,
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
    zIndex: 12,
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

const DetailScreen = (props: RootScreenProps<"RecipeDetail">) => {
  useKeepAwake();

  const [currentSection, setCurrentSection] = useState<string>("");

  const theme = useTheme<Theme>();
  const recipeData = useSelectRecipe(props.route.params.recipe);
  const sectionRefs = useRef<{ [key: string]: number }>({});
  const headerHeight = useHeaderHeight();
  const scrollY = useSharedValue(0);
  const scheme = useColorScheme();
  const scale = useSharedValue(1);
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <HeaderRight {...props} />,
    });
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    scrollY.value = currentScrollY;
    scale.value = interpolate(
      currentScrollY,
      [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
      [1.2, 1.1, 1],
    );

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

  const scrollContentAnimation = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(
      scrollY.value,
      [-24, 0, IMAGE_HEIGHT],
      [0, 0.2, 0.1],
    );
    return {
      shadowOpacity: shadowOpacity,
      shadowColor:
        scheme == "dark" ? theme.colors.defaultShadow : theme.colors.black,
      shadowOffset: { width: 0, height: -48 },
      shadowRadius: 24,
      elevation: 24,
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
      paddingTop="xxl"
      paddingHorizontal="l"
      backgroundColor="matchBlurBackground"
      onLayout={onLayout(title.toLowerCase())}
    >
      <Box
        borderBottomWidth={1}
        borderBottomColor="borderColor"
        paddingBottom="m"
      >
        <Text variant="header">{title}</Text>
      </Box>
    </Box>
  );

  return (
    <Box
      flex={1}
      borderTopLeftRadius="xl"
      borderTopRightRadius="xl"
      backgroundColor="matchBlurBackground"
      overflow="hidden"
    >
      <CoverImage uri={recipeData.recipe?.thumbnail} scale={scale} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight + IMAGE_HEIGHT / 1.5 },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: IMAGE_HEIGHT }}
      >
        <Animated.View style={scrollContentAnimation}>
          <Box
            paddingHorizontal="l"
            paddingVertical="l"
            backgroundColor="matchBlurBackground"
            borderTopLeftRadius="xxl"
            borderTopRightRadius="xxl"
            borderBottomWidth={1}
            borderBottomColor="borderColor"
            gap="s"
            alignItems="center"
          >
            <Text variant="largeHeader" textAlign="center">
              {capitalize(recipeData.recipe?.title ?? "")}
            </Text>
            <Box flexDirection="row" gap="s">
              <Text variant="paragraph" color="secondaryText">
                {recipeData.recipe?.meta.proteinPerServing}g protein
              </Text>
              {recipeData.recipe?.meta.caloriesPerServing && (
                <Text variant="paragraph" color="secondaryText">
                  &bull;&nbsp;{recipeData.recipe?.meta.caloriesPerServing} kcal
                </Text>
              )}
            </Box>
          </Box>
          <Box backgroundColor="matchBlurBackground" paddingTop="xs">
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
            backgroundColor="matchBlurBackground"
            gap="m"
          >
            <Box flexDirection="row" alignItems="center">
              <SymbolView
                name="clock.circle"
                tintColor={theme.colors.primaryText}
                size={24}
                fallback={
                  <Ionicons
                    name="timer-outline"
                    size={24}
                    color={theme.colors.primaryText}
                  />
                }
              />
              {recipeData.recipe?.meta.prepTime && (
                <Text variant="paragraph" marginLeft="sm">
                  {recipeData.recipe?.meta.prepTime} min prep
                </Text>
              )}
              {recipeData.recipe?.meta.prepTime &&
                recipeData.recipe?.meta.cookTime && (
                  <Text fontSize={12} marginHorizontal="s">
                    &bull;
                  </Text>
                )}
              {recipeData.recipe?.meta.prepTime && (
                <Text variant="paragraph">
                  {recipeData.recipe?.meta.cookTime} min cook
                </Text>
              )}
            </Box>
            <Box flexDirection="row" alignItems="center">
              <SymbolView
                name="fork.knife.circle"
                tintColor={theme.colors.primaryText}
                size={24}
                fallback={
                  <Feather
                    name="pie-chart"
                    size={24}
                    color={theme.colors.primaryText}
                  />
                }
              />
              <Text marginLeft="sm">
                {recipeData.recipe?.meta.numberOfServings}{" "}
                {recipeData.recipe?.meta.numberOfServings &&
                recipeData.recipe?.meta.numberOfServings > 1
                  ? "servings"
                  : "serving"}
              </Text>
            </Box>
          </Box>
          {renderSectionHeader("Ingredients")}
          <Box paddingHorizontal="l" backgroundColor="matchBlurBackground">
            <Markdown>
              {recipeData.recipe?.ingredients.replace(/\\n/g, "\n")}
            </Markdown>
          </Box>
          {renderSectionHeader("Instructions")}
          <Box paddingHorizontal="l" backgroundColor="matchBlurBackground">
            <Markdown>
              {recipeData.recipe?.instructions.replace(/\\n/g, "\n")}
            </Markdown>
          </Box>
        </Animated.View>
      </ScrollView>
      <LinearGradient
        colors={[theme.colors.transparentRGB, theme.colors.matchBlurBackground]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.8 }}
        style={styles.gradient}
      />
    </Box>
  );
};

export default DetailScreen;
