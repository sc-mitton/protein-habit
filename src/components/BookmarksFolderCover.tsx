import { Box } from "./base";
import { useSelectRecipe } from "@db";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@theme";
import { useState } from "react";
import { RecipeThumbnail } from "./RecipeThumbnail";
import { BoxProps } from "./base/Box";

export const BookmarksFolderCover = ({
  categoryId,
  width = 75,
  gap = "xs",
  borderRadius = "sm",
  ...props
}: {
  categoryId: string;
  width?: number;
} & BoxProps) => {
  const theme = useTheme<Theme>();
  const category = useSelector((state: RootState) =>
    state.bookmarks.categories.find((cat) => cat.id === categoryId),
  );
  const [errors, setErrors] = useState(
    Array.from({ length: 3 }).fill(null) as [
      null | boolean,
      null | boolean,
      null | boolean,
    ],
  );

  // Get the first 3 recipe IDs from the category
  const recipeIds = category?.recipeIds.slice(0, 3) || [];

  // Fetch the recipes using the hook
  const { recipes } = useSelectRecipe(recipeIds);

  return (
    <Box
      flexDirection="row"
      height={0.7 * width}
      width={width}
      gap={gap}
      borderRadius={borderRadius}
      overflow="hidden"
    >
      <Box flex={1}>
        {recipes[0] && recipes[0].thumbnail && !errors[0] ? (
          <RecipeThumbnail
            source={{ uri: recipes[0].thumbnail }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: theme.borderRadii[borderRadius],
            }}
            onError={() => {
              setErrors((prev) => [true, prev[1], prev[2]]);
            }}
          />
        ) : (
          <Box
            flex={1}
            backgroundColor="primaryButton"
            borderRadius={borderRadius}
            {...props}
          />
        )}
      </Box>
      <Box flex={1} gap={gap}>
        <Box flex={1}>
          {recipes[1] && recipes[1].thumbnail && !errors[1] ? (
            <RecipeThumbnail
              source={{ uri: recipes[1].thumbnail }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: theme.borderRadii[borderRadius],
              }}
              onError={() => {
                setErrors((prev) => [prev[0], true, prev[2]]);
              }}
            />
          ) : (
            <Box
              flex={1}
              backgroundColor="primaryButton"
              borderRadius={borderRadius}
              {...props}
            />
          )}
        </Box>
        <Box flex={1}>
          {recipes[2] && recipes[2].thumbnail && !errors[2] ? (
            <RecipeThumbnail
              source={{ uri: recipes[2].thumbnail }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: theme.borderRadii[borderRadius],
              }}
              onError={() => {
                setErrors((prev) => [prev[0], prev[1], true]);
              }}
            />
          ) : (
            <Box
              flex={1}
              backgroundColor="primaryButton"
              borderRadius={borderRadius}
              {...props}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
