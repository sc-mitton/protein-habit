import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Platform, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, X } from "geist-native-icons";
import { z } from "zod";
import LottieView from "lottie-react-native";

import {
  Box,
  Text,
  TextInput,
  Button,
  Icon,
  Checkbox,
  Slider,
} from "@components";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setName, setWeight, setWeightUnit } from "@store/slices/userSlice";
import { selectUserInfo } from "@store/slices/userSlice";
import {
  getRecommendedTarget,
  setDailyTarget,
} from "@store/slices/proteinSlice";
import type { ProfileScreenProps } from "@types";
import { useTheme } from "@shopify/restyle";
import { success as successLottie } from "@assets/lotties";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  weight: z.string().min(1, "Weight is required"),
  unit: z.enum(["kg", "lbs"]),
  updateProteinGoal: z.boolean().optional(),
});

const styles = StyleSheet.create({
  sliderFont: {
    fontSize: 14,
    fontFamily: "InterRegular",
  },
  lottieContainer: {
    position: "absolute",
    top: "50%",
    right: "50%",
    justifyContent: "center",
    alignItems: "center",
    width: 1,
    height: 1,
  },
  lottie: {
    transform: [{ translateX: 8 }],
    width: 28,
    height: 28,
  },
});

type FormData = z.infer<typeof schema>;

const Form = (props: ProfileScreenProps<"PersonalInfoModal">) => {
  const user = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const animation = useRef<LottieView>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      weight: user.weight.value.toString(),
      unit: user.weight.unit,
      updateProteinGoal: false,
    },
  });

  useEffect(() => {
    setTimeout(() => {
      animation.current?.reset();
    }, 0);
  }, []);

  const onSubmit = (data: FormData) => {
    animation.current?.reset();
    animation.current?.play();
    setShowSuccess(true);

    setTimeout(() => {
      dispatch(setName(data.name.trim()));
      dispatch(setWeight(Number(data.weight)));
      dispatch(setWeightUnit(data.unit));

      if (data.updateProteinGoal) {
        dispatch(
          setDailyTarget(getRecommendedTarget(Number(data.weight), data.unit)),
        );
      }
      props.navigation.goBack();
    }, 1700);
  };

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      padding="l"
      paddingTop="none"
    >
      {Platform.OS === "ios" && (
        <StatusBar
          style={"light"}
          backgroundColor={"transparent"}
          translucent
        />
      )}
      <Box flex={1}>
        {Platform.OS === "android" && (
          <Box
            borderBottomWidth={1.5}
            borderBottomColor="borderColor"
            paddingBottom="s"
          >
            <Button
              marginTop="xl"
              marginLeft="ns"
              onPress={() => props.navigation.goBack()}
              fontSize={18}
              gap="s"
              icon={
                <Icon
                  icon={ArrowLeft}
                  size={24}
                  strokeWidth={2.5}
                  color="primaryText"
                />
              }
            >
              <Text variant="header" paddingLeft="xs">
                Personal Info
              </Text>
            </Button>
          </Box>
        )}
        {Platform.OS === "ios" && (
          <Box
            paddingTop="l"
            borderBottomWidth={1.5}
            borderBottomColor="borderColor"
            paddingBottom="m"
          >
            <Button
              onPress={() => props.navigation.goBack()}
              variant="circleButton"
              style={{ position: "absolute", top: 12, right: -12 }}
              icon={
                <Icon
                  icon={X}
                  size={18}
                  color="primaryText"
                  strokeWidth={2.5}
                />
              }
            />
            <Text variant="header">Personal Info</Text>
          </Box>
        )}
        <Box marginVertical="l">
          <Text variant="label">Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Your name"
                error={!!errors.name}
              />
            )}
          />
          {errors.name && (
            <Text variant="caption" color="error" marginTop="xs">
              {errors.name.message}
            </Text>
          )}
        </Box>
        <Box gap="l">
          <Text variant="label">Weight</Text>
          <Controller
            control={control}
            name="weight"
            render={({ field: { onChange, value } }) => {
              return Platform.OS === "ios" ? (
                <Slider
                  defaultValue={Number(value)}
                  onChange={(v) => onChange(v.toString())}
                  tickColor={theme.colors.primaryText}
                  fontStyle={[
                    styles.sliderFont,
                    { color: theme.colors.primaryText },
                  ]}
                  min={80}
                  max={300}
                  step={1}
                />
              ) : (
                <Box marginTop="nl">
                  <TextInput
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Your weight"
                    error={!!errors.weight}
                  />
                </Box>
              );
            }}
          />
          {errors.weight && (
            <Text variant="caption" color="error" marginTop="xs">
              {errors.weight.message}
            </Text>
          )}
          <Controller
            control={control}
            name="unit"
            render={({ field: { onChange, value } }) => (
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
                    value === "lbs" ? "primaryButton" : "transparent"
                  }
                  borderColor={
                    value === "lbs" ? "primaryButton" : "primaryButton"
                  }
                  borderWidth={1.5}
                  label="lbs"
                  width={60}
                  onPress={() => onChange("lbs")}
                />
                <Button
                  variant="pill"
                  backgroundColor={
                    value === "kg" ? "primaryButton" : "transparent"
                  }
                  borderColor={
                    value === "kg" ? "primaryButton" : "primaryButton"
                  }
                  borderWidth={1.5}
                  width={60}
                  label="kg"
                  onPress={() => onChange("kg")}
                />
              </Box>
            )}
          />
        </Box>
        <Box marginVertical="s" gap="m">
          <Text color="tertiaryText" fontSize={14}>
            Automatically update your protein goal based on new weight?
          </Text>
          <Controller
            control={control}
            name="updateProteinGoal"
            render={({ field: { onChange, value } }) => (
              <Checkbox label="Yes" value={value} onChange={onChange} />
            )}
          />
        </Box>
        <Box marginTop="m">
          <Button
            variant="primary"
            label="Save"
            textColor={showSuccess ? "transparent" : "primaryText"}
            onPress={handleSubmit(onSubmit)}
          />
          <Box style={styles.lottieContainer} pointerEvents="none">
            <LottieView
              ref={animation}
              loop={false}
              autoPlay={false}
              source={successLottie}
              colorFilters={[
                {
                  keypath: "check",
                  color: theme.colors.primaryText,
                },
                {
                  keypath: "circle",
                  color: theme.colors.primaryText,
                },
              ]}
              style={styles.lottie}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Form;
