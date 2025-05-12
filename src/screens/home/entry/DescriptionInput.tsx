import { useState, useEffect, useRef } from "react";
import { Edit3 } from "geist-native-icons";
import { TextInput as RNTextInput, Platform, StyleSheet } from "react-native";

import { TextInput, Button, Icon, Box, Text } from "@components";
import { View } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    textAlign: "center",
  },
  textInputContainer: {
    width: "100%",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "primaryText",
  },
});

interface Props {
  value: string;
  onChange: (text: string) => void;
}

const DescriptionInput = ({ value, onChange }: Props) => {
  const [description, setDescription] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [selection, setSelection] = useState<{ start: number; end: number }>();
  const ref = useRef<RNTextInput>(null);

  useEffect(() => {
    setDescription(value);
  }, [value]);

  useEffect(() => {
    onChange(description);
  }, [description]);

  const handleFocus = () => {
    if (!selection) {
      setSelection({ start: description.length, end: description.length });
    }
    setTimeout(() => {
      setSelection(undefined);
    }, 100);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setSelection(undefined);
  };

  const handleEditPress = () => {
    setIsEditing(true);
    setTimeout(() => {
      ref.current?.focus();
    }, 100);
  };

  return !isEditing ? (
    <Box style={styles.container}>
      <Button
        onPress={handleEditPress}
        style={styles.editButton}
        label={description || "Bagel & Cream Cheese"}
        textColor={description ? "primaryText" : "placeholderText"}
        labelPlacement="left"
        paddingVertical="l"
        icon={
          <Box marginLeft="s" marginTop="xxs">
            <Icon
              icon={Edit3}
              size={16}
              borderColor={description ? "primaryText" : "placeholderText"}
              color={description ? "primaryText" : "placeholderText"}
            />
          </Box>
        }
      />
    </Box>
  ) : (
    <Box style={styles.container} marginVertical="xs">
      <Box style={styles.textInputContainer}>
        <TextInput
          ref={ref}
          style={styles.textInput}
          borderLess
          backgroundColor="transparent"
          value={description}
          selection={selection}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={setDescription}
        />
      </Box>
    </Box>
  );
};

export default DescriptionInput;
