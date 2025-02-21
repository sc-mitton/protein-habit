import { useState } from "react";
import { Image, useColorScheme } from "react-native";

import logo from "../../../assets/icon.png";
import { Box, Text, Button, Radios } from "@components";
import { useAppDispatch } from "@store/hooks";
import {
  getRecommendedTarget,
  setDailyTarget,
} from "@store/slices/proteinSlice";
import { setWeight } from "@store/slices/userSlice";
import { Slider } from "@components";
import { useTheme } from "@shopify/restyle";
import type { HomeScreenProps } from "@types";

const WeightInput = ({ navigation }: HomeScreenProps<"WeightInput">) => {
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
      navigation.replace("Main");
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
          shadowOpacity={1}
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
        <Box>
          <Text variant="header" marginBottom="s">
            What's your weight?
          </Text>
          <Text variant="body" color="secondaryText" marginBottom="xl">
            This helps us set your daily protein target
          </Text>
        </Box>
        <Box marginVertical="l">
          <Slider
            onChange={setWeightValue}
            defaultValue={160}
            fontStyle={{ color: theme.colors.primaryText, fontSize: 18 }}
            min={weightUnit === "lbs" ? 80 : 36}
            max={weightUnit === "lbs" ? 300 : 150}
            tickColor={theme.colors.primaryText}
            step={weightUnit === "lbs" ? 1 : 0.5}
          />
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
