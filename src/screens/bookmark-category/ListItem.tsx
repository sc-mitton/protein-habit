import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import _ from "lodash";

import { Box, Text, RecipeThumbnail } from "@components";
import { RootStackParamList } from "@types";
import { capitalize } from "@utils";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { IMAGE_HEIGHT } from "./Cover";
import { RecipeWithAssociations } from "@db/schema/types";

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
  thumbnail: {
    width: "100%",
    height: "100%",
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

const THUMBNAIL_SIZE = 60;

const ListItem = ({
  item,
  index,
}: {
  item: RecipeWithAssociations;
  index: number;
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleRecipePress = (recipeId: string) => {
    navigation.navigate("RecipeDetail", { recipe: recipeId });
  };

  return (
    <Box
      margin="none"
      flexDirection="row"
      paddingVertical="m"
      paddingHorizontal="m"
      paddingTop={index === 0 ? "l" : "m"}
      borderRadius="none"
    >
      <Box
        backgroundColor="mainBackground"
        borderTopEndRadius={index === 0 ? "xl" : "none"}
        borderTopStartRadius={index === 0 ? "xl" : "none"}
        style={StyleSheet.absoluteFill}
      />
      {index !== 0 && (
        <Box
          backgroundColor="borderColor"
          height={1.5}
          position="absolute"
          left={THUMBNAIL_SIZE + 24}
          right={16}
          top={0}
        />
      )}
      <TouchableOpacity
        onPress={() => handleRecipePress(item.id)}
        activeOpacity={0.6}
      >
        <Box flex={1} flexDirection="row" gap="m" alignItems="center">
          <Box
            width={THUMBNAIL_SIZE}
            height={THUMBNAIL_SIZE}
            borderRadius="m"
            overflow="hidden"
          >
            <RecipeThumbnail
              source={{ uri: item.thumbnail }}
              style={styles.thumbnail}
              contentFit="cover"
            />
          </Box>
          <Box>
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
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default ListItem;
