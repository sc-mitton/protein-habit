import {
  TextInput as RNTextInput,
  TextInputProps,
  Keyboard,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@theme";
import { Box } from ".";
import { createBox } from "@shopify/restyle";
import { forwardRef, useState } from "react";
import OutsidePressHandler from "react-native-outside-press";

const InputBox = createBox<Theme>();

interface BaseTextInputProps extends TextInputProps {
  error?: boolean;
  borderLess?: boolean;
}

export const TextInput = forwardRef<RNTextInput, BaseTextInputProps>(
  ({ error, style, children, onFocus, onBlur, borderLess, ...props }, ref) => {
    const theme = useTheme<Theme>();
    const [isFocused, setIsFocused] = useState(false);

    return (
      <OutsidePressHandler onOutsidePress={() => Keyboard.dismiss()}>
        <Box
          borderWidth={2}
          style={{ borderRadius: 12 }}
          borderColor={
            borderLess
              ? "transparent"
              : error
                ? "errorSecondary"
                : isFocused
                  ? "borderColor"
                  : "transparent"
          }
        >
          <InputBox
            borderWidth={1.5}
            backgroundColor="secondaryBackground"
            borderColor={
              borderLess
                ? "transparent"
                : error
                  ? "error"
                  : isFocused
                    ? "borderColorBold"
                    : "transparent"
            }
            borderRadius={"m"}
            padding="m"
          >
            <RNTextInput
              ref={ref}
              style={[
                {
                  color: theme.colors.primaryText,
                  fontFamily: "Inter-Regular",
                  fontSize: 16,
                  padding: 0,
                },
                style,
              ]}
              onFocus={(e) => {
                onFocus && onFocus(e);
                setIsFocused(true);
              }}
              onBlur={(e) => {
                onBlur && onBlur(e);
                setIsFocused(false);
              }}
              placeholderTextColor={theme.colors.placeholderText}
              selectionColor={theme.colors.primaryText}
              {...props}
            />
            {children}
          </InputBox>
        </Box>
      </OutsidePressHandler>
    );
  },
);

TextInput.displayName = "TextInput";
