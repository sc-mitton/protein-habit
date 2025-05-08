import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Alert } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Theme } from "@theme";
import { LinearGradient } from "expo-linear-gradient";

import { GridSortableList } from "@components";
import { RootScreenProps } from "@types";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import {
  selectOrderedCategories,
  reorderCategories,
  removeCategory,
  deleteCoverPhotoFile,
} from "@store/slices/bookmarksSlice";
import { useTheme } from "@shopify/restyle";
import { COLUMN_COUNT, ITEM_PADDING } from "./constants";
import Card from "./Card";

type Props = RootScreenProps<"BookmarkedRecipes">;

const BookmarkedScreen = (props: Props) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectOrderedCategories);
  const headerHeight = useHeaderHeight();
  const theme = useTheme<Theme>();
  const [data, setData] = useState(categories);

  useEffect(() => {
    setData(categories);
  }, [categories]);

  // Handle category deletion with confirmation
  const handleDeleteCategory = async (categoryId: string) => {
    // Don't allow deleting the Favorites category
    if (categoryId === "favorites") {
      Alert.alert("Cannot Delete", "The Favorites category cannot be deleted.");
      return;
    }

    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? All recipes will be removed from it.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Find the category to get its cover photo
            const categoryToDelete = categories.find(
              (cat) => cat.id === categoryId,
            );

            // Delete the category from Redux
            dispatch(removeCategory(categoryId));

            // Delete the cover photo file if it exists
            if (categoryToDelete?.coverPhoto) {
              await deleteCoverPhotoFile(categoryToDelete.coverPhoto);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.stretch,
          { backgroundColor: theme.colors.matchBlurBackground },
        ]}
        alwaysBounceVertical={false}
      >
        <LinearGradient
          colors={[
            theme.colors.transparentRGB,
            theme.colors.matchBlurBackground,
          ]}
          style={styles.bottomGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <GridSortableList
          data={data}
          containerViewStyle={[
            { paddingTop: headerHeight + 24 },
            styles.gridContent,
          ]}
          columns={COLUMN_COUNT}
          rowPadding={ITEM_PADDING}
          idField="id"
          onDragEnd={(positions) => {
            dispatch(reorderCategories({ order: positions }));
          }}
          renderItem={({ item }) => <Card item={item} />}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: ITEM_PADDING,
  },
  stretch: {
    flex: 1,
  },
  touchable: {
    borderRadius: 16,
  },
  gridContent: {
    paddingBottom: 20,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  container: {
    flex: 1,
  },
});

export default BookmarkedScreen;
