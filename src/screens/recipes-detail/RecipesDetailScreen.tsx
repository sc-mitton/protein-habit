import React from "react";
import { RootScreenProps } from "@types";
import { Box } from "@components";

type Props = RootScreenProps<"RecipeDetail">;

const DetailScreen: React.FC<Props> = (props) => {
  return <Box flex={1} backgroundColor="matchBlurBackground" padding="m"></Box>;
};

export default DetailScreen;
