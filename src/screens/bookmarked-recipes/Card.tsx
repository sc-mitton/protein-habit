import React, { useState, memo } from "react";
import { View, TouchableHighlight, StyleSheet } from "react-native";

import { Box, Text, BookmarksFolderCover } from "@components";
import { ITEM_PADDING, ITEM_WIDTH } from "./constants";
import theme from "@theme";
import { useNavigation } from "@react-navigation/native";
import { BookmarkCategory } from "@store/slices/bookmarksSlice";

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

const Card = ({ item }: { item: BookmarkCategory }) => {
  const navigation = useNavigation<any>();
  const [isLongPressed, setIsLongPressed] = useState(false);

  return (
    <TouchableHighlight
      style={styles.touchable}
      underlayColor={theme.colors.primaryText}
      activeOpacity={0.95}
      onLongPress={() => {
        setIsLongPressed(true);
      }}
      onPress={() => {
        if (isLongPressed) {
          setIsLongPressed(false);
        } else {
          navigation.navigate("BookmarkCategory", {
            category: item,
          });
        }
      }}
    >
      <Box
        shadowColor="foodItemShadow"
        shadowOpacity={0.1}
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={2}
        elevation={5}
      >
        <Box
          backgroundColor="secondaryBackground"
          borderRadius="xl"
          flexDirection="column"
          alignItems="flex-start"
          shadowColor="foodItemShadow"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          elevation={12}
          padding="none"
        >
          <View style={styles.item}>
            <BookmarksFolderCover
              categoryId={item.id}
              width={ITEM_WIDTH}
              gap="s"
              borderRadius="m"
            />
            <Box padding="s">
              <Text variant="body">{item.name}</Text>
              <Text variant="caption" color="secondaryText">
                {item.recipeIds.length} recipes
              </Text>
            </Box>
          </View>
        </Box>
      </Box>
    </TouchableHighlight>
  );
};

export default memo(Card);
