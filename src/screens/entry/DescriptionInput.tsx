import { useState, useEffect, useRef } from "react";
import { Edit3 } from "geist-native-icons";
import { TextInput as RNTextInput } from "react-native";

import { StyleSheet } from "react-native";
import { TextInput, Button, Icon, Box } from "@components";
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
  editButtonIcon: {
    position: "absolute",
    right: -12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

interface Props {
  value: string;
  onChange: (text: string) => void;
}

const DescriptionInput = ({ value, onChange }: Props) => {
  const [description, setDescription] = useState(value);
  const [focused, setFocused] = useState(false);
  const ref = useRef<RNTextInput>(null);

  useEffect(() => {
    setDescription(value);
    onChange(description);
  }, [value]);

  return (
    <View style={styles.container}>
      <Box
        style={focused && styles.textInputContainer}
        marginLeft={focused ? "none" : "nl"}
      >
        <TextInput
          ref={ref}
          style={styles.textInput}
          borderLess
          backgroundColor="transparent"
          placeholder={focused ? "" : "Bagel & Cream Cheese "}
          value={description}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={setDescription}
        />
        {!focused && (
          <Button
            onPress={() => ref.current?.focus()}
            style={styles.editButtonIcon}
          >
            <Icon
              icon={Edit3}
              size={16}
              borderColor={description ? "primaryText" : "placeholderText"}
              color={description ? "primaryText" : "placeholderText"}
            />
          </Button>
        )}
      </Box>
    </View>
  );
};

export default DescriptionInput;
