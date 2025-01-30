import { useState } from "react";
import { TextInput } from "react-native";

import { Box, Text } from "@components";
import { Button } from "@components";
import { useAppDispatch } from "@store/hooks";
import { setName } from "@store/slices/userSlice";

export const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [inputName, setInputName] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    if (inputName.trim()) {
      dispatch(setName(inputName.trim()));
      onComplete();
    }
  };

  return (
    <Box flex={1} backgroundColor="mainBackground" padding="l">
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text variant="header" marginBottom="l">
          Welcome to Protein Tracker
        </Text>
        <Text variant="body" textAlign="center" marginBottom="xl">
          Let's personalize your experience. What's your name?
        </Text>
        <Box
          backgroundColor="cardBackground"
          padding="m"
          borderRadius={"m"}
          width="100%"
        >
          <TextInput
            value={inputName}
            onChangeText={setInputName}
            onSubmitEditing={handleSubmit}
            placeholder="Enter your name"
            style={{
              fontSize: 18,
              height: 40,
            }}
            autoFocus
          />
        </Box>
        <Button variant="primary" label="Continue" onPress={handleSubmit} />
      </Box>
    </Box>
  );
};
