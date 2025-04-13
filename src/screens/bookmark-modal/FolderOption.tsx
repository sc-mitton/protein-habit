import React, { useRef, useState, useEffect } from "react";
import { ArrowRightCircleFill } from "geist-native-icons";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Box, Text, Button, Icon, BookmarksFolderCover } from "@components";
import { Theme } from "@theme";
import { useTheme } from "@shopify/restyle";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { SymbolView } from "expo-symbols";
import { selectAccent } from "@store/slices/uiSlice";
import {
  selectCategory,
  addRecipeToCategory,
} from "@store/slices/bookmarksSlice";
import { success as successLottie } from "@assets/lotties";

const styles = StyleSheet.create({
  lottieContainer: {
    position: "absolute",
  },
});

const FolderOption = ({
  categoryId,
  recipeId,
}: {
  categoryId: string;
  recipeId: string;
}) => {
  const accentColor = useAppSelector(selectAccent);
  const theme = useTheme<Theme>();
  const category = useAppSelector((state) => selectCategory(state, categoryId));
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [showSuccess, setShowSuccess] = useState(false);
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    setTimeout(() => {
      animation.current?.reset();
    }, 0);
  }, []);

  useEffect(() => {
    if (showSuccess) {
      animation.current?.reset();
      animation.current?.play();
    }
  }, [showSuccess]);

  const handleSave = () => {
    setShowSuccess(true);

    // Add recipe to category
    dispatch(
      addRecipeToCategory({
        categoryId,
        recipeId,
      }),
    );

    // Close modal after animation
    setTimeout(() => {
      navigation.goBack();
    }, 900);
  };

  return (
    <Box
      paddingHorizontal="xs"
      borderRadius="m"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      gap="m"
    >
      <BookmarksFolderCover categoryId={categoryId} />
      <Box flex={1} marginRight="m">
        <Box marginBottom="s">
          <Text variant="body">{category?.name}</Text>
          <Text variant="caption" color="secondaryText">
            {category?.recipeIds?.length} recipes
          </Text>
        </Box>
      </Box>
      <Button
        onPress={handleSave}
        marginRight="ns"
        icon={
          <SymbolView
            name="arrow.down.circle.fill"
            tintColor={
              accentColor ? theme.colors[accentColor] : theme.colors.primaryText
            }
            size={24}
            fallback={
              <Icon
                icon={ArrowRightCircleFill}
                borderColor="primaryText"
                color="modalBackground"
                accent
                size={24}
              />
            }
          />
        }
      >
        {showSuccess && (
          <Box
            style={styles.lottieContainer}
            pointerEvents="none"
            backgroundColor="modalBackground"
            borderRadius="full"
            padding="xs"
          >
            <LottieView
              ref={animation}
              loop={false}
              autoPlay={false}
              style={{ width: 24, height: 24 }}
              speed={1.7}
              source={successLottie}
              colorFilters={[
                {
                  keypath: "check",
                  color: accentColor
                    ? theme.colors[accentColor]
                    : theme.colors.primaryText,
                },
                {
                  keypath: "circle",
                  color: accentColor
                    ? theme.colors[accentColor]
                    : theme.colors.primaryText,
                },
              ]}
            />
          </Box>
        )}
      </Button>
    </Box>
  );
};

export default FolderOption;
