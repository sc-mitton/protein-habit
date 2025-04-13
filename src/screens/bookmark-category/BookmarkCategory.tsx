import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import _ from "lodash";
import { LinearGradient } from "expo-linear-gradient";
import { useHeaderHeight } from "@react-navigation/elements";
import { backgroundColor, useTheme } from "@shopify/restyle";
import { BlurView } from "expo-blur";

import { Box, Button, Text, RecipeThumbnail } from "@components";
import { RootScreenProps } from "@types";
import { useSelectRecipe } from "@hooks";
import { capitalize } from "@utils";
import { Theme } from "@theme";
import HeaderRight from "./HeaderRight";
import CustomHeader from "./CustomHeader";

type Props = RootScreenProps<"BookmarkCategory">;

const IMAGE_SIZE = 60;

const BookmarkCategory = (props: Props) => {
  const { category } = props.route.params;
  const [headerHeight, setHeaderHeight] = useState(useHeaderHeight() + 84);
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme<Theme>();

  const { recipes } = useSelectRecipe(category.recipeIds);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <HeaderRight categoryId={category.id} />,
    });
  }, [props.navigation, category.id, recipes.length]);

  const handleRecipePress = (recipeId: string) => {
    props.navigation.navigate("RecipeDetail", { recipe: recipeId });
  };

  return (
    <View>
      {/* Recipe list */}
      <FlatList
        data={filteredRecipes
          .concat(filteredRecipes)
          .concat(filteredRecipes)
          .concat(filteredRecipes)}
        style={[{ paddingTop: headerHeight }, styles.flatList]}
        contentContainerStyle={[
          styles.listContainer,
          { backgroundColor: theme.colors.mainBackground },
        ]}
        renderItem={({ item, index }) => (
          <Button
            onPress={() => handleRecipePress(item.id)}
            margin="none"
            padding="none"
            flexDirection="row"
            paddingVertical="sm"
            borderRadius="l"
          >
            <Box
              backgroundColor="borderColor"
              height={1.5}
              position="absolute"
              left={IMAGE_SIZE + 24}
              right={0}
              bottom={0}
              opacity={0.5}
            />
            <Box
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              borderRadius="m"
              overflow="hidden"
            >
              <RecipeThumbnail
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                contentFit="cover"
              />
            </Box>
            <Box flex={1} marginLeft="m" justifyContent="center">
              <Text fontSize={15}>
                {_.truncate(capitalize(item.title), { length: 34 })}
              </Text>
              <Box flexDirection="row" marginTop="xs">
                <Text variant="caption" color="secondaryText">
                  {item.meta.proteinPerServing}g protein
                </Text>
                {item.meta.caloriesPerServing && (
                  <Text variant="caption" color="secondaryText" marginLeft="s">
                    • {item.meta.caloriesPerServing} kcal
                  </Text>
                )}
              </Box>
            </Box>
          </Button>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Box padding="xl" alignItems="center">
            <Text variant="body" color="secondaryText">
              {searchQuery
                ? "No recipes match your search"
                : "No recipes in this category yet"}
            </Text>
          </Box>
        }
      />
      <CustomHeader />
      <LinearGradient
        colors={[theme.colors.transparentRGB, theme.colors.matchBlurBackground]}
        style={styles.bottomGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  flatList: {
    zIndex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 12,
  },
});

export default BookmarkCategory;
