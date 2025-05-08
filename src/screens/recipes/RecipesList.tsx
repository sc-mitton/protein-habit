import React, { useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  Platform,
  RefreshControl,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { MasonryFlashList } from "@shopify/flash-list";

import { RecipesScreenProps } from "@types";
import { useAppDispatch } from "@store/hooks";
import { showBottomBar } from "@store/slices/uiSlice";
import Filters from "./Filters";
import { useRecipesScreenContext } from "./Context";
import TitleVariant from "./TitleVariant";
import RecipeCard from "./RecipeCard";
import { seeRecipe, useDrizzleDb, useRecipes } from "@db";
import { Recipe } from "@db/schema/types";
import { LinearGradient } from "expo-linear-gradient";

type Props = RecipesScreenProps<"RecipesList">;

const ListHeaderComponent = () => {
  const { searchQuery } = useRecipesScreenContext();
  return !searchQuery ? <Filters /> : null;
};

const ExploreScreen: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const lastOffsetY = useRef(0);
  const isScrolling = useRef(false);
  const filtersHeight = useRef(0);
  const { selectedFilters, searchQuery } = useRecipesScreenContext();
  const [showFiltersHeader, setShowFiltersHeader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { recipes, fetchMore, refetch } = useRecipes({
    filters: { searchQuery, tags: selectedFilters },
    pageSize: 20,
  });
  const db = useDrizzleDb();
  // Track timeouts for each recipe
  const viewTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    return () => {
      dispatch(showBottomBar(true));
      // Clear all timeouts when component unmounts
      Object.values(viewTimeouts.current).forEach((timeout) =>
        clearTimeout(timeout),
      );
    };
  }, []);

  useEffect(() => {
    setShowFiltersHeader(true);
  }, []);

  useEffect(() => {
    if (showFiltersHeader) {
      props.navigation.setOptions({
        headerTitle: () => <TitleVariant />,
      });
    } else {
      props.navigation.setOptions({
        headerTitle: "Recipes",
      });
    }
  }, [showFiltersHeader]);

  const handleScrollBeginDrag = () => {
    isScrolling.current = true;
  };

  const handleScrollEndDrag = () => {
    isScrolling.current = false;
  };

  const handleSeen = async (recipes: Recipe[]) => {
    // Mark recipes as seen when they've been in view for more than 1 second
    if (recipes.length === 0) return;

    try {
      await seeRecipe(db, recipes);
    } catch (err) {
      console.error("Error updating lastSeen:", err);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const diff = currentOffsetY - lastOffsetY.current;

    setShowFiltersHeader(
      Platform.OS === "ios"
        ? currentOffsetY >= -120 && Object.keys(selectedFilters).length > 0
        : currentOffsetY > filtersHeight.current &&
            Object.keys(selectedFilters).length > 0,
    );

    if (isScrolling.current) {
      const direction = diff > 0 ? "down" : "up";
      if (direction === "down") {
        dispatch(showBottomBar(false));
      } else {
        dispatch(showBottomBar(true));
      }
    }
    lastOffsetY.current = currentOffsetY;
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }
  }, [refetch]);

  return (
    <MasonryFlashList
      contentContainerStyle={{
        backgroundColor: theme.colors.matchBlurBackground,
        paddingHorizontal: 8,
        paddingTop: 16,
      }}
      contentInsetAdjustmentBehavior="automatic"
      data={recipes}
      renderItem={({ item, index }) => (
        <RecipeCard recipe={item === null ? undefined : item} index={index} />
      )}
      onViewableItemsChanged={({ changed, viewableItems }) => {
        // Get items that are no longer visible (isViewable is false)
        const itemsNoLongerVisible = changed
          .filter((item) => !item.isViewable)
          .map((item) => item.item)
          .filter((item): item is Recipe => item !== null);

        if (itemsNoLongerVisible.length > 0) {
          handleSeen(itemsNoLongerVisible);
        }
      }}
      viewabilityConfig={{
        minimumViewTime: 2000,
      }}
      onEndReached={() => {
        fetchMore();
      }}
      ListHeaderComponent={ListHeaderComponent}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      onScroll={handleScroll}
      onEndReachedThreshold={0.5}
      numColumns={2}
      estimatedItemSize={200}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.secondaryText]}
          tintColor={theme.colors.primary}
          progressViewOffset={Platform.OS === "ios" ? 0 : 20}
          progressBackgroundColor={theme.colors.matchBlurBackground}
        />
      }
    />
  );
};

const BottomGradient = () => {
  const theme = useTheme();
  return (
    <LinearGradient
      colors={[theme.colors.transparentRGB, theme.colors.matchBlurBackground]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    />
  );
};

export default function (props: Props) {
  return Platform.OS === "ios" ? (
    <View style={styles.containerIOS}>
      <ExploreScreen {...props} />
      <BottomGradient />
    </View>
  ) : (
    <View style={styles.containerAndroid}>
      <ExploreScreen {...props} />
      <BottomGradient />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
  },
  recipeBox: {
    flex: 1,
    margin: 8,
  },
  containerAndroid: {
    paddingTop: 80,
    flex: 1,
  },
  containerIOS: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
  },
});
