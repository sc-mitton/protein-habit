import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  useColorScheme,
} from "react-native";
import _ from "lodash";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@shopify/restyle";
import { BlurView } from "expo-blur";

import { Box, Text } from "@components";
import { RootScreenProps } from "@types";
import { useSelectRecipe } from "@db";
import { capitalize } from "@utils";
import { Theme } from "@theme";
import ImagePickerMenu from "./ImagePickerMenu";
import CategoryPicture, { IMAGE_HEIGHT } from "./Cover";
import ListItem from "./ListItem";
import SortMenu from "./SortMenu";
import EmptyState from "./EmptyState";

type Props = RootScreenProps<"BookmarkCategory">;

const AnimatedBox = Animated.createAnimatedComponent(Box);

const BookmarkCategory = (props: Props) => {
  const { category } = props.route.params;
  const [sortOption, setSortOption] = useState<
    "alphabetical" | "reverse" | "default"
  >("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const theme = useTheme<Theme>();
  const scheme = useColorScheme();
  const scrollY = useRef(new Animated.Value(0)).current;

  const { recipes } = useSelectRecipe(category.recipeIds);

  const sortedRecipes = React.useMemo(() => {
    if (sortOption === "default") return recipes;

    return [...recipes].sort((a, b) => {
      if (sortOption === "alphabetical") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  }, [recipes, sortOption]);

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      setShowSortMenu(value > IMAGE_HEIGHT / 2);
    });

    return () => {
      scrollY.removeListener(listener);
    };
  }, [scrollY]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Box flexDirection="row" alignItems="center">
          {showSortMenu ? (
            <SortMenu onSortChange={setSortOption} currentSort={sortOption} />
          ) : (
            <ImagePickerMenu categoryId={category.id} />
          )}
        </Box>
      ),
    });
  }, [props.navigation, category.id, recipes.length, showSortMenu, sortOption]);

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.08, 1],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT / 2],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const Listheader = () => {
    return (
      <Animated.View
        style={[
          styles.listHeader,
          {
            transform: [{ scale: headerScale }],
          },
        ]}
      >
        <Text variant="largeHeader">{capitalize(category.name)}</Text>
      </Animated.View>
    );
  };

  return (
    <View>
      {/* Recipe list */}
      <Animated.FlatList
        data={sortedRecipes}
        style={[styles.flatList]}
        ListHeaderComponent={<Listheader />}
        contentContainerStyle={styles.listContainer}
        scrollIndicatorInsets={{ top: (IMAGE_HEIGHT * 0.6) / 2 }}
        renderItem={({ item, index }) => <ListItem item={item} index={index} />}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        ListEmptyComponent={<EmptyState />}
      />
      <CategoryPicture scale={headerScale} categoryId={category.id} />
      <AnimatedBox
        style={[styles.headerBlur, { opacity: headerOpacity }]}
        borderBottomColor="borderColor"
        borderBottomWidth={1.5}
      >
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={100}
            tint={scheme === "dark" ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: theme.colors.matchBlurBackground },
            ]}
          />
        )}
      </AnimatedBox>
      <LinearGradient
        colors={[theme.colors.transparentRGB, theme.colors.mainBackground]}
        style={styles.bottomGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <AnimatedBox
        style={[
          styles.backCover,
          { transform: [{ translateY: Animated.multiply(scrollY, -1) }] },
        ]}
        backgroundColor="mainBackground"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backCover: {
    ...StyleSheet.absoluteFillObject,
    top: IMAGE_HEIGHT * 0.6,
    borderRadius: 24,
  },

  listHeader: {
    position: "absolute",
    top: -54,
    left: 16,
    right: 0,
    zIndex: 120,
    transformOrigin: "top left",
  },
  listContainer: {
    paddingTop: IMAGE_HEIGHT * 0.6,
    paddingBottom: 32,
  },
  flatList: {
    zIndex: 1,
    height: "100%",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    zIndex: 12,
  },
  headerBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 100 : 80,
    zIndex: 110,
  },
  searchBar: {
    position: "relative",
    width: "100%",
    zIndex: 130,
    backgroundColor: "transparent",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});

export default BookmarkCategory;
