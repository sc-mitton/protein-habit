import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Theme } from "@theme";
import { LinearGradient } from "expo-linear-gradient";

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
    <View style={styles.container}>
      <ScrollView
        style={{ backgroundColor: theme.colors.matchBlurBackground }}
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
      </ScrollView>
    </View>
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
