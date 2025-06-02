import { useState } from "react";
import { Image, useColorScheme } from "react-native";

import logo from "@assets/icon.png";
import logoDark from "@assets/icon-dark.png";
import {
  Box,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from "@components";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectUserInfo, setName } from "@store/slices/userSlice";
import type { RootScreenProps } from "@types";
import Logo from "./Logo";

const WelcomeScreen = ({ navigation }: RootScreenProps<"Welcome">) => {
  const { name } = useAppSelector(selectUserInfo);
  const [inputName, setInputName] = useState(name);
  const dispatch = useAppDispatch();
  const scheme = useColorScheme();

  const handleSubmit = () => {
    if (inputName.trim()) {
      dispatch(setName(inputName.trim()));
      navigation.navigate("WeightInput");
    }
  };

  return (
    <Box flex={1} justifyContent="center" padding="l">
      <Logo />
      <Box marginLeft="xs" gap="s" marginBottom="l">
        <Text variant="header" marginBottom="s">
          Welcome to Protein Habit
        </Text>
        <Text variant="body" color="secondaryText" marginBottom="xl">
          Let's personalize your experience. What's your name?
        </Text>
      </Box>
      <KeyboardAvoidingView>
        <TextInput
          value={inputName}
          onChangeText={setInputName}
          onSubmitEditing={handleSubmit}
          placeholder="e.g. Jamie"
          returnKeyType="done"
        />
        <Box marginTop="l">
          <Button
            variant="primary"
            backgroundColor={
              scheme === "dark" ? "quaternaryText" : "primaryText"
            }
            textColor={scheme === "dark" ? "primaryText" : "mainBackground"}
            label="Continue"
            onPress={handleSubmit}
            disabled={!inputName.trim()}
          />
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
};

export default WelcomeScreen;
