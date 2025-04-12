import Mark from "react-native-markdown-display";
import { useTheme } from "@shopify/restyle";

import { Theme } from "@theme";

interface Props {
  children: React.ReactNode;
}

export const Markdown = ({ children }: Props) => {
  const theme = useTheme<Theme>();
  return (
    <Mark
      style={{
        body: {
          ...theme.textVariants.body,
          fontSize: 15,
          lineHeight: 28,
          color: theme.colors.primaryText,
        },
        heading2: {
          height: 0,
        },
        heading3: {
          ...theme.textVariants.body,
          marginTop: 16,
          marginBottom: 8,
          color: theme.colors.secondaryText,
        },
      }}
    >
      {children}
    </Mark>
  );
};
