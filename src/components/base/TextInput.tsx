import { TextInput as RNTextInput, TextInputProps } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@theme";
import { createBox } from "@shopify/restyle";
import { forwardRef, useState } from "react";

const InputBox = createBox<Theme>();

interface BaseTextInputProps extends TextInputProps {
  error?: boolean;
}

export const TextInput = forwardRef<RNTextInput, BaseTextInputProps>(
  ({ error, style, ...props }, ref) => {
    const theme = useTheme<Theme>();
    const [isFocused, setIsFocused] = useState(false);

    return (
      <InputBox
        borderWidth={1}
        borderColor={
          error ? "error" : isFocused ? "primaryText" : "borderColor"
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.secondaryText}
          selectionColor={theme.colors.primaryText}
          {...props}
        />
      </InputBox>
    );
  },
);

TextInput.displayName = "TextInput";
