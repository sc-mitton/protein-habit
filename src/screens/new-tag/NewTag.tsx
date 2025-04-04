import {
  Platform,
  StatusBar,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import * as Haptics from "expo-haptics";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Box, Text, Button, TextInput, Icon } from "@components";
import { HomeScreenProps } from "@types";
import { useAppDispatch } from "@store/hooks";
import { addTag } from "@store/slices/foodsSlice";
import type { Theme } from "@theme";
import { AccentOption } from "@constants/accents";
import { ArrowLeft, X } from "geist-native-icons";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string() as z.ZodType<AccentOption>,
});

type FormData = z.infer<typeof schema>;

const COLORS = ["blue", "green", "yellow", "orange", "red", "purple"] as const;

const NewTag = (props: HomeScreenProps<"NewTagModal">) => {
  const theme = useTheme<Theme>();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      color: "blue",
    },
  });

  const onSubmit = (data: FormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(
      addTag({
        name: data.name.trim(),
        color: data.color,
        id: "", // ID will be generated in reducer
      }),
    );
    props.navigation.goBack();
  };

  return (
    <Box
      padding="l"
      flex={1}
      backgroundColor="mainBackground"
      paddingTop={Platform.OS === "ios" ? "l" : "xxxl"}
    >
      {Platform.OS === "ios" && (
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent
        />
      )}
      <Box borderBottomWidth={1} borderColor="borderColor" marginBottom="m">
        <Box flexDirection="row" alignItems="center" gap="s" marginBottom="m">
          {Platform.OS === "android" ? (
            <Button
              onPress={() => props.navigation.goBack()}
              icon={
                <Icon
                  icon={ArrowLeft}
                  size={24}
                  strokeWidth={2.5}
                  color="primaryText"
                />
              }
            />
          ) : (
            <Button
              onPress={() => props.navigation.goBack()}
              variant="circleButton"
              style={{ position: "absolute", top: -12, right: -12 }}
              icon={
                <Icon
                  icon={X}
                  size={18}
                  color="primaryText"
                  strokeWidth={2.5}
                />
              }
            />
          )}
          <Text variant="header">New Tag</Text>
        </Box>
      </Box>

      <Box gap="m">
        <Box>
          <Text color="secondaryText" marginBottom="xs">
            Name
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                backgroundColor="inputBackground"
                onChangeText={onChange}
                placeholder="e.g. Breakfast"
                autoCapitalize="words"
                autoFocus
              />
            )}
          />
        </Box>

        <Box>
          <Text color="secondaryText" marginBottom="xs">
            Color
          </Text>
          <Controller
            control={control}
            name="color"
            render={({ field: { onChange, value } }) => (
              <Box
                flexDirection="row"
                flexWrap="wrap"
                gap="m"
                marginTop="s"
                marginBottom="m"
                justifyContent="center"
              >
                {COLORS.map((colorName) => (
                  <Pressable
                    key={colorName}
                    onPress={() => onChange(colorName)}
                  >
                    <Box
                      borderRadius="full"
                      borderWidth={2}
                      borderColor={
                        value === colorName ? "selected" : "transparent"
                      }
                      padding="xs"
                    >
                      <Box
                        width={20}
                        height={20}
                        borderRadius="full"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={colorName}
                      />
                      <Box
                        borderRadius="full"
                        style={[
                          styles.border,
                          {
                            borderColor: (theme.colors[colorName] as string)
                              .replace(
                                /(\d+)%\)$/,
                                (match) =>
                                  `${Math.max(0, parseInt(match) - 30)}%)`,
                              )
                              .replace(
                                /(\d+)%,/,
                                (match) =>
                                  `${Math.max(0, parseInt(match) - 20)}%,`,
                              ),
                          },
                        ]}
                      />
                    </Box>
                  </Pressable>
                ))}
              </Box>
            )}
          />
        </Box>

        <Button
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          label="Save"
          labelPlacement="right"
        />
      </Box>
    </Box>
  );
};

export default NewTag;

const styles = StyleSheet.create({
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    opacity: 1,
  },
});
