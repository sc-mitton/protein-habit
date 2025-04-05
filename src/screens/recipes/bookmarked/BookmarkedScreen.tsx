import React from "react";
import { RecipesScreenProps } from "../../../types/navigation";
import { Box, Text } from "@components";

type Props = RecipesScreenProps<"Bookmarks">;

const BookmarkedScreen: React.FC<Props> = (props) => {
  return (
    <Box flex={1} backgroundColor="matchBlurBackground" padding="m">
      <Text>Here</Text>
    </Box>
  );
};

export default BookmarkedScreen;
