import { Fragment } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch, useController } from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { LinearTransition } from "react-native-reanimated";
import { ArrowLeft, Plus } from "geist-native-icons";

import { useTheme } from "@shopify/restyle";

import { X } from "geist-native-icons";
import { z } from "zod";
import { Platform } from "react-native";
import {
  Box,
  Text,
  TextInput,
  Button,
  Icon,
  EmojiPicker,
  Tag,
} from "@components";
import { HomeScreenProps } from "@types";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  addFood,
  updateCreateFood,
  selectTags,
} from "@store/slices/foodsSlice";
import { TagMenu } from "./Menu";

const schema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  emoji: z.string().optional(),
  protein: z
    .string()
    .min(1, "Enter the amount of protein")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Must be a positive number",
    )
    .transform((val) => Number(val)),
  tags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

const AddFood = ({ navigation, route }: HomeScreenProps<"AddFood">) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      ...(route.params?.food || {}),
      protein: route.params?.food?.protein?.toString() as any,
    },
  });
  const tags = useAppSelector(selectTags);

  const onSubmit = (data: FormData) => {
    if (route.params?.food) {
      dispatch(updateCreateFood({ ...data, id: route.params.food.id }));
    } else {
      dispatch(addFood(data));
    }
    navigation.goBack();
  };

  const {
    field: { onChange: onEmojiChange },
  } = useController({ control, name: "emoji" });
  const emoji = useWatch({ control, name: "emoji" });

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingTop={Platform.OS === "ios" ? "none" : "xl"}
    >
      <EmojiPicker
        value={emoji}
        onChange={onEmojiChange}
        title="Emoji"
        as="inline"
      >
        <Box flex={1} padding="l">
          <Button
            backgroundColor="transparent"
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", top: -24, right: -24 }}
            icon={
              <Icon icon={X} size={20} color="primaryText" strokeWidth={2} />
            }
          />
          <Box
            borderBottomWidth={1.5}
            borderBottomColor="seperator"
            flexDirection="row"
            alignItems="center"
            gap="s"
            paddingBottom="m"
            marginBottom="xl"
          >
            {Platform.OS === "ios" ? (
              <Button
                onPress={() => navigation.goBack()}
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
            ) : (
              <Button
                onPress={() => navigation.goBack()}
                icon={
                  <Icon
                    icon={ArrowLeft}
                    size={24}
                    strokeWidth={2.5}
                    color="primaryText"
                  />
                }
              />
            )}
            <Text variant="header">
              {route.params?.food ? "Edit Food" : "Add Food"}
            </Text>
          </Box>
          <Box gap="m">
            <Box>
              <Text variant="label">Name</Text>
              <Box>
                <Box flexDirection="row" gap="s" alignItems="center">
                  <EmojiPicker.Trigger>
                    <Box
                      padding={emoji ? "s" : "sm"}
                      backgroundColor="secondaryBackground"
                      borderRadius="m"
                    >
                      <Box
                        paddingVertical={emoji ? "xxs" : "xs"}
                        paddingHorizontal="xs"
                      >
                        {emoji ? (
                          <Text padding="xs" margin="xs">
                            {emoji}
                          </Text>
                        ) : (
                          <Ionicons
                            name="fast-food"
                            size={22}
                            color={theme.colors.secondaryText}
                          />
                        )}
                      </Box>
                    </Box>
                  </EmojiPicker.Trigger>
                  <Box flex={1}>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="e.g. Protein Shake"
                          error={!!errors.name}
                        />
                      )}
                    />
                  </Box>
                </Box>
                {errors.name && (
                  <Box
                    flexDirection="row"
                    gap="s"
                    alignItems="center"
                    marginTop="s"
                  >
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color={theme.colors.error}
                    />
                    <Text variant="caption" color="error">
                      {errors.name.message}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
            <Box flexDirection="row" gap="m">
              <Box flex={1}>
                <Text variant="label">Protein (g)</Text>
                <Controller
                  control={control}
                  name="protein"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value?.toString()}
                      onChangeText={(e) => onChange(e.toString())}
                      placeholder="31"
                      keyboardType="numeric"
                      autoCapitalize="words"
                      error={!!errors.protein}
                    />
                  )}
                />
                {errors.protein && (
                  <Box
                    flexDirection="row"
                    gap="s"
                    alignItems="center"
                    marginTop="s"
                  >
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color={theme.colors.error}
                    />
                    <Text variant="caption" color="error">
                      {errors.protein.message}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
            <Box>
              <Text variant="label">Tags</Text>
              <Box flexDirection="row" gap="sm" flexWrap="wrap">
                <Controller
                  control={control}
                  name="tags"
                  render={({ field: { onChange, value } }) => (
                    <Fragment>
                      {tags.map((tag) => (
                        <Animated.View layout={LinearTransition} key={tag.id}>
                          <TagMenu tagId={tag.id}>
                            <Tag
                              label={tag.name}
                              color={tag.color}
                              onPress={() => {
                                if (value?.includes(tag.id)) {
                                  onChange(value.filter((t) => t !== tag.id));
                                } else {
                                  onChange(
                                    value ? [...value, tag.id] : [tag.id],
                                  );
                                }
                              }}
                              selected={value?.includes(tag.id) ?? false}
                            />
                          </TagMenu>
                        </Animated.View>
                      ))}
                    </Fragment>
                  )}
                />
                <Animated.View layout={LinearTransition}>
                  <Button
                    onPress={() => navigation.navigate("NewTag")}
                    label="New"
                    labelPlacement="left"
                    fontSize={14}
                    lineHeight={16}
                    variant="pillMedium"
                    backgroundColor="transparent"
                    borderColor="borderColor"
                    borderWidth={1.5}
                    icon={
                      <Icon
                        icon={Plus}
                        size={16}
                        color="primaryText"
                        strokeWidth={2}
                      />
                    }
                  />
                </Animated.View>
              </Box>
            </Box>
          </Box>
          <Box marginTop="xl">
            <Button
              variant="primary"
              label={route.params?.food ? "Save Changes" : "Add Food"}
              onPress={handleSubmit(onSubmit)}
              labelPlacement="left"
            />
          </Box>
        </Box>
      </EmojiPicker>
    </Box>
  );
};

export default AddFood;
