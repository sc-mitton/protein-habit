import { createTheme } from "@shopify/restyle";
import { StatusBar } from "react-native";

const palette = {
  gray50: "hsla(30, 4%, 98%, 1)",
  gray100: "hsla(30, 4%, 96%, 1)",
  gray200: "hsla(30, 4%, 90%, 1)",
  gray300: "hsla(30, 4%, 83%, 1)",
  gray400: "hsla(30, 4%, 74%, 1)",
  gray500: "hsla(30, 4%, 62%, 1)",
  gray600: "hsla(30, 4%, 46%, 1)",
  gray700: "hsla(30, 4%, 38%, 1)",
  gray800: "hsla(30, 4%, 26%, 1)",
  gray850: "hsla(30, 4%, 18%, 1)",
  gray900: "hsla(30, 4%, 13%, 1)",
};

// Light theme
const lightTheme = createTheme({
  colors: {
    mainBackground: palette.gray100,
    secondaryBackground: palette.gray100
      .replace(
        /(\d+)%,\s\d\)/,
        (match) => `${Math.max(0, parseInt(match) + 4)}%, 1)`,
      )
      .toString(),
    cardBackground: palette.gray100,
    secondaryCardBackground: palette.gray200,
    primaryText: palette.gray900,
    secondaryText: palette.gray600,
    tertiaryText: palette.gray300,
    quaternaryText: palette.gray300,
    borderColor: palette.gray200,
    transparent: "transparent",
    error: "hsla(0, 84%, 60%, 1)",
    selected: "hsla(210, 100%, 50%, 1)",
    selectedSecondary: "hsla(210, 100%, 50%, .5)",
    unselected: "transparent",
    seperator: palette.gray200,
    overlay: "rgba(0, 0, 0, 0.5)",
    radioCardSelected: palette.gray700,
    radioCardUnselected: palette.gray800,
  },
  spacing: {
    ns: -4,
    nxs: -2,
    none: 0,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
  boxVariants: {
    defaults: {},
  },
  borderRadii: {
    none: 0,
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  buttonVariants: {
    primary: {
      backgroundColor: "primaryText",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter-SemiBold",
      color: "mainBackground",
      padding: "m",
      borderRadius: "m",
    },
    borderedPrimary: {
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter-SemiBold",
      color: "primaryText",
      padding: "m",
      borderRadius: "m",
      borderWidth: 1,
      borderColor: "seperator",
    },
    secondary: {
      backgroundColor: "cardBackground",
      padding: "m",
      borderRadius: "m",
      borderWidth: 1,
      color: "primaryText",
      borderColor: "borderColor",
      alignItems: "center",
      justifyContent: "center",
    },
    defaults: {
      backgroundColor: "cardBackground",
      padding: "m",
      borderRadius: "m",
    },
  },
  textVariants: {
    header: {
      fontFamily: "Inter-Bold",
      fontSize: 20,
      lineHeight: 26,
      color: "primaryText",
    },
    subtitle: {
      fontFamily: "Inter-SemiBold",
      fontSize: 16,
      lineHeight: 24,
      color: "secondaryText",
    },
    caption: {
      fontFamily: "Inter-Regular",
      fontSize: 12,
      lineHeight: 16,
      color: "secondaryText",
    },
    subheader: {
      fontFamily: "Inter-SemiBold",
      fontSize: 16,
      lineHeight: 24,
      color: "secondaryText",
    },
    body: {
      fontFamily: "Inter-Regular",
      fontSize: 16,
      lineHeight: 24,
      color: "primaryText",
    },
    label: {
      fontFamily: "Inter-Medium",
      fontSize: 14,
      lineHeight: 20,
      color: "secondaryText",
    },
    defaults: {
      fontFamily: "Inter-Regular",
      fontSize: 16,
      lineHeight: 24,
      color: "primaryText",
    },
    light: {
      fontFamily: "Inter-Light",
    },
    bold: {
      fontFamily: "Inter-Bold",
    },
    nyHeavy: {
      fontFamily: "NewYork-Heavy",
    },
    sfRails: {
      fontFamily: "SFPro-SemiboldRails",
    },
    sfRounded: {
      fontFamily: "SFPro-SemiboldRounded",
    },
    sfSoft: {
      fontFamily: "SFPro-SemiboldSoft",
    },
    sfStencil: {
      fontFamily: "SFPro-SemiboldStencil",
    },
  },
});

// Dark theme
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    mainBackground: palette.gray900,
    secondaryBackground: palette.gray900
      .replace(
        /(\d+)%,\s\d\)/,
        (match) => `${Math.max(0, parseInt(match) - 2)}%, 1)`,
      )
      .toString(),
    cardBackground: palette.gray850,
    secondaryCardBackground: palette.gray700,
    primaryText: palette.gray50,
    secondaryText: palette.gray400,
    tertiaryText: palette.gray600,
    quaternaryText: palette.gray800,
    borderColor: palette.gray850,
    seperator: palette.gray850,
    overlay: "rgba(0, 0, 0, 0.9)",
    radioCardSelected: palette.gray200,
    radioCardUnselected: palette.gray100,
  },
};

export type Theme = typeof lightTheme;
export default lightTheme;

// ReStyle type augmentation
declare module "@shopify/restyle" {
  type ThemeType = Theme;
}
