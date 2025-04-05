import { useTheme } from "@shopify/restyle";
import { useColorScheme } from "react-native";

import type { Theme } from "@theme";

export const useNavigationTheme = () => {
  const theme = useTheme<Theme>();
  const colorScheme = useColorScheme();

  return {
    dark: colorScheme === "dark",
    colors: {
      primary: theme.colors.primaryText,
      background: theme.colors.mainBackground,
      card: theme.colors.mainBackground,
      text: theme.colors.primaryText,
      border: theme.colors.mainBackground,
      notification: theme.colors.primaryText,
    },
    fonts: {
      regular: {
        fontFamily: "Inter-Regular",
        fontWeight: "normal",
      },
      medium: {
        fontFamily: "Inter-Medium",
        fontWeight: "normal",
      },
      bold: {
        fontFamily: "Inter-Bold",
        fontWeight: "normal",
      },
      heavy: {
        fontFamily: "Inter-Bold",
        fontWeight: "normal",
      },
    },
  } as const;
};
