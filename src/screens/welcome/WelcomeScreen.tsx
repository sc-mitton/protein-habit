import { useState } from "react";
import { Invert } from "react-native-color-matrix-image-filters";
import { Image, useColorScheme } from "react-native";

import logo from "../../../assets/icon-tinted.png";
import {
  Box,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from "@components";
import { useAppDispatch } from "@store/hooks";
import { setName } from "@store/slices/userSlice";
import type { HomeScreenProps } from "@types";

const WelcomeScreen = ({ navigation }: HomeScreenProps<"Welcome">) => {
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
    <Box flex={1} backgroundColor="mainBackground" padding="l">
      <Box flex={1} justifyContent="center">
        <Box alignItems="center" paddingBottom="xl">
          {scheme === "dark" ? (
            <Invert>
              <Image
                source={logo}
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
              />
            </Invert>
          ) : (
            <Image
              source={logo}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          )}
        </Box>
        <Box marginLeft="xs">
          <Text variant="header" marginBottom="s">
            Welcome to Protein Count
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
