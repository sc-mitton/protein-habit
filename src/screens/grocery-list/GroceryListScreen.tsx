import React from "react";
import { RootScreenProps } from "@types";
import { Box } from "@components";

type Props = RootScreenProps<"GroceryList">;

const ShoppingListScreen = (props: Props) => {
  return <Box flex={1} backgroundColor="matchBlurBackground" padding="m"></Box>;
};

export default ShoppingListScreen;
