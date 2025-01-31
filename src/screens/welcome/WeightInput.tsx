import { useState } from "react";
import { Box, Text, TextInput, Button } from "@components";
import { useAppDispatch } from "@store/hooks";
import { setWeight } from "@store/slices/userSlice";
import type { RootScreenProps } from "@types";

const WeightInput = ({ navigation }: RootScreenProps<"WeightInput">) => {
  const [weight, setWeightValue] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    if (weight) {
      dispatch(setWeight(Number(weight)));
      navigation.replace("Home");
    }
  };

  return (
    <Box flex={1} backgroundColor="mainBackground" padding="l">
      <Box flex={1} justifyContent="center">
        <Text variant="header" marginBottom="l">
          What's your weight?
        </Text>
        <Text variant="body" color="secondaryText" marginBottom="xl">
          This helps us set your daily protein target
        </Text>
        <TextInput
          value={weight}
          onChangeText={setWeightValue}
          onSubmitEditing={handleSubmit}
          placeholder="Enter your weight in lbs"
          keyboardType="numeric"
          autoFocus
          returnKeyType="done"
        />
        <Box marginTop="l">
          <Button
            variant="primary"
            label="Continue"
            onPress={handleSubmit}
            disabled={!weight}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default WeightInput;
