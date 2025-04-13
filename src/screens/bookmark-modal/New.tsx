import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useAppDispatch } from "@store/hooks";
import { addCategory } from "@store/slices/bookmarksSlice";

import { Text, TextInput, KeyboardAvoidingView2 } from "@components";

const New = ({ onBlur }: { onBlur: () => void }) => {
  const dispatch = useAppDispatch();
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");

  const handleCreateFolder = () => {
    if (!folderName.trim()) {
      onBlur();
      return;
    }

    // Create a new category with a unique ID
    const newCategoryId = `category_${Date.now()}`;

    dispatch(
      addCategory({
        id: newCategoryId,
        name: folderName.trim(),
      }),
    );
  };

  return (
    <KeyboardAvoidingView2 offset={32}>
      <TextInput
        placeholder="Name"
        value={folderName}
        onChangeText={(text) => {
          setFolderName(text);
          if (error) setError("");
        }}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleCreateFolder}
        onBlur={onBlur}
      />

      {error ? (
        <Text variant="caption" color="error" marginTop="s">
          {error}
        </Text>
      ) : null}
    </KeyboardAvoidingView2>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default New;
