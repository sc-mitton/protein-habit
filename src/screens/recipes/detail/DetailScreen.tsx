import React from "react";
import { RecipesScreenProps } from "@types";
import { Box } from "@components";

type Props = RecipesScreenProps<"Detail">;

const DetailScreen: React.FC<Props> = (props) => {
  return <Box flex={1} backgroundColor="matchBlurBackground" padding="m"></Box>;
};

export default DetailScreen;
