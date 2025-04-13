import React from "react";

import { Box, Text, Button } from "@components";
import FolderOption from "./FolderOption";
import { RootScreenProps } from "@types";
import { useAppSelector } from "@store/hooks";
import { RootState } from "@store";

const List = (props: RootScreenProps<"BookmarkModal">) => {
  const categories = useAppSelector(
    (state: RootState) => state.bookmarks.categories,
  );

  return (
    <Box>
      <Text variant="bold" fontSize={14} color="tertiaryText" marginLeft="xs">
        Folders
      </Text>
      <Box marginBottom="m" marginTop="m" gap="m">
        {categories.map((category, i) => (
          <FolderOption
            key={`category-${i}`}
            categoryId={category.id}
            recipeId={props.route.params.recipe}
          />
        ))}
      </Box>
    </Box>
  );
};

export default List;
