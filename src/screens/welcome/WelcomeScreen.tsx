import { useState } from "react";
import { Image, useColorScheme } from "react-native";

import logo from "@assets/icon.png";
import {
  Box,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from "@components";
import { useAppDispatch } from "@store/hooks";
import { setName } from "@store/slices/userSlice";
import type { RootScreenProps } from "@types";

const WelcomeScreen = ({ navigation }: RootScreenProps<"Welcome">) => {
  const [inputName, setInputName] = useState("");
  const dispatch = useAppDispatch();
  const scheme = useColorScheme();

  const handleSubmit = () => {
    if (inputName.trim()) {
      dispatch(setName(inputName.trim()));
      navigation.navigate("WeightInput");
    }
  };

  return (
    <Box flex={1} backgroundColor="secondaryBackground" padding="l">
      <Box flex={1} justifyContent="center">
        <Box
          alignItems="center"
          paddingBottom="xl"
          shadowColor="defaultShadow"
          shadowOffset={{ width: 0, height: 1 }}
          shadowOpacity={0.35}
          shadowRadius={3}
          elevation={5}
        >
          {scheme === "dark" ? (
            <Image
              source={logo}
              style={{ width: 64, height: 64, borderRadius: 16 }}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={logo}
              style={{ width: 64, height: 64, borderRadius: 16 }}
              resizeMode="contain"
            />
          )}
        </Box>
        <Box marginLeft="xs" gap="s" marginBottom="l">
          <Text variant="header" marginBottom="s">
            Welcome to Protein Count
          </Text>
          <Text variant="body" color="secondaryText" marginBottom="xl">
            Let's personalize your experience. What's your name?
          </Text>
        </Box>
        <KeyboardAvoidingView>
          <TextInput
            backgroundColor="borderColor"
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
    </Box>
  );
};

export default WelcomeScreen;
