import React, { useState, memo } from "react";
import {
  View,
  TouchableHighlight,
  StyleSheet,
  useColorScheme,
} from "react-native";

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
    borderRadius: 15.5,
  },
  contentContainer: {
    paddingBottom: 20,
  },
});

const Card = ({ item }: { item: BookmarkCategory }) => {
  const navigation = useNavigation<any>();
  const [isLongPressed, setIsLongPressed] = useState(false);
  const scheme = useColorScheme();

  return (
    <Box>
      <Box
        shadowColor="foodItemShadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={12}
      >
        <Box
          flexDirection="column"
          alignItems="flex-start"
          shadowColor="foodItemShadow"
          shadowOpacity={0.1}
          shadowOffset={{ width: 0, height: 2 }}
          shadowRadius={2}
          elevation={2}
          padding="none"
        >
          <TouchableHighlight
            style={styles.touchable}
            underlayColor={theme.colors.primaryText}
            activeOpacity={scheme === "dark" ? 0.5 : 0.95}
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
              style={styles.item}
              backgroundColor={
                scheme == "light"
                  ? "secondaryBackground"
                  : "secondaryBackground"
              }
              borderColor="borderColor"
              borderWidth={0.5}
              borderRadius="l"
            >
              <BookmarksFolderCover
                categoryId={item.id}
                width={ITEM_WIDTH}
                gap="s"
                borderRadius="m"
              />
            </Box>
          </TouchableHighlight>
        </Box>
      </Box>
      <Box paddingHorizontal="sm" paddingTop="s" paddingBottom="xs">
        <Text variant="body">{item.name}</Text>
        <Text variant="caption" color="secondaryText">
          {item.recipeIds.length} recipes
        </Text>
      </Box>
    </Box>
  );
};

export default memo(Card);
