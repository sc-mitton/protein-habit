import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { X } from "geist-native-icons";
import { z } from "zod";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import {
  Box,
  Text,
  TextInput,
  Button,
  Icon,
  Checkbox,
  Radios,
} from "@components";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setName, setWeight, setWeightUnit } from "@store/slices/userSlice";
import { selectUserInfo } from "@store/slices/userSlice";
import type { RootScreenProps } from "@types";
import { Fragment } from "react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  weight: z.string().min(1, "Weight is required"),
  unit: z.enum(["kg", "lbs"]),
  updateProteinGoal: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const Form = (props: RootScreenProps<"PersonalInfo">) => {
  const user = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      weight: user.weight.value.toString(),
      unit: user.weight.unit,
      updateProteinGoal: false,
    },
  });

  const onSubmit = (data: FormData) => {
    dispatch(setName(data.name.trim()));
    dispatch(setWeight(Number(data.weight)));
    dispatch(setWeightUnit(data.unit));

    if (data.updateProteinGoal) {
    }
  };

  return (
    <Box flex={1} backgroundColor="mainBackground" padding="l">
      <StatusBar style={"light"} backgroundColor={"transparent"} translucent />
      <Box flex={1}>
        {Platform.OS === "ios" && (
          <Fragment>
            <Button
              onPress={() => props.navigation.goBack()}
              variant="circleButton"
              style={{ position: "absolute", top: -12, right: -12 }}
              icon={
                <Icon icon={X} size={20} color="primaryText" strokeWidth={2} />
              }
            />
            <Text variant="header" marginBottom="xl">
              Personal Info
            </Text>
          </Fragment>
        )}
        <Box marginBottom="m">
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
        <Box flexDirection="row" gap="l" alignItems="flex-start">
          <Box flex={1}>
            <Text variant="label">Weight</Text>
            <Controller
              control={control}
              name="weight"
              render={({ field: { onChange, value } }) => {
                return (
                  <TextInput
                    value={value.toString()}
                    onChangeText={(v) => onChange(v.toString())}
                    placeholder="Your weight"
                    keyboardType="numeric"
                    error={!!errors.weight}
                  />
                );
              }}
            />
            {errors.weight && (
              <Text variant="caption" color="error" marginTop="xs">
                {errors.weight.message}
              </Text>
            )}
          </Box>
          <Box>
            <Text variant="label">Units</Text>
            <Box marginTop="s">
              <Controller
                control={control}
                name="unit"
                render={({ field: { onChange, value } }) => (
                  <Radios
                    options={
                      [
                        { label: "lbs", value: "lbs" },
                        { label: "kg", value: "kg" },
                      ] as const
                    }
                    defaultValue={value}
                    onChange={onChange}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
        {dirtyFields.weight && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Box marginTop="l" gap="m">
              <Text color="tertiaryText" fontSize={14}>
                Your protein requirements may be different based on your new
                weight. Would you like to automatically update your daily goal?
              </Text>
              <Controller
                control={control}
                name="updateProteinGoal"
                render={({ field: { onChange, value } }) => (
                  <Checkbox label="Yes" value={value} onChange={onChange} />
                )}
              />
            </Box>
          </Animated.View>
        )}
        <Animated.View layout={LinearTransition}>
          <Box marginTop="xl">
            <Button
              variant="primary"
              label="Save Changes"
              onPress={handleSubmit(onSubmit)}
            />
          </Box>
        </Animated.View>
      </Box>
    </Box>
  );
};

export default function (props: RootScreenProps<"PersonalInfo">) {
  const [key, setKey] = useState(Math.random().toString(36).slice(0, 9));
  const [firstPass, setFirstPass] = useState(true);
  const user = useAppSelector(selectUserInfo);

  // There was a white flash when saving and this whole key setup
  // was the only hack that would make it go away.
  useEffect(() => {
    if (firstPass) {
      setFirstPass(false);
    } else {
      setKey(Math.random().toString(36).slice(0, 9));
    }
  }, [user]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!firstPass) {
      timeout = setTimeout(() => {
        props.navigation.goBack();
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [key]);

  return <Form key={key} {...props} />;
}
