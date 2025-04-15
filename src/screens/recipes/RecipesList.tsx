import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { MasonryFlashList } from "@shopify/flash-list";
import { inArray } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

import { RecipesScreenProps } from "@types";
import { useAppDispatch } from "@store/hooks";
import { useRecipes } from "@hooks";
import { showBottomBar } from "@store/slices/uiSlice";
import Filters from "./Filters";
import { ProgressiveBlur } from "@components";
import { useRecipesScreenContext } from "./Context";
import TitleVariant from "./TitleVariant";
import RecipeCard from "./RecipeCard";
import { recipesTable } from "@db/schema/schema";
import { useDrizzleDb } from "@db";

type Props = RecipesScreenProps<"List">;

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
  const { recipes, fetchMore } = useRecipes({
    filters: { searchQuery, tags: selectedFilters },
    pageSize: 20,
  });
  const { db } = useDrizzleDb();

  useEffect(() => {
    return () => {
      dispatch(showBottomBar(true));
    };
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

  const handleUpdateLastSeen = async (recipeIds: string[]) => {
    // Mark recipes as seen when they leave the view
    if (recipeIds.length === 0) return;

    try {
      const query = db
        .update(recipesTable)
        .set({ lastSeen: dayjs().toISOString() })
        .where(inArray(recipesTable.id, recipeIds));
      await query;
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

  return (
    <MasonryFlashList
      contentContainerStyle={{
        backgroundColor: theme.colors.matchBlurBackground,
        paddingHorizontal: 8,
        paddingTop: 16,
      }}
      contentInsetAdjustmentBehavior="automatic"
      data={recipes.length > 0 ? recipes : Array(10).fill(null)}
      renderItem={({ item, index }) => (
        <RecipeCard recipe={item === null ? undefined : item} index={index} />
      )}
      onViewableItemsChanged={({ changed }) => {
        handleUpdateLastSeen(
          changed
            .filter((c) => c.item !== null)
            .filter((c) => !c.isViewable)
            .map((c) => c.item.id),
        );
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
    />
  );
};

export default function (props: Props) {
  return Platform.OS === "ios" ? (
    <ProgressiveBlur style={styles.containerIOS} start={0.9}>
      <ExploreScreen {...props} />
    </ProgressiveBlur>
  ) : (
    <View style={styles.containerAndroid}>
      <ExploreScreen {...props} />
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
});
