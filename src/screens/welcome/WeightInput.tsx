import { useState } from "react";
import { Image, useColorScheme, KeyboardAvoidingView } from "react-native";
import { Invert } from "react-native-color-matrix-image-filters";

import logo from "../../../assets/icon-tinted.png";
import { Box, Text, TextInput, Button, Radios } from "@components";
import { useAppDispatch } from "@store/hooks";
import {
  getRecommendedTarget,
  setDailyTarget,
} from "@store/slices/proteinSlice";
import { setWeight } from "@store/slices/userSlice";
import type { RootScreenProps } from "@types";

const WeightInput = ({ navigation }: RootScreenProps<"WeightInput">) => {
  const [weight, setWeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const dispatch = useAppDispatch();
  const scheme = useColorScheme();

  const handleSubmit = () => {
    if (weight) {
      dispatch(setWeight(Number(weight)));
      dispatch(
        setDailyTarget(getRecommendedTarget(Number(weight), weightUnit)),
      );
      navigation.replace("Home");
    }
  };

  return (
    <Box flex={1} backgroundColor="mainBackground" padding="l">
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
          <Text variant="header" marginBottom="s">
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
          <Radios
            options={
              [
                { label: "lbs", value: "lbs" },
                { label: "kg", value: "kg" },
              ] as const
            }
            defaultValue={"lbs"}
            onChange={setWeightUnit}
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
      </KeyboardAvoidingView>
    </Box>
  );
};

export default WeightInput;
