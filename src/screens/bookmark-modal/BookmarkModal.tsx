import React, { useState, useEffect } from "react";
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOutLeft,
  FadeOut,
} from "react-native-reanimated";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { BackDrop, Box, Button, Text } from "@components";
import theme, { Theme } from "@theme";
import { useTheme } from "@shopify/restyle";
import { RootScreenProps } from "@types";
import List from "./List";
import New from "./New";

const BookmarkModal = (props: RootScreenProps<"BookmarkModal">) => {
  const theme = useTheme<Theme>();
  const [firstRender, setFirstRender] = useState(true);
  const [createNew, setCreateNew] = useState(props.route.params.recipe === "");

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    }
  }, [firstRender]);

  const handleBlur = () => {
    if (!createNew) return;
    if (props.route.params.recipe === "") {
      props.navigation.goBack();
    } else {
      setCreateNew(false);
    }
  };

  const handleCancelCreate = () => {
    if (createNew) {
      handleBlur();
    } else {
      setCreateNew(true);
    }
  };

  return (
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
        {createNew ? (
          <Animated.View exiting={FadeOut} entering={FadeIn}>
            <Text variant="header">Create a Folder</Text>
          </Animated.View>
        ) : (
          <Animated.View exiting={FadeOut} entering={FadeIn}>
            <Text variant="header">Choose a Folder</Text>
          </Animated.View>
        )}
        <Button
          label={createNew ? "Cancel" : "Create"}
          onPress={handleCancelCreate}
          variant="pillMedium"
          marginRight="nm"
          backgroundColor="transparent"
          accent
        />
      </Box>
      {createNew ? (
        <Animated.View
          entering={FadeInRight.duration(firstRender ? 0 : 200)}
          exiting={FadeOutLeft.duration(firstRender ? 0 : 200)}
        >
          <New onBlur={handleBlur} />
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <List {...props} />
        </Animated.View>
      )}
    </Box>
  );
};

export default function (props: RootScreenProps<"BookmarkModal">) {
  const theme = useTheme<Theme>();
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
        <BookmarkModal {...props} />
      </BottomSheetView>
    </BottomSheet>
  );
}
