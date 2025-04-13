import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import _ from "lodash";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@shopify/restyle";

import { Box, Text } from "@components";
import { RootScreenProps } from "@types";
import { useSelectRecipe } from "@hooks";
import { capitalize } from "@utils";
import { Theme } from "@theme";
import HeaderRight from "./HeaderRight";
import CustomHeader, { IMAGE_HEIGHT } from "./CategoryPicture";
import ListItem from "./ListItem";

type Props = RootScreenProps<"BookmarkCategory">;

const BookmarkCategory = (props: Props) => {
  const { category } = props.route.params;
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

  const Listheader = () => {
    return (
      <Box style={styles.listHeader}>
        <Text variant="largeHeader">{capitalize(category.name)}</Text>
      </Box>
    );
  };

  return (
    <View>
      {/* Recipe list */}
      <FlatList
        data={filteredRecipes
          .concat(filteredRecipes)
          .concat(filteredRecipes)
          .concat(filteredRecipes)}
        style={[styles.flatList]}
        ListHeaderComponent={<Listheader />}
        contentContainerStyle={styles.listContainer}
        scrollIndicatorInsets={{ top: (IMAGE_HEIGHT * 0.6) / 2 }}
        renderItem={({ item, index }) => <ListItem item={item} index={index} />}
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
  listHeader: {
    position: "absolute",
    top: -54,
    left: 16,
    right: 0,
    zIndex: 120,
  },
  listContainer: {
    paddingTop: IMAGE_HEIGHT * 0.6,
    paddingBottom: 32,
  },
  flatList: {
    zIndex: 1,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    zIndex: 12,
  },
});

export default BookmarkCategory;
