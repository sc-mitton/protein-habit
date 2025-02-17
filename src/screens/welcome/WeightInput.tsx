import { useState } from "react";
import { Image, useColorScheme } from "react-native";

import logo from "../../../assets/icon.png";
import {
  Box,
  Text,
  TextInput,
  Button,
  Radios,
  KeyboardAvoidingView,
} from "@components";
import { useAppDispatch } from "@store/hooks";
import {
  getRecommendedTarget,
  setDailyTarget,
} from "@store/slices/proteinSlice";
import { setWeight } from "@store/slices/userSlice";
import type { HomeScreenProps } from "@types";

const WeightInput = ({ navigation }: HomeScreenProps<"WeightInput">) => {
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
      navigation.replace("Main");
    }
  };

  return (
    <Box flex={1} backgroundColor="mainBackground" padding="l">
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
        <Box marginLeft="xs">
          <Text variant="header" marginBottom="s">
            What's your weight?
          </Text>
          <Text variant="body" color="secondaryText" marginBottom="xl">
            This helps us set your daily protein target
          </Text>
        </Box>
        <KeyboardAvoidingView>
          <TextInput
            value={weight}
            backgroundColor="borderColor"
            onChangeText={setWeightValue}
            onSubmitEditing={handleSubmit}
            placeholder="Enter your weight in lbs"
            keyboardType="numeric"
            returnKeyType="done"
          />
          <Box width="100%" alignContent="center" marginTop="s" marginLeft="s">
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
          </Box>
          <Box marginTop="l">
            <Button
              variant="primary"
              backgroundColor={
                scheme === "dark" ? "quaternaryText" : "primaryText"
              }
              textColor={scheme === "dark" ? "primaryText" : "mainBackground"}
              label="Continue"
              onPress={handleSubmit}
              disabled={!weight}
            />
          </Box>
        </KeyboardAvoidingView>
      </Box>
    </Box>
  );
};

export default WeightInput;
