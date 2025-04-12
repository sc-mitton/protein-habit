import React, { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Box, Text } from "@components";
import { RootScreenProps } from "@types";
import { RootState } from "@store";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@types";
import { BookmarkCategory } from "@store/slices/bookmarksSlice";
import RecipeCard from "../recipes/RecipeCard";
import { RecipeWithAssociations } from "@db/schema/types";
import { useSelectRecipe } from "@hooks";

type Props = RootScreenProps<"BookmarkedRecipes">;

const BookmarkedScreen = (props: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const categories = useSelector(
    (state: RootState) => state.bookmarks.categories,
  );

  // Create a map of recipe IDs to recipe objects for quick lookup
  const recipeMap = useMemo(() => {
    const map: Record<string, RecipeWithAssociations | null> = {};

    // For each category, get the recipe objects
    categories.forEach((category) => {
      category.recipeIds.forEach((id) => {
        if (!map[id]) {
          // Use the hook to get the recipe
          const recipe = useSelectRecipe(id);
          map[id] = recipe.recipe || null;
        }
      });
    });

    return map;
  }, [categories]);

  const renderCategory = ({ item: category }: { item: BookmarkCategory }) => {
    // Get the recipe objects for the IDs in this category
    const categoryRecipes = category.recipeIds
      .map((id) => recipeMap[id])
      .filter((recipe): recipe is RecipeWithAssociations => recipe !== null);

    // Only show the first 3 recipes for each category
    const previewRecipes = categoryRecipes.slice(0, 3);

    return (
      <Box marginBottom="xl">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="m"
          paddingHorizontal="l"
        >
          <Text variant="header">{category.name}</Text>
          <TouchableOpacity
            onPress={() => {
              // Navigate to a full category view (to be implemented)
              // navigation.navigate("CategoryDetail", { categoryId: category.id });
            }}
          >
            <Text variant="caption" color="primaryButton">
              View All ({category.recipeIds.length})
            </Text>
          </TouchableOpacity>
        </Box>

        <FlatList
          data={previewRecipes}
          renderItem={({ item: recipe, index }) => (
            <RecipeCard recipe={recipe} index={index} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.recipeGrid}
        />
      </Box>
    );
  };

  return (
    <Box flex={1} backgroundColor="matchBlurBackground" padding="m">
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <Box
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="xl"
          >
            <Text variant="body" color="secondaryText" textAlign="center">
              You haven't bookmarked any recipes yet.
            </Text>
          </Box>
        }
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  recipeGrid: {
    paddingHorizontal: 8,
  },
});

export default BookmarkedScreen;
