import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch, useController } from "react-hook-form";
import { AlertCircle, Smile } from "geist-native-icons";
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
  BackButton,
} from "@components";
import { RootScreenProps } from "@types";
import { useAppDispatch } from "@store/hooks";
import { addFood } from "@store/slices/foodsSlice";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  emoji: z.string().optional(),
  protein: z
    .string()
    .min(1, "Enter the amount of protein")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, "Must be a positive number"),
});

type FormData = z.infer<typeof schema>;

const AddFood = ({ navigation }: RootScreenProps<"AddFood">) => {
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = (data: FormData) => {
    dispatch(
      addFood({
        id: Math.random().toString(36).slice(2),
        name: data.name,
        emoji: data.emoji,
        protein: Number(data.protein),
      }),
    );
    navigation.goBack();
  };

  const {
    field: { onChange: onEmojiChange },
  } = useController({ control, name: "emoji" });
  const emoji = useWatch({ control, name: "emoji" });

  console.log(errors);

  return (
    <Box flex={1} backgroundColor="mainBackground">
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
            paddingBottom="m"
            marginBottom="xl"
          >
            {Platform.OS === "android" ? (
              <BackButton />
            ) : (
              <Text variant="header">Add Food</Text>
            )}
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
                          <Text padding="xs">{emoji}</Text>
                        ) : (
                          <Icon icon={Smile} color="secondaryText" size={22} />
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
                    <Icon icon={AlertCircle} size={16} color="error" />
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
                      onChangeText={onChange}
                      placeholder="31"
                      keyboardType="numeric"
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
                    <Icon icon={AlertCircle} size={16} color="error" />
                    <Text variant="caption" color="error">
                      {errors.protein.message}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box marginTop="xl">
            <Button
              variant="primary"
              label="Add Food"
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
