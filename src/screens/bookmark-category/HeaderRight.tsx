import React from "react";
import { Alert, StyleSheet, useColorScheme } from "react-native";
import { SymbolView } from "expo-symbols";
import { Image as ImageIcon } from "geist-native-icons";
import { useTheme } from "@shopify/restyle";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { Theme } from "@theme";
import { Icon, Button } from "@components";
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
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
});

const HeaderRight = ({ categoryId }: HeaderRightProps) => {
  const theme = useTheme<Theme>();
  const colorScheme = useColorScheme();
  const accent = useAppSelector(selectAccent);
  const dispatch = useAppDispatch();

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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

        // Generate a unique filename for this category's cover photo
        const fileExtension = imageUri.split(".").pop();
        const fileName = `category_${categoryId}_cover.${fileExtension}`;
        const destinationUri = `${coverPhotosDir}${fileName}`;

        // Delete the old cover photo if it exists
        if (coverPhoto) {
          await deleteCoverPhotoFile(coverPhoto);
        }

        // Copy the image to our app's document directory
        await FileSystem.copyAsync({
          from: imageUri,
          to: destinationUri,
        });

        // Update the cover photo in Redux store with the new file URI
        dispatch(
          updateCategoryCoverPhoto({
            categoryId: categoryId,
            coverPhoto: destinationUri,
          }),
        );
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to update cover photo. Please try again.");
    }
  };

  return (
    <Button
      onPress={handleImagePicker}
      padding="xs"
      borderRadius="m"
      overflow="hidden"
    >
      <BlurView
        intensity={100}
        tint={"systemThickMaterialLight"}
        style={styles.blur}
      />
      <SymbolView
        name="photo.on.rectangle"
        tintColor={
          accent ? theme.colors[`${accent}Text`] : theme.colors.primaryText
        }
        style={styles.icon}
        fallback={
          <Icon icon={ImageIcon} color="modalBackground" accent size={24} />
        }
      />
    </Button>
  );
};

export default HeaderRight;
