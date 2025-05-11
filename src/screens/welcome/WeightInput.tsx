import { useState } from "react";
import { Image, useColorScheme, Platform } from "react-native";

import logo from "@assets/icon.png";
import { Box, Text, Button, TextInput } from "@components";
import { useAppDispatch } from "@store/hooks";
import {
  getRecommendedTarget,
  setDailyTarget,
} from "@store/slices/proteinSlice";
import { setWeight } from "@store/slices/userSlice";
import { Slider } from "@components";
import { useTheme } from "@shopify/restyle";
import type { RootScreenProps } from "@types";
import Logo from "./Logo";

const WeightInput = ({ navigation }: RootScreenProps<"WeightInput">) => {
  const [weight, setWeightValue] = useState<number>();
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const dispatch = useAppDispatch();
  const scheme = useColorScheme();
  const theme = useTheme();

  const handleSubmit = () => {
    if (weight) {
      dispatch(setWeight(Number(weight)));
      dispatch(
        setDailyTarget(getRecommendedTarget(Number(weight), weightUnit)),
      );
      navigation.replace("BottomTabs", { screen: "Home" });
    }
  };

  return (
    <Box flex={1} backgroundColor="mainBackground" padding="l">
      <Box flex={1} justifyContent="center">
        <Logo />
        <Box gap="s" marginBottom="l" marginTop="s">
          <Text variant="header" marginBottom="s">
            What's your weight?
          </Text>
          <Text variant="body" color="secondaryText" marginBottom="xl">
            This helps us set your daily protein target
          </Text>
        </Box>
        <Box marginVertical="l">
          {Platform.OS === "ios" ? (
            <Slider
              onChange={setWeightValue}
              defaultValue={160}
              fontStyle={{ color: theme.colors.primaryText, fontSize: 18 }}
              min={weightUnit === "lbs" ? 80 : 36}
              max={weightUnit === "lbs" ? 300 : 150}
              tickColor={theme.colors.primaryText}
              step={weightUnit === "lbs" ? 1 : 0.5}
            />
          ) : (
            <TextInput
              keyboardType="numeric"
              value={weight?.toString()}
              onChangeText={(text) => setWeightValue(Number(text))}
              placeholder="160"
            />
          )}
        </Box>
        <Box
          alignContent="center"
          flexDirection="row"
          justifyContent="center"
          marginBottom="xl"
          marginLeft="s"
          gap="s"
        >
          <Button
            variant="pill"
            backgroundColor={
              weightUnit === "lbs" ? "primaryButton" : "transparent"
            }
            borderColor={
              weightUnit === "lbs" ? "primaryButton" : "primaryButton"
            }
            borderWidth={1.5}
            label="lbs"
            width={60}
            onPress={() => setWeightUnit("lbs")}
          />
          <Button
            variant="pill"
            borderColor={
              weightUnit === "kg" ? "primaryButton" : "primaryButton"
            }
            backgroundColor={
              weightUnit === "kg" ? "primaryButton" : "transparent"
            }
            borderWidth={1.5}
            width={60}
            label="kg"
            onPress={() => setWeightUnit("kg")}
          />
        </Box>
        <Box marginTop="l">
          <Button
            variant="primary"
            backgroundColor={
              scheme === "dark" ? "quaternaryText" : "primaryText"
            }
            textColor={scheme === "dark" ? "primaryText" : "mainBackground"}
            label="Save"
            onPress={handleSubmit}
            disabled={!weight}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default WeightInput;
