import { Box } from "./base";
import { useSelectRecipe } from "@hooks";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@theme";

import { RecipeThumbnail } from "./RecipeThumbnail";

export const BookmarksFolderCover = ({
  categoryId,
}: {
  categoryId: string;
}) => {
  const theme = useTheme<Theme>();
  const category = useSelector((state: RootState) =>
    state.bookmarks.categories.find((cat) => cat.id === categoryId),
  );

  // Get the first 3 recipe IDs from the category
  const recipeIds = category?.recipeIds.slice(0, 3) || [];

  // Fetch the recipes using the hook
  const { recipes } = useSelectRecipe(recipeIds);

  return (
    <Box
      flexDirection="row"
      height={55}
      width={75}
      gap="xxs"
      borderRadius="s"
      overflow="hidden"
    >
      <Box flex={1}>
        {recipes[0] && recipes[0].thumbnail ? (
          <RecipeThumbnail
            source={{ uri: recipes[0].thumbnail }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: theme.borderRadii.m,
            }}
          />
        ) : (
          <Box
            flex={1}
            backgroundColor="secondaryCardBackground"
            borderRadius="s"
          />
        )}
      </Box>
      <Box flex={1} gap="xxs">
        <Box flex={1}>
          {recipes[1] && recipes[1].thumbnail ? (
            <RecipeThumbnail
              source={{ uri: recipes[1].thumbnail }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: theme.borderRadii.m,
              }}
            />
          ) : (
            <Box
              flex={1}
              backgroundColor="secondaryCardBackground"
              borderRadius="s"
            />
          )}
        </Box>
        <Box flex={1}>
          {recipes[2] && recipes[2].thumbnail ? (
            <RecipeThumbnail
              source={{ uri: recipes[2].thumbnail }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: theme.borderRadii.m,
              }}
            />
          ) : (
            <Box
              flex={1}
              backgroundColor="secondaryCardBackground"
              borderRadius="s"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
