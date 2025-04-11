import React from "react";
import { RootScreenProps } from "@types";
import { Box, Text } from "@components";

type Props = RootScreenProps<"BookmarkedRecipes">;

const BookmarkedScreen = (props: Props) => {
  return <Box flex={1} backgroundColor="matchBlurBackground" padding="m"></Box>;
};

export default BookmarkedScreen;
