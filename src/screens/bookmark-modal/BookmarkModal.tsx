import React from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { Box, Text, Button, BackDrop } from "@components";
import { Theme } from "@theme";
import { useTheme } from "@shopify/restyle";
import { RootState } from "@store";
import { RootScreenProps } from "@types";
import FolderOption from "./FolderOption";
import { useAppSelector } from "@store/hooks";

const BookmarkModal = (props: RootScreenProps<"BookmarkModal">) => {
  const theme = useTheme<Theme>();
  const categories = useAppSelector(
    (state: RootState) => state.bookmarks.categories,
  );

  return (
    <BottomSheet
      onClose={() => props.navigation.goBack()}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.colors.modalBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.tertiaryText,
      }}
      backdropComponent={() => <BackDrop blurIntensity={10} />}
    >
      <BottomSheetView>
        <Box
          backgroundColor="modalBackground"
          borderRadius="l"
          padding="l"
          paddingBottom="xxxl"
        >
          <Box
            borderBottomColor="borderColor"
            borderBottomWidth={1.5}
            paddingBottom="s"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="xl"
          >
            <Text variant="header">Choose a Folder</Text>
            <Button
              label="Create"
              onPress={() => {}}
              variant="pillMedium"
              marginRight="nm"
              backgroundColor="transparent"
              accent
            />
          </Box>
          <Text variant="bold" fontSize={14} color="tertiaryText">
            Folders
          </Text>
          <Box marginBottom="m" marginTop="xs">
            {categories.map((category, i) => (
              <FolderOption
                key={`category-${i}`}
                categoryId={category.id}
                recipeId={props.route.params.recipe}
              />
            ))}
          </Box>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BookmarkModal;
