import { Box, Text } from "@components";
import { RootScreenProps } from "@types";

const RecipesScreen = (props: RootScreenProps<"Recipes">) => {
  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box padding="l">
        <Text variant="header">Recipes</Text>
      </Box>
    </Box>
  );
};

export default RecipesScreen;
