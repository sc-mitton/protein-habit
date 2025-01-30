import { useState } from "react";

import { Box, Text, TextInput, Button } from "@components";
import { useAppDispatch } from "@store/hooks";
import { setName } from "@store/slices/userSlice";
import type { RootScreenProps } from "@types";

const WelcomeScreen = ({ navigation }: RootScreenProps<"Welcome">) => {
  const [inputName, setInputName] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    if (inputName.trim()) {
      dispatch(setName(inputName.trim()));
      handleComplete();
    }
  };

  const handleComplete = () => {
    navigation.navigate("Home");
  };

  return (
    <Box flex={1} backgroundColor="mainBackground" padding="l">
      <Box flex={1} justifyContent="center">
        <Text variant="header" marginBottom="l">
          Welcome to Protein Tracker
        </Text>
        <Text variant="body" color="secondaryText" marginBottom="xl">
          Let's personalize your experience. What's your name?
        </Text>
        <TextInput
          value={inputName}
          onChangeText={setInputName}
          onSubmitEditing={handleSubmit}
          placeholder="Enter your name"
          autoFocus
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
      </Box>
    </Box>
  );
};

export default WelcomeScreen;
