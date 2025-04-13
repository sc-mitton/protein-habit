import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Theme } from "@theme";

import { Box, GridSortableList } from "@components";
import { RootScreenProps } from "@types";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import {
  selectOrderedCategories,
  reorderCategories,
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
  const [longPressed, setLongPressed] = useState(false);
  const [data, setData] = useState(categories);

  useEffect(() => {
    setData(categories);
  }, [categories]);

  return (
    <Box flex={1} backgroundColor="matchBlurBackground">
      <GridSortableList
        data={data}
        containerViewStyle={[
          { paddingTop: headerHeight + 24 },
          styles.contentContainer,
        ]}
        columns={COLUMN_COUNT}
        rowPadding={ITEM_PADDING}
        idField="id"
        onDragEnd={(positions) => {
          dispatch(reorderCategories({ order: positions }));
        }}
        renderItem={({ item }) => <Card item={item} />}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: ITEM_PADDING,
  },
  touchable: {
    borderRadius: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
});

export default BookmarkedScreen;
