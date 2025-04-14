import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  useColorScheme,
  Platform,
  TouchableHighlight,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { Image as ImageIcon } from "geist-native-icons";
import { useTheme } from "@shopify/restyle";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as DropdownMenu from "zeego/dropdown-menu";
import {
  Menu as MMenu,
  MenuItem as MMenuItem,
} from "react-native-material-menu";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Theme } from "@theme";
import { Icon, Button, Box, Text } from "@components";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  updateCategoryCoverPhoto,
  deleteCoverPhotoFile,
} from "@store/slices/bookmarksSlice";
import { selectAccent } from "@store/slices/uiSlice";
import { BlurView } from "expo-blur";

interface HeaderRightProps {
  categoryId: string;
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 20,
    marginBottom: Platform.OS === "ios" ? -2 : 0,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  trigger: {
    marginRight: -6,
  },
});

const HeaderRight = ({ categoryId }: HeaderRightProps) => {
  const theme = useTheme<Theme>();
  const accent = useAppSelector(selectAccent);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // Get the cover photo from Redux store
  const categoryData = useAppSelector((state) =>
    state.bookmarks.categories.find((cat) => cat.id === categoryId),
  );
  const coverPhoto = categoryData?.coverPhoto;

  // Handle image picker
  const handleImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to make this work!",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;

        // Create a directory for category cover photos if it doesn't exist
        const coverPhotosDir = `${FileSystem.documentDirectory}coverPhotos/`;
        const dirInfo = await FileSystem.getInfoAsync(coverPhotosDir);

        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(coverPhotosDir, {
            intermediates: true,
          });
        }

        // Generate a unique filename for this category's cover photo with timestamp
        const fileExtension = imageUri.split(".").pop();
        const timestamp = Date.now();
        const fileName = `category_${categoryId}_cover_${timestamp}.${fileExtension}`;
        const destinationUri = `${coverPhotosDir}${fileName}`;

        // First, delete the existing cover photo file if it exists
        if (coverPhoto) {
          await deleteCoverPhotoFile(coverPhoto);
        }

        // Then, update the Redux store to set coverPhoto to null
        // This ensures the UI updates immediately
        dispatch(
          updateCategoryCoverPhoto({
            categoryId: categoryId,
            coverPhoto: null,
          }),
        );

        // Copy the image to our app's document directory
        await FileSystem.copyAsync({
          from: imageUri,
          to: destinationUri,
        });

        // Add a cache-busting query parameter to the URI
        const cacheBustingUri = `${destinationUri}?t=${timestamp}`;

        // Update the cover photo in Redux store with the new file URI
        dispatch(
          updateCategoryCoverPhoto({
            categoryId: categoryId,
            coverPhoto: cacheBustingUri,
          }),
        );
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to update cover photo. Please try again.");
    }
  };

  const handleRemoveImage = async () => {
    if (coverPhoto) {
      try {
        await deleteCoverPhotoFile(coverPhoto);
        dispatch(
          updateCategoryCoverPhoto({
            categoryId: categoryId,
            coverPhoto: null,
          }),
        );
      } catch (error) {
        console.error("Error removing image:", error);
        Alert.alert("Error", "Failed to remove cover photo. Please try again.");
      }
    }
  };

  return (
    <Box>
      {Platform.OS === "ios" ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger style={styles.trigger}>
            <Box
              padding="xs"
              borderRadius="m"
              overflow="hidden"
              marginRight="s"
            >
              <BlurView
                intensity={100}
                tint={"systemThickMaterialLight"}
                style={styles.blur}
              />
              <SymbolView
                name="photo.badge.plus"
                tintColor={
                  accent
                    ? theme.colors[`${accent}Text`]
                    : theme.colors.primaryText
                }
                style={styles.icon}
                fallback={
                  <Icon
                    icon={ImageIcon}
                    color="modalBackground"
                    accent
                    size={24}
                  />
                }
              />
            </Box>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item key="select-image" onSelect={handleImagePicker}>
              <DropdownMenu.ItemTitle>Select Image</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                ios={{
                  name: "photo",
                  pointSize: 16,
                  scale: "medium",
                }}
              />
            </DropdownMenu.Item>
            {coverPhoto && (
              <DropdownMenu.Item
                key="remove-image"
                onSelect={handleRemoveImage}
              >
                <DropdownMenu.ItemTitle>Remove Image</DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon
                  ios={{
                    name: "trash",
                    pointSize: 16,
                    scale: "medium",
                  }}
                />
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : (
        <Box
          justifyContent="space-between"
          alignItems="center"
          gap="s"
          position="absolute"
          top={0}
          right={0}
        >
          <MMenu
            visible={isOpen}
            style={{
              backgroundColor: theme.colors.secondaryBackground,
              borderRadius: theme.borderRadii.l,
              overflow: "hidden",
            }}
            anchor={
              <TouchableHighlight
                onPress={() => setIsOpen(!isOpen)}
                underlayColor={theme.colors.secondaryBackground}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  marginRight: 2,
                  borderRadius: 24,
                }}
              >
                <SymbolView
                  name="photo.badge.plus"
                  tintColor={
                    accent
                      ? theme.colors[`${accent}Text`]
                      : theme.colors.primaryText
                  }
                  style={styles.icon}
                  fallback={
                    <Icon
                      icon={ImageIcon}
                      color="modalBackground"
                      accent
                      size={24}
                    />
                  }
                />
              </TouchableHighlight>
            }
            onRequestClose={() => setIsOpen(false)}
          >
            <MMenuItem
              onPress={() => {
                handleImagePicker();
                setIsOpen(false);
              }}
              pressColor={theme.colors.quaternaryText}
            >
              <Box flexDirection="row" alignItems="center">
                <Box width={36} alignItems="flex-start">
                  <Ionicons
                    name="image"
                    size={24}
                    color={theme.colors.primaryText}
                  />
                </Box>
                <Text>Select Cover</Text>
              </Box>
            </MMenuItem>
            {coverPhoto && (
              <MMenuItem
                onPress={() => {
                  handleRemoveImage();
                  setIsOpen(false);
                }}
                pressColor={theme.colors.quaternaryText}
              >
                <Box flexDirection="row" alignItems="center">
                  <Box width={36} alignItems="flex-start">
                    <Ionicons
                      name="trash"
                      size={24}
                      color={theme.colors.primaryText}
                    />
                  </Box>
                  <Text>Remove Cover</Text>
                </Box>
              </MMenuItem>
            )}
          </MMenu>
        </Box>
      )}
    </Box>
  );
};

export default HeaderRight;
