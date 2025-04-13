import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { Box, Text, Button, BackDrop } from "@components";
import { Theme } from "@theme";
import { useTheme } from "@shopify/restyle";
import { RootState } from "@store";
import { addRecipeToCategory } from "@store/slices/bookmarksSlice";
import { RootScreenProps } from "@types";

const BookmarkModal = (props: RootScreenProps<"BookmarkModal">) => {
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.bookmarks.categories,
  );

  const handleAddToCategory = (categoryId: string) => {
    dispatch(
      addRecipeToCategory({
        categoryId,
        recipeId: props.route.params.recipe,
      }),
    );
    props.navigation.goBack();
  };

  return (
    <BottomSheet
      onClose={() => props.navigation.goBack()}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.colors.modalBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.tertiaryText,
      }}
      backdropComponent={() => <BackDrop blurIntensity={20} />}
    >
      <BottomSheetView>
        <Box
          backgroundColor="modalBackground"
          borderRadius="l"
          padding="l"
          paddingBottom="xxxl"
        >
          <Box
            borderBottomColor="borderColor"
            borderBottomWidth={1.5}
            paddingBottom="s"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="m"
          >
            <Text variant="header">Choose Category</Text>
            <Button
              label="Create"
              onPress={() =>
                props.navigation.navigate("AddBookmarkCategoryModal")
              }
              variant="pillMedium"
              marginRight="nm"
              backgroundColor="transparent"
              accent
            />
          </Box>

          <Box marginBottom="m">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleAddToCategory(category.id)}
              >
                <Box
                  padding="m"
                  marginBottom="s"
                  backgroundColor="secondaryBackground"
                  borderRadius="m"
                >
                  <Text variant="body">{category.name}</Text>
                  <Text variant="caption" color="secondaryText">
                    {category.recipeIds?.length} recipes
                  </Text>
                </Box>
              </TouchableOpacity>
            ))}
          </Box>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BookmarkModal;
